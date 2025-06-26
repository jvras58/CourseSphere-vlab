'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Lesson } from '@/types';
import { CreateEditLessonDialog } from './create-update-lesson-dialog';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { deleteLesson } from '../utils/lesson-api';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
  lesson: Lesson;
  courseId: string;
  onRefetch?: () => void;
};

export function LessonCard({ lesson, courseId, onRefetch }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { session } = useSessionStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await deleteLesson(lesson.id, session!.accessToken);
    },
    onSuccess: () => {
      toast.success('Aula deletada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] });
      onRefetch?.();
    },
    onError: (err: any) => {
      toast.error('Erro ao deletar aula', {
        description: err.message,
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <>
      <Card className="p-6 shadow-sm border border-muted transition hover:shadow-md flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <Link href={`/lessons/${lesson.id}`} className="space-y-1 flex-1 group">
            <h2 className="text-lg font-semibold group-hover:underline">{lesson.title}</h2>
            <p className="text-sm text-muted-foreground">Status: {lesson.status}</p>
            <p className="text-sm text-muted-foreground">
              Publicação: {new Date(lesson.publishDate).toLocaleDateString()}
            </p>
            {lesson.thumbnailUrl && (
              <img
                src={lesson.thumbnailUrl}
                alt={lesson.title}
                className="w-24 h-16 object-cover rounded-md mt-2"
              />
            )}
          </Link>

          <div className="flex gap-2 ml-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditOpen(true)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeleteOpen(true)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Card>

      <CreateEditLessonDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        defaultValues={lesson}
        courseId={courseId}
        onSuccess={() => {
          setEditOpen(false);
          onRefetch?.();
        }}
      />

      <ConfirmDialog
        title="Excluir aula"
        description="Tem certeza que deseja excluir esta aula? Essa ação não pode ser desfeita."
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}