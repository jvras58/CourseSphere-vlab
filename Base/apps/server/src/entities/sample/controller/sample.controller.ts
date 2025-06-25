import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { SampleService } from '../services/sample.service';
import { SampleFilters } from '../types';

export class SampleController {
  private service: SampleService;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.service = new SampleService(prisma, fastify);
  }

  async getAll(
    request: FastifyRequest<{ Querystring: SampleFilters }>,
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
      const sample = await this.service.getById(userId, request.params.id);
      reply.send(sample);
    } catch (error) {
      reply.status(404).send({ message: (error as Error).message });
    }
  }

  async create(
    request: FastifyRequest<{ Body: { name: string; description?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const sample = await this.service.create(userId, request.body);
      reply.status(201).send(sample);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { name?: string; description?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as any).sub.userId;
      const sample = await this.service.update(userId, request.params.id, request.body);
      reply.send(sample);
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