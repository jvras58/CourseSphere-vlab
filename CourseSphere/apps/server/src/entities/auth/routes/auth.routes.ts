import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { SignInInput, SignUpInput } from '../types';


export default async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify.prisma, fastify);

  fastify.post<{ Body: SignInInput }>('/login', {
    schema: {
      description: 'User login',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role_id: { type: 'number' },
              },
            },
            token: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
              },
            },
          },
        },
        401: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request: FastifyRequest<{ Body: SignInInput }>, reply: FastifyReply) => {
      try {
        const { email, password } = request.body;
        const user = await authService.validateLocalUser(email, password);
        const token = await authService.generateToken(user.id, user.role_id);
        return reply.send({ user, token });
      } catch (error) {
        return reply.status(401).send({ message: (error as Error).message });
      }
    },
  });

  fastify.post<{ Body: SignUpInput }>('/register', {
    schema: {
      description: 'User registration',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role_id: { type: 'number' },
          },
        },
        400: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request: FastifyRequest<{ Body: SignUpInput }>, reply: FastifyReply) => {
      try {
        const { name, email, password } = request.body;
        const user = await authService.registerUser(name, email, password);
        return reply.status(201).send(user);
      } catch (error) {
        return reply.status(400).send({ message: (error as Error).message });
      }
    },
  });
}