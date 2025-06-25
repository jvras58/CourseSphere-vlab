import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

export const roles = [
  {
    id: 1,
    name: 'Administrador',
  },
  {
    id: 2,
    name: 'Usuario Padrão',
  },
];

export const permissions = [
  {
    id: 1,
    role_id: 1,
    action: 'manage',
    subject: 'all',
  },
  {
    id: 2,
    role_id: 2,
    action: 'manage',
    subject: 'Sample',
  },
  {
    id: 3,
    role_id: 2,
    action: 'read',
    subject: 'User',
  },
  {
    id: 4,
    role_id: 2,
    action: 'update',
    subject: 'User',
  },
];

async function seedRoles() {
  for await (const role of roles) {
    const roleAttrs = structuredClone(role) as { id?: number; name: string };
    delete roleAttrs.id;
    await prisma.role.upsert({
      where: { id: role.id },
      create: roleAttrs,
      update: roleAttrs,
    });
  }
}

async function seedPermissions() {
  for await (const permission of permissions) {
    const permissionAttrs = structuredClone(permission) as {
      id?: number;
      role_id: number;
      action: string;
      subject: string;
    };
    delete permissionAttrs.id;
    await prisma.permission.upsert({
      where: { id: permission.id },
      create: permissionAttrs,
      update: permissionAttrs,
    });
  }
}

async function seedUsers() {
  const adminDev = {
    name: 'jvras',
    email: 'jvras@cin.ufpe.br',
    bio: 'Desenvolvedor Administrador.',
    image: faker.image.avatar(),
    password: await hash('123456'),
    role_id: 1,
  };

  const clientUser = {
    name: 'Jonh Doe',
    email: 'jonh@doe.com',
    bio: 'Usuario padrão.',
    image: faker.image.avatar(),
    password: await hash('123456'),
    role_id: 2,
  };

  await prisma.user.createMany({
    data: [adminDev, clientUser],
  });
}


async function main() {
  try {
    await seedRoles();
    await seedPermissions();
    await seedUsers();
    console.log('✅ Seed finalizado com sucesso!');
  } catch (e) {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();