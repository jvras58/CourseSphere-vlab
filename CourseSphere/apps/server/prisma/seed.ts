import { faker } from '@faker-js/faker';
import { PrismaClient, LessonStatus } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

export const roles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'User' },
  { id: 3, name: 'Student' },
  { id: 4, name: 'Instructor' },
];

export const permissions = [
  // Admin
  { id: 1, role_id: 1, action: 'manage', subject: 'all' },
  { id: 2, role_id: 1, action: 'manage', subject: 'roles' },
  // User
  { id: 3, role_id: 2, action: 'read', subject: 'User' },
  { id: 4, role_id: 2, action: 'update', subject: 'User' },
  // Student
  { id: 5, role_id: 3, action: 'read', subject: 'Course' },
  { id: 6, role_id: 3, action: 'read', subject: 'Lesson' },
  { id: 7, role_id: 3, action: 'read', subject: 'User' },
  { id: 8, role_id: 3, action: 'update', subject: 'User' },
  // Instructor
  { id: 9, role_id: 4, action: 'manage', subject: 'Course' },
  { id: 10, role_id: 4, action: 'manage', subject: 'Lesson' },
  { id: 11, role_id: 4, action: 'read', subject: 'User' },
  { id: 12, role_id: 4, action: 'update', subject: 'User' },
];

async function seedRoles() {
  for (const role of roles) {
    const { id, ...data } = role;
    await prisma.role.upsert({ where: { id }, create: data, update: data });
  }
}

async function seedPermissions() {
  for (const perm of permissions) {
    const { id, ...data } = perm;
    await prisma.permission.upsert({ where: { id }, create: data, update: data });
  }
}

async function seedUsers() {
  const admin = {
    name: 'Admin',
    email: 'admin@example.com',
    bio: 'Administrator',
    image: faker.image.avatar(),
    password: await hash('admin123'),
    role_id: 1,
  };
  
  const instructor = {
    name: 'Instructor',
    email: 'instructor@example.com',
    bio: 'Course Instructor',
    image: faker.image.avatar(),
    password: await hash('instructor123'),
    role_id: 4,
  };

  const students = await Promise.all(
    Array.from({ length: 3 }).map(async () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      bio: 'Estudante',
      image: faker.image.avatar(),
      password: await hash('aluno123'),
      role_id: 3,
    }))
  );

  const createdAdmin = await prisma.user.upsert({
    where: { email: admin.email },
    create: admin,
    update: admin,
  });

  const createdInstructor = await prisma.user.upsert({
    where: { email: instructor.email },
    create: instructor,
    update: instructor,
  });

  const createdStudents = await Promise.all(
    students.map((student) =>
      prisma.user.upsert({
        where: { email: student.email },
        create: student,
        update: student,
      })
    )
  );

  return {
    admin: createdAdmin,
    instructor: createdInstructor,
    students: createdStudents,
  };
}

async function seedCourses(adminId: string, instructorId: string) {
  const data = [
    {
      name: 'Prisma Básico',
      description: '...',
      startDate: new Date(),
      endDate: faker.date.future(),
      creatorId: adminId,
    },
    {
      name: 'Node.js Avançado',
      description: '...',
      startDate: new Date(),
      endDate: faker.date.future(),
      creatorId: instructorId,
    },
  ];
  const courses = await Promise.all(
    data.map((c) =>
      prisma.course.upsert({ where: { name: c.name }, create: c, update: {} })
    )
  );
  return courses;
}

async function seedLessons(adminId: string, instructorId: string, courseId: string) {
  const lessons = [
    {
      title: 'Introdução',
      status: LessonStatus.PUBLISHED,
      publishDate: faker.date.future(),
      videoUrl: 'https://youtu.be/abc123',
      courseId,
      creatorId: instructorId,
    },
  ];
  for (const l of lessons) {
    const youtubeId = l.videoUrl.match(/(?:youtu\.be\/|v=)([^&]+)/)?.[1] || null;
    await prisma.lesson.upsert({
      where: { title_courseId: { title: l.title, courseId: l.courseId } },
      create: {
        ...l,
        youtubeId,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      },
      update: {
        status: l.status,
        videoUrl: l.videoUrl,
        youtubeId,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      },
    });
  }
}

async function seedEnrollments(students: any[], course: any) {
  const enrolls = students.map((s) => ({ studentId: s.id, courseId: course.id }));
  await prisma.courseStudent.createMany({ data: enrolls });
}

async function seedInstructors(adminId: string, instructorId: string, courses: { id: string }[]) {
  for (const course of courses) {
    await prisma.courseInstructor.upsert({
      where: {
        courseId_userId: {
          courseId: course.id,
          userId: instructorId,
        },
      },
      create: {
        courseId: course.id,
        userId: instructorId,
      },
      update: {},
    });
    await prisma.courseInstructor.upsert({
      where: {
        courseId_userId: {
          courseId: course.id,
          userId: adminId,
        },
      },
      create: {
        courseId: course.id,
        userId: adminId,
      },
      update: {},
    });
  }
}

async function main() {
  try {
    await seedRoles();
    await seedPermissions();
    const { admin, instructor, students } = await seedUsers();
    const courses = await seedCourses(admin.id, instructor.id);
    await seedEnrollments(students, courses[0]);
    await seedInstructors(admin.id, instructor.id, courses);
    await seedLessons(admin.id, instructor.id, courses[0].id);
    console.log('Seed completo!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();