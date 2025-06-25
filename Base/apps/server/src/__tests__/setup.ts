import { PrismaClient } from '@prisma/client';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from './mocks/prisma.mock';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const mockedPrisma = prismaMock as unknown as PrismaClient;