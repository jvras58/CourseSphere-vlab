import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized';
import { LessonFilters, CreateLessonBody, UpdateLessonBody } from '../types';

export class LessonService {
  private prisma: PrismaClient;
  private fastify: FastifyInstance;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.prisma = prisma;
    this.fastify = fastify;
  }

  private async checkInstructorOrCreatorPermission(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });
    if (!lesson) throw new Error('Lesson not found');
    if (lesson.creatorId === userId) return; // O criador da lição pode executar ações

    const course = lesson.course;
    if (course.creatorId === userId) return; // O criador do curso pode executar ações

    const courseInstructor = await this.prisma.courseInstructor.findFirst({
      where: { courseId: lesson.courseId, userId },
    });
    if (!courseInstructor) {
      throw new UnauthorizedException('O usuário não é um instrutor ou criador do curso');
    }
    throw new UnauthorizedException('Apenas o criador da lição ou o criador do curso pode realizar esta ação');
  }

  private async checkCourseInstructor(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { instructors: true },
    });
    if (!course) throw new Error('Curso não encontrado');
    if (course.creatorId === userId) return;
    if (course.instructors.some((instructor) => instructor.userId === userId)) return;
    throw new UnauthorizedException('O usuário não é um instrutor ou criador do curso');
  }

  async getAll(
    userId: string,
    filters: LessonFilters
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    const {
      title,
      status,
      courseId,
      page = 1,
      limit = 10,
    } = filters;

    if (courseId) {
      await this.checkCourseInstructor(userId, courseId);
    }

    const where: any = {
      course: {
        OR: [
          { creatorId: userId },
          { instructors: { some: { userId } } },
        ],
      },
    };
    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (status) where.status = status;
    if (courseId) where.courseId = courseId;

    try {
      const total = await this.prisma.lesson.count({ where });
      const items = await this.prisma.lesson.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, name: true } },
        },
      });

      return { items, total, page, limit };
    } catch (error) {
      throw new Error(`Erro ao buscar lições: ${(error as Error).message}`);
    }
  }

  async getById(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });
    if (!lesson) throw new Error('Lição não encontrada');
    await this.checkCourseInstructor(userId, lesson.courseId);
    return lesson;
  }

  async create(userId: string, data: CreateLessonBody) {
    await this.checkCourseInstructor(userId, data.courseId);
    const existingLesson = await this.prisma.lesson.findFirst({
      where: { title: data.title, courseId: data.courseId },
    });
    if (existingLesson) throw new Error('Título da lição deve ser único dentro do curso');

    return this.prisma.lesson.create({
      data: {
        ...data,
        creatorId: userId,
      },
    });
  }

  async update(userId: string, lessonId: string, data: UpdateLessonBody) {
    await this.checkInstructorOrCreatorPermission(userId, lessonId);
    if (data.title) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
      });
      const existingLesson = await this.prisma.lesson.findFirst({
        where: { title: data.title, courseId: lesson!.courseId },
      });
      if (existingLesson && existingLesson.id !== lessonId) {
        throw new Error('Título da lição deve ser único dentro do curso');
      }
    }
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data,
    });
  }

  async delete(userId: string, lessonId: string) {
    await this.checkInstructorOrCreatorPermission(userId, lessonId);
    await this.prisma.lesson.delete({
      where: { id: lessonId },
    });
  }
}