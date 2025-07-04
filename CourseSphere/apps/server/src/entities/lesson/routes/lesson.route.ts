import { FastifyInstance } from 'fastify';
import { LessonController } from '../controller/lesson.controller';
import { LessonFilters, CreateLessonBody, UpdateLessonBody, LessonStatus } from '../types';

export default async function lessonRoutes(fastify: FastifyInstance) {
  const controller = new LessonController(fastify.prisma, fastify);

  fastify.get<{ Querystring: LessonFilters }>(
    '/',
    {
      schema: {
        description: 'Get all aulas para cursos onde o usuário é instrutor ou criador, com filtros e paginação',
        tags: ['Lesson'],
        querystring: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1, description: 'Correspondência parcial para o título da lição (case-insensitive)' },
            status: { type: 'string', enum: Object.values(LessonStatus), description: 'Filtro por status da lição' },
            courseId: { type: 'string', description: 'Filtro por ID do curso' },
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
                    title: { type: 'string' },
                    status: { type: 'string', enum: Object.values(LessonStatus) },
                    publishDate: { type: 'string', format: 'date-time' },
                    videoUrl: { type: 'string' },
                    youtubeId: { type: 'string', nullable: true },
                    thumbnailUrl: { type: 'string', nullable: true },
                    courseId: { type: 'string' },
                    creatorId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    course: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                      },
                    },
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
        description: 'Get aula por ID',
        tags: ['Lesson'],
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'string', enum: Object.values(LessonStatus) },
              publishDate: { type: 'string', format: 'date-time' },
              videoUrl: { type: 'string' },
              youtubeId: { type: 'string', nullable: true },
              thumbnailUrl: { type: 'string', nullable: true },
              courseId: { type: 'string' },
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
    controller.getById.bind(controller)
  );

  fastify.post<{ Body: CreateLessonBody }>(
    '/',
    {
      schema: {
        description: 'Create a new lição para um curso',
        tags: ['Lesson'],
        body: {
          type: 'object',
          required: ['title', 'status', 'publishDate', 'videoUrl', 'courseId'],
          properties: {
            title: { type: 'string', minLength: 3 },
            status: { type: 'string', enum: Object.values(LessonStatus) },
            publishDate: { type: 'string', format: 'date-time' },
            videoUrl: { type: 'string', format: 'uri' },
            youtubeId: { type: 'string', nullable: true },
            thumbnailUrl: { type: 'string', format: 'uri', nullable: true },
            courseId: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'string', enum: Object.values(LessonStatus) },
              publishDate: { type: 'string', format: 'date-time' },
              videoUrl: { type: 'string' },
              youtubeId: { type: 'string', nullable: true },
              thumbnailUrl: { type: 'string', nullable: true },
              courseId: { type: 'string' },
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
    Body: UpdateLessonBody;
  }>(
    '/:id',
    {
      schema: {
        description: 'Update uma lição',
        tags: ['Lesson'],
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3 },
            status: { type: 'string', enum: Object.values(LessonStatus) },
            publishDate: { type: 'string', format: 'date-time' },
            videoUrl: { type: 'string', format: 'uri' },
            youtubeId: { type: 'string', nullable: true },
            thumbnailUrl: { type: 'string', format: 'uri', nullable: true },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              status: { type: 'string', enum: Object.values(LessonStatus) },
              publishDate: { type: 'string', format: 'date-time' },
              videoUrl: { type: 'string' },
              youtubeId: { type: 'string', nullable: true },
              thumbnailUrl: { type: 'string', nullable: true },
              courseId: { type: 'string' },
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
        description: 'Delete uma lição',
        tags: ['Lesson'],
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