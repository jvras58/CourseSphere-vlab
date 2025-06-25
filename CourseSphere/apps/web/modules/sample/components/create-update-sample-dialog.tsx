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
import { SampleFormValues, sampleSchema } from '../schemas/sample-schema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SampleFormFields } from './sample-form-fields';
import { useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createSample, updateSample } from '../utils/sample-api';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: 'create' | 'edit';
  defaultValues?: Partial<SampleFormValues> & { id?: string };
  onSuccess?: () => void;
};

export function CreateEditSampleDialog({
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

  const form = useForm<SampleFormValues>({
    resolver: zodResolver(sampleSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name ?? '',
        description: defaultValues.description ?? '',
      });
    }
  }, [defaultValues, form]);

  const mutation = useMutation({
    mutationFn: async (data: SampleFormValues) => {
      if (mode === 'edit' && defaultValues?.id) {
        return updateSample(defaultValues.id, data, session!.accessToken);
      }
      return createSample(data, session!.accessToken);
    },
    onSuccess: () => {
      toast.success(`Amostra ${mode === 'edit' ? 'atualizada' : 'criada'} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      setOpen(false);
      form.reset();
      onSuccess?.();
      router.push('#');
      router.refresh();
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar amostra', {
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
            Criar amostra
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar amostra' : 'Criar amostra'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Altere os dados da amostra abaixo.'
              : 'Preencha os campos para criar uma nova amostra.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="sample-form"
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormProvider {...form}>
            <SampleFormFields form={form} disabled={mutation.isPending} />
          </FormProvider>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="sample-form"
            disabled={mutation.isPending}
          >
            {mode === 'edit' ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
