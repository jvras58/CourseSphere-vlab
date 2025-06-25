'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignInFormValues, signInSchema } from '../schemas/sign-in-schema';
import { createSession } from '@/lib/session';

export function SignInForm() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: SignInFormValues) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 401 || res.status === 403) {
        throw new Error('Falha na autenticação');
      }
      if (!res.ok) {
        throw new Error('Erro ao fazer login');
      }
      return res.json();
    },
    onSuccess: async (data) => {
      const { user, token } = data;
      await createSession({
        user,
        accessToken: token.accessToken,
      });
      toast.success('Login realizado com sucesso!', {
        description: 'Você será redirecionado para o dashboard.',
      });
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error) => {
      if (error.message === 'Falha na autenticação') {
        toast.error('Falha na autenticação', {
          description: 'Email ou senha incorretos. Tente novamente.',
        });
      } else {
        toast.error('Erro ao fazer login', {
          description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
      }
      console.error('Login error:', error);
    },
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: SignInFormValues) {
    loginMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>
    </Form>
  );
}