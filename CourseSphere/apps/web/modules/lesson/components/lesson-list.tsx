'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Lesson } from '@/types';
import { getLessons } from '../utils/lesson-api';
import { LessonCard } from './lesson-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateEditLessonDialog } from './create-update-lesson-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  courseId: string;
};

export function LessonList({ courseId }: Props) {
  const { session } = useSessionStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: lessons = [], isLoading, refetch } = useQuery<Lesson[]>({
    queryKey: ['lessons', courseId, search, status, page],
    queryFn: () => getLessons(session!.accessToken, { title: search, status, courseId, page, limit }),
    enabled: !!session?.accessToken,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Resetar página ao buscar
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED');
    setPage(1); // Resetar página ao filtrar
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 w-full sm:w-auto">
          <Input
            placeholder="Buscar aulas por título..."
            value={search}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Select onValueChange={handleStatusChange} defaultValue="DRAFT">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Rascunho</SelectItem>
              <SelectItem value="PUBLISHED">Publicado</SelectItem>
              <SelectItem value="ARCHIVED">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CreateEditLessonDialog mode="create" courseId={courseId} onSuccess={refetch} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg bg-white-50" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-muted-foreground text-center mt-10">Nenhuma aula encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} courseId={courseId} onRefetch={refetch} />
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
        <Button onClick={() => setPage((p) => p + 1)} disabled={isLoading || lessons.length < limit}>
          Próximo
        </Button>
      </div>
    </div>
  );
}