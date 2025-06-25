import { FastifyInstance } from 'fastify';
import { hash } from 'argon2';
import { UnauthorizedException } from '../../../common/exceptions/unauthorized';
import { mockedPrisma } from '../../../__tests__/setup';
import { UserService } from '../services/user.service';

jest.mock('argon2');

const mockFastify = {
  jwt: { sign: jest.fn() },
} as unknown as FastifyInstance;

const service = new UserService(mockedPrisma, mockFastify);

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hash as jest.Mock).mockResolvedValue('hashedPassword');
  });

  describe('getAll', () => {
    it('deve retornar usuários filtrados para administrador', async () => {
      (mockedPrisma.user.findUnique as any).mockResolvedValue({
        id: 'admin1',
        role: { permission: [{ action: 'manage', subject: 'all' }] },
      } as any);
    const users = [{ id: 'user1', name: 'John'}];
      (mockedPrisma.user.findMany as any).mockResolvedValue(users as any);
      const result = await service.getAll('admin1', { name: 'John' });
      expect(mockedPrisma.user.findMany).toHaveBeenCalledWith({
        where: { name: 'John' },
      });
      expect(result).toEqual(users);
    });

    it('deveria jogar se não for administrador', async () => {
      (mockedPrisma.user.findUnique as any).mockResolvedValue({
        id: 'user1',
        role: { permission: [] },
      } as any);
      await expect(service.getAll('user1', {})).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getById', () => {
    it('deve retornar o usuário se encontrado', async () => {
    (mockedPrisma.user.findUnique as any)
        .mockResolvedValueOnce({
        id: 'admin1',
        role: { permission: [{ action: 'manage', subject: 'all' }] },
        } as any)
        .mockResolvedValueOnce({ id: 'user1', name: 'John' } as any);
    const result = await service.getById('admin1', 'user1');
    expect(result).toEqual({ id: 'user1', name: 'John' });
    });

    it('deve lançar se o usuário não for encontrado', async () => {
      (mockedPrisma.user.findUnique as any).mockResolvedValue({
        id: 'admin1',
        role: { permission: [{ action: 'manage', subject: 'all' }] },
      } as any);
      (mockedPrisma.user.findUnique as any).mockResolvedValueOnce(null);
      await expect(service.getById('admin1', 'user1')).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('deve atualizar o usuário com senha com hash', async () => {
      (mockedPrisma.user.findUnique as any).mockResolvedValue({
        id: 'admin1',
        role: { permission: [{ action: 'manage', subject: 'all' }] },
      } as any);
      const input = { name: 'John Updated', password: 'newpassword' };
      const updated = { id: 'user1', name: 'John Updated', password: 'hashedPassword' };
      (mockedPrisma.user.update as any).mockResolvedValue(updated as any);
      const result = await service.update('admin1', 'user1', input);
      expect(hash).toHaveBeenCalledWith('newpassword');
      expect(mockedPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user1' },
        data: { name: 'John Updated', password: 'hashedPassword' },
      });
      expect(result).toEqual(updated);
    });
  });
});