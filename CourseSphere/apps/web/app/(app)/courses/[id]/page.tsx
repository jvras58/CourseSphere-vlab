'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { getCourseById } from '@/modules/courses/utils/course-api';
import { CourseInstructorsManager } from '@/modules/courses/components/course-instructors-manager';
import { ContentLayout } from '@/components/content-layout';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  params: { id: string };
};

export default function CourseDetailsPage({ params }: Props) {
  const { id } = useParams<{ id: string }>();
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
    <ContentLayout title={`${course.name}`}>
    {/* TODO: melhorar layout */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{course.name}</h2>
          {course.description && <p className="text-muted-foreground">{course.description}</p>}
          <p>Início: {new Date(course.startDate).toLocaleDateString()}</p>
          <p>Término: {new Date(course.endDate).toLocaleDateString()}</p>
        </div>
        <CourseInstructorsManager courseId={id} />
      </div>
    </ContentLayout>
  );
}