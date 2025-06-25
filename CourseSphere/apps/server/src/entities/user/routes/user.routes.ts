import { FastifyInstance } from 'fastify';
import { UserController } from '../controller/user.controller';
import { UserFilters, CreateUserBody, UpdateUserBody, ManageRoleBody } from '../types';

export default async function userRoutes(fastify: FastifyInstance) {
  const controller = new UserController(fastify.prisma, fastify);

  fastify.get<{
    Querystring: UserFilters;
  }>('/', {
    schema: {
      description: 'Get all usuários (somente administrador) com filtros e paginação',
      tags: ['User'],
      querystring: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, description: 'Correspondência parcial para nome de usuário (sem distinção de maiúsculas e minúsculas)' },
          email: { type: 'string', format: 'email', description: 'Correspondência parcial para email de usuário (sem distinção de maiúsculas e minúsculas)' },
          page: { type: 'number', minimum: 1, default: 1, description: 'Número da página' },
          limit: { type: 'number', minimum: 10, maximum: 20, default: 10, description: 'Itens por página (10-20)' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  bio: { type: 'string', nullable: true },
                  image: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  isActive: { type: 'boolean' },
                  role_id: { type: 'number' },
                },
              },
            },
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
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
      description: 'Get a user by ID (somente administrador)',
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
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

  fastify.post<{
    Body: CreateUserBody;
  }>('/', {
    schema: {
      description: 'Create a new user (somente administrador)',
      tags: ['User'],
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          bio: { type: 'string', nullable: true },
          image: { type: 'string', format: 'uri', nullable: true },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            bio: { type: 'string', nullable: true },
            image: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            isActive: { type: 'boolean' },
            role_id: { type: 'number' },
          },
        },
      },
    },
    handler: controller.create.bind(controller),
  });

  fastify.put<{
    Params: { id: string };
    Body: UpdateUserBody;
  }>('/:id', {
    schema: {
      description: 'Update a user (somente administrador)',
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
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          bio: { type: 'string', nullable: true },
          image: { type: 'string', format: 'uri', nullable: true },
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
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

  fastify.delete<{
    Params: { id: string };
  }>('/:id', {
    schema: {
      description: 'Soft delete a user (somente administrador)',
      tags: ['User'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      response: {
        204: { type: 'null' },
      },
      security: [{ bearerAuth: [] }],
    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: controller.delete.bind(controller),
  });

  fastify.patch<{
    Params: { id: string };
    Body: ManageRoleBody;
  }>('/:id/role', {
    schema: {
      description: 'Update a user’s role ou criar um instrutor (somente administrador)',
      tags: ['User'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['role_id'],
        properties: {
          role_id: { type: 'number', minimum: 1 },
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            isActive: { type: 'boolean' },
            role_id: { type: 'number' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: controller.manageRole.bind(controller),
  });
}