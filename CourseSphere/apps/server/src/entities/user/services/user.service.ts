import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { hash } from 'argon2';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized';
import { hasPermission } from '../../../common/permission';
import { CreateUserBody, UpdateUserBody, UserFilters, ManageRoleBody } from '../types';

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
      where: { id: userId, deleted_at: null },
      include: { role: { include: { permission: true } } },
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    if (!hasPermission(user.role.permission, action, subject)) {
      throw new UnauthorizedException(`Sem permissão para ${action} ${subject}`);
    }
  }

  async getAll(
    userId: string,
    filters: UserFilters
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    await this.checkPermission(userId, 'manage', 'all');
    const { name, email, page = 1, limit = 10 } = filters;

    const where: any = { deleted_at: null };
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };

    const total = await this.prisma.user.count({ where });
    const items = await this.prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        role_id: true,
      },
    });

    return { items, total, page, limit };
  }

  async getById(userId: string, targetUserId: string) {
    await this.checkPermission(userId, 'manage', 'all', targetUserId);
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId, deleted_at: null },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        role_id: true,
      },
    });
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async create(data: CreateUserBody) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new Error('Email já em uso');

    const defaultRole = await this.prisma.role.findFirst({
      where: { name: 'user' },
    });
    if (!defaultRole) throw new Error('Role padrão não encontrado');

    const hashedPassword = await hash(data.password);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role_id: defaultRole.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        role_id: true,
      },
    });
  }

  async update(userId: string, targetUserId: string, data: UpdateUserBody) {
    await this.checkPermission(userId, 'manage', 'all', targetUserId);

    if (data.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== targetUserId) {
        throw new Error('Email já em uso');
      }
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await hash(data.password);
    }

    return this.prisma.user.update({
      where: { id: targetUserId, deleted_at: null },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        role_id: true,
      },
    });
  }

  async delete(userId: string, targetUserId: string) {
    await this.checkPermission(userId, 'manage', 'all', targetUserId);
    await this.prisma.user.update({
      where: { id: targetUserId, deleted_at: null },
      data: { deleted_at: new Date(), isActive: false },
    });
  }

  async manageRole(userId: string, targetUserId: string, data: ManageRoleBody) {
    await this.checkPermission(userId, 'manage', 'roles');
    const role = await this.prisma.role.findUnique({
      where: { id: data.role_id },
    });
    if (!role) throw new Error('Role não encontrada');

    return this.prisma.user.update({
      where: { id: targetUserId, deleted_at: null },
      data: { role_id: data.role_id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        role_id: true,
      },
    });
  }
}