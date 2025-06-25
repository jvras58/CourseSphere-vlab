import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized';
import { hasPermission } from '../../../common/permission';
import { SampleFilters } from '../types';



export class SampleService {
  private prisma: PrismaClient;
  private fastify: FastifyInstance;

  constructor(prisma: PrismaClient, fastify: FastifyInstance) {
    this.prisma = prisma;
    this.fastify = fastify;
  }

  private async checkPermission(
    userId: string,
    action: string,
    subject: string,
    targetSampleId?: string
  ) {
    if (targetSampleId) {
      const sample = await this.prisma.sample.findUnique({ where: { id: targetSampleId } });
      if (sample?.user_id === userId) return;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: { include: { permission: true } } },
    });
    if (!user) throw new UnauthorizedException('User not found');
    if (!hasPermission(user.role.permission, action, subject)) {
      throw new UnauthorizedException(`No ${action} permission for ${subject}`);
    }
  }

  async getAll(
    userId: string,
    filters: SampleFilters
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    await this.checkPermission(userId, 'manage', 'samples');

    const {
      name,
      description,
      createdFrom,
      createdTo,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = { user_id: userId };
    if (name) where.name = { contains: name };
    if (description) where.description = { contains: description };
    if (createdFrom) where.createdAt = { ...where.createdAt, gte: new Date(createdFrom) };
    if (createdTo) where.createdAt = { ...where.createdAt, lte: new Date(createdTo) };

    const total = await this.prisma.sample.count({ where });
    const items = await this.prisma.sample.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return { items, total, page, limit };
  }

  async create(userId: string, data: { name: string; description?: string }) {
    await this.checkPermission(userId, 'manage', 'samples');
    return this.prisma.sample.create({
      data: { ...data, user_id: userId },
    });
  }

  async getById(userId: string, sampleId: string) {
    await this.checkPermission(userId, 'manage', 'samples', sampleId);
    const sample = await this.prisma.sample.findUnique({ where: { id: sampleId } });
    if (!sample) throw new Error('Sample not found');
    return sample;
  }

  async update(
    userId: string,
    sampleId: string,
    data: { name?: string; description?: string }
  ) {
    await this.checkPermission(userId, 'manage', 'samples', sampleId);
    return this.prisma.sample.update({
      where: { id: sampleId },
      data,
    });
  }

  async delete(userId: string, sampleId: string) {
    await this.checkPermission(userId, 'manage', 'samples', sampleId);
    return this.prisma.sample.delete({ where: { id: sampleId } });
  }
}