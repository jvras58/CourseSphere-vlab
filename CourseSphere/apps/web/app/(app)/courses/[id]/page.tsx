'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { getCourseById } from '@/modules/courses/utils/course-api';
import { CourseInstructorsManager } from '@/modules/courses/components/course-instructors-manager';
import { ContentLayout } from '@/components/content-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { LessonList } from '@/modules/lesson/components/lesson-list';
import { use } from 'react';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default function CourseDetailsPage({ params, searchParams }: Props) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const { id } = resolvedParams;
  const { tab } = resolvedSearchParams;
  
  const { session } = useSessionStore();
  const { data: course, isLoading } = useQuery({
    queryKey: ['courses', id],
    queryFn: () => getCourseById(id, session!.accessToken),
    enabled: !!session?.accessToken,
  });

  if (isLoading) {
    return (
      <ContentLayout title="Carregando...">
        <Skeleton className="h-36 w-full rounded-lg bg-white-50" />
      </ContentLayout>
    );
  }

  if (!course) {
    return (
      <ContentLayout title="Curso não encontrado">
        <p className="text-muted-foreground text-center mt-10">Curso não encontrado.</p>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={course.name}>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <Link
            href={`/courses/${id}`}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${!tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Detalhes
          </Link>
          <Link
            href={`/courses/${id}?tab=lessons`}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${tab === 'lessons' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Aulas
          </Link>
          <Link
            href={`/courses/${id}?tab=instructors`}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${tab === 'instructors' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Instrutores
          </Link>
        </nav>
      </div>
      
      {!tab && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{course.name}</h2>
          {course.description && <p className="text-muted-foreground">{course.description}</p>}
          <p>Início: {new Date(course.startDate).toLocaleDateString()}</p>
          <p>Término: {new Date(course.endDate).toLocaleDateString()}</p>
        </div>
      )}
      
      {tab === 'lessons' && <LessonList courseId={id} />}
      {tab === 'instructors' && <CourseInstructorsManager courseId={id} />}
    </ContentLayout>
  );
}