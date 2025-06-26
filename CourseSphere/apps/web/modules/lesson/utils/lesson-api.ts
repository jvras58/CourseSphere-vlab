import { LessonFormValues } from '../schemas/lesson-schema';
import { Lesson } from '@/types';

export interface LessonFilters {
  title?: string;
  status?: Lesson['status'];
  courseId?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: LessonFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  return params.toString() ? `?${params.toString()}` : '';
}

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/lesson`;

export async function createLesson(data: LessonFormValues, token: string): Promise<Lesson> {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao criar aula');
  }

  return res.json();
}

export async function getLessons(token: string, filters: LessonFilters = {}): Promise<Lesson[]> {
  const query = buildQuery(filters);
  const res = await fetch(`${BASE}${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao buscar aulas');
  }
  const data = (await res.json()) as {
    items: Lesson[];
    total: number;
    page: number;
    limit: number;
  };
  return data.items;
}

export async function getLessonById(id: string, token: string): Promise<Lesson> {
  const res = await fetch(`${BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao buscar aula');
  }
  return res.json();
}

export async function updateLesson(id: string, data: LessonFormValues, token: string): Promise<Lesson> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao atualizar aula');
  }
  return res.json();
}

export async function deleteLesson(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao deletar aula');
  }
}
