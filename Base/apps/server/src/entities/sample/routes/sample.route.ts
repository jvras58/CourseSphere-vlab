import { FastifyInstance } from 'fastify';
import { SampleController } from '../controller/sample.controller';
import { SampleFilters } from '../types';

export default async function sampleRoutes(fastify: FastifyInstance) {
  const controller = new SampleController(fastify.prisma, fastify);

  fastify.get<{ Querystring: SampleFilters }>(
    '/',
    {
      schema: {
        description: 'Get all samples for the authenticated user',
        tags: ['Sample'],
        querystring: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            createdFrom: { type: 'string' },
            createdTo: { type: 'string' },
            page: { type: 'number' },
            limit: { type: 'number' },
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
                    description: { type: 'string', nullable: true },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                    user_id: { type: 'string' },
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
    },
    controller.getAll.bind(controller)
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        description: 'Get a sample by ID',
        tags: ['Sample'],
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              user_id: { type: 'string' },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
    },
    controller.getById.bind(controller)
  );

  fastify.post<{ Body: { name: string; description?: string } }>(
    '/',
    {
      schema: {
        description: 'Create a new sample',
        tags: ['Sample'],
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              user_id: { type: 'string' },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
    },
    controller.create.bind(controller)
  );

  fastify.put<{
    Params: { id: string };
    Body: { name?: string; description?: string };
  }>(
    '/:id',
    {
      schema: {
        description: 'Update a sample',
        tags: ['Sample'],
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              user_id: { type: 'string' },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
    },
    controller.update.bind(controller)
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        description: 'Delete a sample',
        tags: ['Sample'],
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        response: {
          204: { type: 'null' },
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
    },
    controller.delete.bind(controller)
  );
}
