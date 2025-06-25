import { hash, verify } from 'argon2';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { AuthJwtPayload } from '../types';


export class AuthService {
  private prisma: PrismaClient;
  private fastify: FastifyInstance;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.prisma = prisma;
    this.fastify = fastify;
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await verify(user.password, password))) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async generateToken(userId: string, roleId: number) {
    const payload: AuthJwtPayload = { sub: { userId, roleId } };
    const accessToken = await this.fastify.jwt.sign(payload);
    return { accessToken };
  }

  async registerUser(name: string, email: string, password: string) {
    const hashedPassword = await hash(password);
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: { connect: { id: 2 } }, // Default role
      },
    });
  }
}