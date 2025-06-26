import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized';
import { CourseFilters, CreateCourseBody, UpdateCourseBody } from '../types';

export class CourseService {
  private prisma: PrismaClient;
  private fastify: FastifyInstance;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.prisma = prisma;
    this.fastify = fastify;
  }

  private async checkCreatorPermission(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new Error('Curso não encontrado');
    if (course.creatorId !== userId) {
      throw new UnauthorizedException('Apenas o criador do curso pode realizar esta ação');
    }
  }

  private async checkInstructorPermission(userId: string, courseId: string) {
    const courseInstructor = await this.prisma.courseInstructor.findFirst({
      where: { courseId, userId },
    });
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new Error('Curso não encontrado');
    if (course.creatorId !== userId && !courseInstructor) {
      throw new UnauthorizedException('O usuário não é um instrutor ou criador do curso');
    }
  } 

  async getAll(
    userId: string,
    filters: CourseFilters
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    const {
      name,
      description,
      createdFrom,
      createdTo,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {
      OR: [
        { creatorId: userId },
        { instructors: { some: { userId } } },
      ],
    };
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (description) where.description = { contains: description, mode: 'insensitive' };
    if (createdFrom) where.createdAt = { ...where.createdAt, gte: new Date(createdFrom) };
    if (createdTo) where.createdAt = { ...where.createdAt, lte: new Date(createdTo) };

    const total = await this.prisma.course.count({ where });
    const items = await this.prisma.course.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        instructors: true,
        students: true,
      },
    });

    return { items, total, page, limit };
  }

  async getById(userId: string, courseId: string) {
    await this.checkInstructorPermission(userId, courseId);
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructors: true,
        students: true,
      },
    });
    if (!course) throw new Error('Curso não encontrado');
    return course;
  }

  async create(userId: string, data: CreateCourseBody) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { name: data.name },
    });
    if (existingCourse) throw new Error('O nome do curso deve ser único');

    return this.prisma.course.create({
      data: {
        ...data,
        creatorId: userId,
        instructors: {
          create: [{ userId }],
        },
      },
      include: {
        instructors: true,
        students: true,
      },
    });
  }

  async update(userId: string, courseId: string, data: UpdateCourseBody) {
    await this.checkCreatorPermission(userId, courseId);
    if (data.name) {
      const existingCourse = await this.prisma.course.findUnique({
        where: { name: data.name },
      });
      if (existingCourse && existingCourse.id !== courseId) {
        throw new Error('O nome do curso deve ser único');
      }
    }
    return this.prisma.course.update({
      where: { id: courseId },
      data,
      include: {
        instructors: true,
        students: true,
      },
    });
  }

  async delete(userId: string, courseId: string) {
    await this.checkCreatorPermission(userId, courseId);
    await this.prisma.course.delete({
      where: { id: courseId },
    });
  }

  async addInstructor(userId: string, courseId: string, instructorId: string) {
    await this.checkCreatorPermission(userId, courseId);
    const user = await this.prisma.user.findUnique({
      where: { id: instructorId },
    });
    if (!user) throw new Error('O instrutor não foi encontrado');

    // Example: Fetch candidate data from randomuser.me
    // TODO: Integrate with backend
    const response = await fetch('https://randomuser.me/api/');
    const candidateData = await response.json();
    if (!candidateData.results) throw new Error('Não foi possível buscar o candidato');

    return this.prisma.courseInstructor.create({
      data: {
        courseId,
        userId: instructorId,
      },
    });
  }

  async removeInstructor(userId: string, courseId: string, instructorId: string) {
    await this.checkCreatorPermission(userId, courseId);
    const courseInstructor = await this.prisma.courseInstructor.findFirst({
      where: { courseId, userId: instructorId },
    });
    if (!courseInstructor) throw new Error('O instrutor não foi encontrado no curso');
    if (instructorId === userId) throw new Error('O criador do curso não pode ser removido como instrutor');

    await this.prisma.courseInstructor.delete({
      where: {
        courseId_userId: { courseId, userId: instructorId },
      },
    });
  }
}