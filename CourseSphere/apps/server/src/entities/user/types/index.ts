import '@fastify/jwt';

//FIXME: estou sendo obrigado a colocar esse tipo aqui mas deveria estar no types global....
declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').JWT;
    verifyJWT(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    auth(preHandlers: Array<(request: FastifyRequest, reply: FastifyReply) => Promise<void>>): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export interface UserFilters {
  name?: string;
  email?: string;
  page?: number;
  limit?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  deleted_at?: string;
  role_id: number;
}

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  bio?: string;
  image?: string;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  bio?: string;
  image?: string;
}

export interface ManageRoleBody {
  role_id: number;
}