import Fastify from 'fastify';
import { configServerOption } from './config/serverconfig';
import { registerRoutes } from './routes/routes';
import { registerPlugins } from './plugins/registersPlugins';


const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

const startServer = async () => {
  const serverOptions = await configServerOption();
  const app = Fastify(serverOptions);

  await registerPlugins(app);
  await registerRoutes(app);

  try {
    await app.listen({ port });
    app.log.info(`Server running at http://localhost:${port}/`);
    app.log.info(`Swagger UI available at http://localhost:${port}/docs`);
  } catch (err) {
    app.log.error('Error starting server:', err);
    process.exit(1);
  }
};

startServer();