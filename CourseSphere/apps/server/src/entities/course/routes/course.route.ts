import { FastifyInstance } from 'fastify';
import { CourseController } from '../controller/course.controller';
import { CourseFilters, CreateCourseBody, UpdateCourseBody, AddInstructorBody } from '../types';

export default async function courseRoutes(fastify: FastifyInstance) {
  const controller = new CourseController(fastify.prisma, fastify);

  fastify.get<{ Querystring: CourseFilters }>(
    '/',
    {
      schema: {
        description: 'Get all cursos para o usuário autenticado (criador ou instrutor)',
        tags: ['Course'],
        querystring: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            createdFrom: { type: 'string', format: 'date-time' },
            createdTo: { type: 'string', format: 'date-time' },
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
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' },
                    creatorId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
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
        description: 'Get a curso por ID',
        tags: ['Course'],
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
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time' },
              creatorId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              instructors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    courseId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
              students: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    courseId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
    },
    controller.getById.bind(controller)
  );

  fastify.post<{ Body: CreateCourseBody }>(
    '/',
    {
      schema: {
        description: 'Create a new curso',
        tags: ['Course'],
        body: {
          type: 'object',
          required: ['name', 'startDate', 'endDate'],
          properties: {
            name: { type: 'string', minLength: 3 },
            description: { type: 'string', maxLength: 500 },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time' },
              creatorId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
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
    Body: UpdateCourseBody;
  }>(
    '/:id',
    {
      schema: {
        description: 'Update a curso',
        tags: ['Course'],
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3 },
            description: { type: 'string', maxLength: 500 },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time' },
              creatorId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
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
        description: 'Delete a curso',
        tags: ['Course'],
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

  fastify.post<{
    Params: { id: string };
    Body: AddInstructorBody;
  }>(
    '/:id/instructors',
    {
      schema: {
        description: 'Add um instrutor para o curso',
        tags: ['Course'],
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        body: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              courseId: { type: 'string' },
              userId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
    },
    controller.addInstructor.bind(controller)
  );

  fastify.delete<{
    Params: { id: string; instructorId: string };
  }>(
    '/:id/instructors/:instructorId',
    {
      schema: {
        description: 'Remove um instrutor do curso',
        tags: ['Course'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
        instructorId: { type: 'string' },
          },
        },
        response: {
          204: { type: 'null' },
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
    },
    controller.removeInstructor.bind(controller)
  );
}