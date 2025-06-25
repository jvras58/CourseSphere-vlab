import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { LessonService } from '../services/lesson.service';
import { LessonFilters, CreateLessonBody, UpdateLessonBody, LessonStatus } from '../types';

export class LessonController {
  private service: LessonService;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.service = new LessonService(prisma, fastify);
  }

  async getAll(
    request: FastifyRequest<{ Querystring: LessonFilters }>,
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
      const lesson = await this.service.getById(userId, request.params.id);
      reply.send(lesson);
    } catch (error) {
      reply.status(404).send({ message: (error as Error).message });
    }
  }

  async create(
    request: FastifyRequest<{ Body: CreateLessonBody }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const schema = z.object({
        title: z.string().min(3),
        status: z.nativeEnum(LessonStatus),
        publishDate: z.string().datetime().refine(
          (date) => new Date(date) > new Date(),
          { message: 'publishDate must be in the future' }
        ),
        videoUrl: z.string().url(),
        youtubeId: z.string().optional(),
        thumbnailUrl: z.string().url().optional(),
        courseId: z.string(),
      });
      const data = schema.parse(request.body);
      const lesson = await this.service.create(userId, data);
      reply.status(201).send(lesson);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateLessonBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const schema = z.object({
        title: z.string().min(3).optional(),
        status: z.nativeEnum(LessonStatus).optional(),
        publishDate: z.string().datetime().optional().refine(
          (date) => !date || new Date(date) > new Date(),
          { message: 'publishDate must be in the future' }
        ),
        videoUrl: z.string().url().optional(),
        youtubeId: z.string().optional(),
        thumbnailUrl: z.string().url().optional(),
      });
      const data = schema.parse(request.body);
      const lesson = await this.service.update(userId, request.params.id, data);
      reply.send(lesson);
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
}