import '@fastify/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';


//TODO: era para ficar aqui... mas to sendo obrigado por enquanto colocar dentro dos modulos...
declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').JWT;
    verifyJWT(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    auth(preHandlers: Array<(request: FastifyRequest, reply: FastifyReply) => Promise<void>>): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}