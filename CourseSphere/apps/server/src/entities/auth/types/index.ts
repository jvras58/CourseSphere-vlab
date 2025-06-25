import '@fastify/jwt';

//FIXME: estou sendo obrigado a colocar esse tipo aqui mas deveria estar no types global....
declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').JWT;
    verifyJWT(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    auth(preHandlers: Array<(request: FastifyRequest, reply: FastifyReply) => Promise<void>>): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthJwtPayload {
  sub: {
    userId: string;
    roleId: number;
  };
}

export interface UserResponse {
  id: string;
  name: string;
  avatar?: string;
  accessToken: string;
  roleId: number;
  email: string;
}

export interface JwtUser {
  id: string;
  roleId: number;
}