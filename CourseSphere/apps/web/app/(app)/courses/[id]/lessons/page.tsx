'use client';

import { ContentLayout } from '@/components/content-layout';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { getCourseById } from '@/modules/courses/utils/course-api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { LessonList } from '@/modules/lesson/components/lesson-list';
import { useParams } from 'next/navigation';

export default function CourseLessonsPage() {
  const params = useParams<{ id: string }>();
    const { session } = useSessionStore();
  const { data: course, isLoading } = useQuery({
    queryKey: ['courses', params.id],
    queryFn: () => getCourseById(params.id, session!.accessToken),
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
    <ContentLayout title={`Aulas do curso: ${course.name}`}>
      <LessonList courseId={params.id} />
    </ContentLayout>
  );
}