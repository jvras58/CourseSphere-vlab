import '@fastify/jwt';

//FIXME: estou sendo obrigado a colocar esse tipo aqui mas deveria estar no types global....
declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').JWT;
    verifyJWT(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    auth(preHandlers: Array<(request: FastifyRequest, reply: FastifyReply) => Promise<void>>): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
