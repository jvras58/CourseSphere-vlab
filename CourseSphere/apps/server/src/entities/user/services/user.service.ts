import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { hash } from 'argon2';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized';
import { hasPermission } from '../../../common/permission';

export class UserService {
  private prisma: PrismaClient;
  private fastify: FastifyInstance;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.prisma = prisma;
    this.fastify = fastify;
  }

  async checkPermission(userId: string, action: string, subject: string, targetUserId?: string) {
    if (targetUserId && userId === targetUserId) return;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: { include: { permission: true } } },
    });
    if (!user) throw new UnauthorizedException('User not found');
    if (!hasPermission(user.role.permission, action, subject)) {
      throw new UnauthorizedException(`No ${action} permission for ${subject}`);
    }
  }

  async getAll(userId: string, filters: { name?: string; email?: string; }) {
    await this.checkPermission(userId, 'manage', 'all');
    const where: any = {};
    if (filters.name) where.name = filters.name;
    if (filters.email) where.email = { gte: filters.email };
    if (filters.name) where.name = { ...where.name, lte: filters.email };
    return this.prisma.user.findMany({ where });
  }

  async getById(userId: string, targetUserId: string) {
    await this.checkPermission(userId, 'manage', 'all');
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new Error('User not found');
    return user;
  }

  //TODO: Update self user
  async update(userId: string, targetUserId: string, data: {
    name?: string;
    email?: string;
    password?: string;
    bio?: string;
    image?: string;
  }) {
    await this.checkPermission(userId, 'manage', 'all');
    const updateData: any = { ...data };
    if (data.password) updateData.password = await hash(data.password);
    return this.prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
    });
  }
}