'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Course } from '@/types';
import { getCourses } from '../utils/course-api';
import { CourseCard } from './course-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CourseList() {
  const { session } = useSessionStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: courses = [], isLoading, refetch } = useQuery<Course[]>({
    queryKey: ['courses', search, page],
    queryFn: () => getCourses(session!.accessToken, { name: search, page, limit }),
    enabled: !!session?.accessToken,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar cursos..."
          value={search}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg bg-white-50" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <p className="text-muted-foreground text-center mt-10">Nenhum curso encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onRefetch={refetch} />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
        >
          Anterior
        </Button>
        <Button onClick={() => setPage((p) => p + 1)} disabled={isLoading || courses.length < limit}>
          Próximo
        </Button>
      </div>
    </div>
  );
}