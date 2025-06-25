import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../services/user.service';

export class UserController {
  private service: UserService;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.service = new UserService(prisma, fastify);
  }

  async getAll(request: FastifyRequest<{ Querystring: { name?: string; email?: string; } }>, reply: FastifyReply) {
    try {
      const userId = (request.user as { sub: { userId: string } }).sub.userId;
      const users = await this.service.getAll(userId, request.query);
      reply.send(users);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const userId = (request.user as { sub: { userId: string } }).sub.userId;
      const user = await this.service.getById(userId, request.params.id);
      reply.send(user);
    } catch (error) {
      reply.status(404).send({ message: (error as Error).message });
    }
  }
  //TODO: Update self user
  async update(request: FastifyRequest<{
    Params: { id: string };
    Body: { name?: string; email?: string; password?: string; bio?: string; image?: string };
  }>, reply: FastifyReply) {
    try {
      const userId = (request.user as { sub: { userId: string } }).sub.userId;
      const user = await this.service.update(userId, request.params.id, request.body);
      reply.send(user);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }
}