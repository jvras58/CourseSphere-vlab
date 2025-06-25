import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UserService } from '../services/user.service';
import { UserFilters, CreateUserBody, UpdateUserBody, ManageRoleBody } from '../types';

export class UserController {
  private service: UserService;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.service = new UserService(prisma, fastify);
  }

  async getAll(
    request: FastifyRequest<{ Querystring: UserFilters }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as { sub: { userId: string } }).sub.userId;
      const schema = z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(10).max(20).default(10),
      });
      const filters = schema.parse(request.query);
      const { items, total, page, limit } = await this.service.getAll(userId, filters);
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
      const userId = (request.user as { sub: { userId: string } }).sub.userId;
      const user = await this.service.getById(userId, request.params.id);
      reply.send(user);
    } catch (error) {
      reply.status(404).send({ message: (error as Error).message });
    }
  }

  async create(
    request: FastifyRequest<{ Body: CreateUserBody }>,
    reply: FastifyReply
  ) {
    try {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        bio: z.string().optional(),
        image: z.string().url().optional(),
      });
      const data = schema.parse(request.body);
      const user = await this.service.create(data);
      reply.status(201).send(user);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateUserBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as { sub: { userId: string } }).sub.userId;
      const schema = z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        bio: z.string().optional(),
        image: z.string().url().optional(),
      });
      const data = schema.parse(request.body);
      const user = await this.service.update(userId, request.params.id, data);
      reply.send(user);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as { sub: { userId: string } }).sub.userId;
      await this.service.delete(userId, request.params.id);
      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async manageRole(
    request: FastifyRequest<{
      Params: { id: string };
      Body: ManageRoleBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request.user as { sub: { userId: string } }).sub.userId;
      const schema = z.object({
        role_id: z.number().int().positive(),
      });
      const data = schema.parse(request.body);
      const user = await this.service.manageRole(userId, request.params.id, data);
      reply.send(user);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }
}