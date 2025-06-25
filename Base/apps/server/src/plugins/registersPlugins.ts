import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyJwt from '@fastify/jwt';
import prismaPlugin from './prisma';

export async function registerPlugins(app: FastifyInstance) {
  await app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Base Monorepo API',
        description: 'API documentation for base monorepo',
        version: '0.0.1',
      },
      servers: [{ url: `http://localhost:${process.env.PORT || 8000}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
  });

  app.decorate('verifyJWT', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Token inválido ou ausente' });
    }
  });

  app.decorate('auth', function (
    this: FastifyInstance,
    preHandlers: Array<(request: any, reply: any) => Promise<void>>
  ) {
    return async function (this: FastifyInstance, request, reply) {
      for (const handler of preHandlers) {
        await handler.call(this, request, reply);
      }
    };
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  await app.register(prismaPlugin);
}