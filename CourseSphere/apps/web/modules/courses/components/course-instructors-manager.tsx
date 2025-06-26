'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSessionStore } from '@/modules/auth/stores/session-store';
import { addInstructor, removeInstructor } from '../utils/course-api';
import { User } from '@/types';

type Props = {
  courseId: string;
};

export function CourseInstructorsManager({ courseId }: Props) {
  const { session } = useSessionStore();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState('');

  // Mock de busca de usuários (simulando https://randomuser.me)
  // TODO: Implementar busca da api também
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users', searchEmail],
    queryFn: async () => {
      const res = await fetch(`https://randomuser.me/api/?results=5&email=${searchEmail}`);
      const data = await res.json();
      return data.results.map((user: any) => ({
        id: user.login.uuid,
        email: user.email,
        name: `${user.name.first} ${user.name.last}`,
      }));
    },
    enabled: !!searchEmail,
  });

  const addMutation = useMutation({
    mutationFn: (userId: string) => addInstructor(courseId, userId, session!.accessToken),
    onSuccess: () => {
      toast.success('Instrutor adicionado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
    },
    onError: (err: any) => {
      toast.error('Erro ao adicionar instrutor', { description: err.message });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeInstructor(courseId, userId, session!.accessToken),
    onSuccess: () => {
      toast.success('Instrutor removido com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
    },
    onError: (err: any) => {
      toast.error('Erro ao remover instrutor', { description: err.message });
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Gerenciar Instrutores</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Buscar por e-mail"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center">
              <span>{user.name} ({user.email})</span>
              <Button onClick={() => addMutation.mutate(user.id)}>Adicionar</Button>
            </li>
          ))}
        </ul>
      )}
      {/* Lista de instrutores do curso (simulada, deve ser buscada da API) */}
      <ul className="space-y-2">
        {/* Exemplo de instrutores já adicionados */}
        <li className="flex justify-between items-center">
          <span>Instrutor Exemplo (exemplo@email.com)</span>
          <Button
            variant="destructive"
            onClick={() => removeMutation.mutate('mock-user-id')}
          >
            Remover
          </Button>
        </li>
      </ul>
    </div>
  );
}