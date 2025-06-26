'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LessonFormValues, lessonSchema } from '../schemas/lesson-schema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LessonFormFields } from './lesson-form-fields';
import { useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createLesson, updateLesson } from '../utils/lesson-api';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: 'create' | 'edit';
  defaultValues?: Partial<LessonFormValues> & { id?: string };
  courseId: string;
  onSuccess?: () => void;
};

export function CreateEditLessonDialog({
  open: controlledOpen,
  onOpenChange: controlledSetOpen,
  mode = 'create',
  defaultValues,
  courseId,
  onSuccess,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledSetOpen ?? setInternalOpen;
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const router = useRouter();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      status: 'DRAFT',
      publishDate: '',
      videoUrl: '',
      youtubeId: '',
      thumbnailUrl: '',
      courseId,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: defaultValues.title ?? '',
        status: defaultValues.status ?? 'DRAFT',
        publishDate: defaultValues.publishDate ?? '',
        videoUrl: defaultValues.videoUrl ?? '',
        youtubeId: defaultValues.youtubeId ?? '',
        thumbnailUrl: defaultValues.thumbnailUrl ?? '',
        courseId: defaultValues.courseId ?? courseId,
      });
    }
  }, [defaultValues, form, courseId]);

  const mutation = useMutation({
    mutationFn: async (data: LessonFormValues) => {
      if (mode === 'edit' && defaultValues?.id) {
        return updateLesson(defaultValues.id, data, session!.accessToken);
      }
      return createLesson(data, session!.accessToken);
    },
    onSuccess: () => {
      toast.success(`Aula ${mode === 'edit' ? 'atualizada' : 'criada'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] });
      setOpen(false);
      form.reset();
      onSuccess?.();
      router.refresh();
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar aula', {
        description: err.message,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === 'create' && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar aula
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar aula' : 'Criar aula'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Altere os dados da aula abaixo.'
              : 'Preencha os campos para criar uma nova aula.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="lesson-form"
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormProvider {...form}>
            <LessonFormFields form={form} disabled={mutation.isPending} courseId={courseId} />
          </FormProvider>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" form="lesson-form" disabled={mutation.isPending}>
            {mode === 'edit' ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}