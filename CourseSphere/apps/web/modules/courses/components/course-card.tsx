'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Course } from '@/types';
import { CreateEditCourseDialog } from './create-update-course-dialog';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { deleteCourse } from '../utils/course-api';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
  course: Course;
  onRefetch?: () => void;
};

export function CourseCard({ course, onRefetch }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { session } = useSessionStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await deleteCourse(course.id, session!.accessToken);
    },
    onSuccess: () => {
      toast.success('Curso deletado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      onRefetch?.();
    },
    onError: (err: any) => {
      toast.error('Erro ao deletar curso', {
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
          <Link href={`/courses/${course.id}`} className="space-y-1 flex-1 group">
            <h2 className="text-lg font-semibold group-hover:underline">{course.name}</h2>
            {course.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Início: {new Date(course.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Término: {new Date(course.endDate).toLocaleDateString()}
            </p>
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

      <CreateEditCourseDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        defaultValues={course}
        onSuccess={() => {
          setEditOpen(false);
          onRefetch?.();
        }}
      />

      <ConfirmDialog
        title="Excluir curso"
        description="Tem certeza que deseja excluir este curso? Essa ação não pode ser desfeita."
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}