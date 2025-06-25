import { FastifyInstance } from 'fastify';
import { UserController } from '../controller/user.controller';


export default async function userRoutes(fastify: FastifyInstance) {
  const controller = new UserController(fastify.prisma, fastify);

  fastify.get<{
    Querystring: { name?: string; email?: string; };
  }>('/', {
    schema: {
      description: 'Get all users (admin only)',
      tags: ['User'],
      querystring: {
        type: 'object',
        properties: {
          name: { type: 'string'},
          email: { type: 'string', format: 'email'},
        },
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              bio: { type: 'string', nullable: true },
              image: { type: 'string', nullable: true },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              isActive: { type: 'boolean' },
              role_id: { type: 'number' },
            },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: controller.getAll.bind(controller),
  });

  fastify.get<{
    Params: { id: string };
  }>('/:id', {
    schema: {
      description: 'Get a user by ID (admin only)',
      tags: ['User'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            bio: { type: 'string', nullable: true },
            image: { type: 'string', nullable: true },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
            isActive: { type: 'boolean' },
            role_id: { type: 'number' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: controller.getById.bind(controller),
  });
  //TODO: Update self user
  fastify.put<{
    Params: { id: string };
    Body: { name?: string; email?: string; password?: string; bio?: string; image?: string };
  }>('/:id', {
    schema: {
      description: 'Update a user (admin only)',
      tags: ['User'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          bio: { type: 'string' },
          image: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            bio: { type: 'string', nullable: true },
            image: { type: 'string', nullable: true },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
            isActive: { type: 'boolean' },
            role_id: { type: 'number' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: controller.update.bind(controller),
  });
}