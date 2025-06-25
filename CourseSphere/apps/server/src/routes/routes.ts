import { FastifyInstance } from 'fastify';
import authRoutes from '../entities/auth/routes/auth.routes';
import userRoutes from '../entities/user/routes/user.routes';
import sampleRoutes from '../entities/sample/routes/sample.route';
import courseRoutes from '../entities/course/routes/course.route';

export async function registerRoutes(app: FastifyInstance) {
  // Registering routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(userRoutes, { prefix: '/api/user' });
  await app.register(sampleRoutes, { prefix: '/api/sample' });
  await app.register(courseRoutes, { prefix: '/api/course' });

  // health check route
  app.get('/', {
    schema: {
      description: 'Root Health Check',
      tags: ['General'],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (_request, reply) => {
      reply.send({ message: 'API ONLINE!' });
    },
  });
}