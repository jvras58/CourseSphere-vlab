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
    if (!course) throw new Error('Course not found');
    if (course.creatorId !== userId) {
      throw new UnauthorizedException('Only the course creator can perform this action');
    }
  }

  private async checkInstructorPermission(userId: string, courseId: string) {
    const courseInstructor = await this.prisma.courseInstructor.findFirst({
      where: { courseId, userId },
    });
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new Error('Course not found');
    if (course.creatorId !== userId && !courseInstructor) {
      throw new UnauthorizedException('User is not an instructor or creator of this course');
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
    if (!course) throw new Error('Course not found');
    return course;
  }

  async create(userId: string, data: CreateCourseBody) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { name: data.name },
    });
    if (existingCourse) throw new Error('Course name must be unique');

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
        throw new Error('Course name must be unique');
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
    if (!user) throw new Error('Instructor not found');

    // Example: Fetch candidate data from randomuser.me (mocked for simplicity)
    // In production, integrate with axios or fastify.http to call https://randomuser.me/api/
    const response = await fetch('https://randomuser.me/api/');
    const candidateData = await response.json();
    if (!candidateData.results) throw new Error('Failed to fetch instructor candidate');

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
    if (!courseInstructor) throw new Error('Instructor not found in course');
    if (instructorId === userId) throw new Error('Creator cannot be removed as instructor');

    await this.prisma.courseInstructor.delete({
      where: {
        courseId_userId: { courseId, userId: instructorId },
      },
    });
  }
}