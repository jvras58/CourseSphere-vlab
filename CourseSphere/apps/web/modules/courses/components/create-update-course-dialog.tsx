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
import { CourseFormValues, courseSchema } from '../schemas/course-schema';
import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseFormFields } from './course-form-fields';
import { useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createCourse, updateCourse } from '../utils/course-api';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: 'create' | 'edit';
  defaultValues?: Partial<CourseFormValues> & { id?: string };
  onSuccess?: () => void;
};

export function CreateEditCourseDialog({
  open: controlledOpen,
  onOpenChange: controlledSetOpen,
  mode = 'create',
  defaultValues,
  onSuccess,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledSetOpen ?? setInternalOpen;
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const router = useRouter();

  const resolver = zodResolver(courseSchema) as Resolver<CourseFormValues>;

  const form = useForm<CourseFormValues>({
    resolver,
    defaultValues: {
      name: '',
      description: undefined,
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name ?? '',
        description: defaultValues.description,
        startDate: defaultValues.startDate
          ? new Date(defaultValues.startDate).toISOString().split('T')[0]
          : '',
        endDate: defaultValues.endDate
          ? new Date(defaultValues.endDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [defaultValues, form]);

  const mutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      if (mode === 'edit' && defaultValues?.id) {
        return updateCourse(defaultValues.id, data, session!.accessToken);
      }
      return createCourse(data, session!.accessToken);
    },
    onSuccess: () => {
      toast.success(`Curso ${mode === 'edit' ? 'atualizado' : 'criado'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setOpen(false);
      form.reset();
      onSuccess?.();
      router.refresh();
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar curso', {
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
            Criar curso
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar curso' : 'Criar curso'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Altere os dados do curso abaixo.'
              : 'Preencha os campos para criar um novo curso.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="course-form"
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormProvider {...form}>
            <CourseFormFields form={form} disabled={mutation.isPending} />
          </FormProvider>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" form="course-form" disabled={mutation.isPending}>
            {mode === 'edit' ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
