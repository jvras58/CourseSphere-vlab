import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { CourseService } from '../services/course.service';
import { CourseFilters, CreateCourseBody, UpdateCourseBody, AddInstructorBody } from '../types';

export class CourseController {
  private service: CourseService;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.service = new CourseService(prisma, fastify);
  }

  async getAll(
    request: FastifyRequest<{ Querystring: CourseFilters }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const { items, total, page, limit } = await this.service.getAll(userId, request.query);
      reply.send({ items, total, page, limit });
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const course = await this.service.getById(userId, request.params.id);
      reply.send(course);
    } catch (error) {
      reply.status(404).send({ message: (error as Error).message });
    }
  }

  async create(
    request: FastifyRequest<{ Body: CreateCourseBody }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const schema = z.object({
        name: z.string().min(3),
        description: z.string().max(500).optional(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime().refine(
          (endDate) => new Date(endDate) > new Date(request.body.startDate),
          { message: 'A data final deve ser posterior à data inicial' }
        ),
      });
      const data = schema.parse(request.body);
      const course = await this.service.create(userId, data);
      reply.status(201).send(course);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateCourseBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const schema = z.object({
        name: z.string().min(3).optional(),
        description: z.string().max(500).optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional().refine(
          (endDate) => !request.body.startDate || !endDate || new Date(endDate) > new Date(request.body.startDate),
          { message: 'A data final deve ser posterior à data inicial' }
        ),
      });
      const data = schema.parse(request.body);
      const course = await this.service.update(userId, request.params.id, data);
      reply.send(course);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      await this.service.delete(userId, request.params.id);
      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async addInstructor(
    request: FastifyRequest<{
      Params: { id: string };
      Body: AddInstructorBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const schema = z.object({
        userId: z.string(),
      });
      const data = schema.parse(request.body);
      const courseInstructor = await this.service.addInstructor(userId, request.params.id, data.userId);
      reply.status(201).send(courseInstructor);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async removeInstructor(
    request: FastifyRequest<{
      Params: { id: string; instructorId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      await this.service.removeInstructor(userId, request.params.id, request.params.instructorId);
      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }
}