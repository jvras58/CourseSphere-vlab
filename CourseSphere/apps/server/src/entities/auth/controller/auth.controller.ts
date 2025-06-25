import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest, FastifyInstance  } from 'fastify';

import { SignInInput, SignUpInput } from '../types/index';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.authService = new AuthService(prisma, fastify);
  }

  async login(request: FastifyRequest<{ Body: SignInInput }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;
      const user = await this.authService.validateLocalUser( email, password );
      const token = await this.authService.generateToken(user.id, user.role_id);
      reply.send({ user, token });
    } catch (error) {
      reply.status(401).send({ message: (error as Error).message });
    }
  }

  async register(request: FastifyRequest<{ Body: SignUpInput }>, reply: FastifyReply) {
    try {
      const { name, email, password } = request.body;
      const user = await this.authService.registerUser(name, email, password);
      reply.status(201).send(user);
    } catch (error) {
      reply.status(400).send({ message: (error as Error).message });
    }
  }
}