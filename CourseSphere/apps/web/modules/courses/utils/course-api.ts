import { CourseFormValues } from '../schemas/course-schema';
import { Course } from '@/types';

export interface CourseFilters {
  name?: string;
  description?: string;
  createdFrom?: string; // ISO date-time
  createdTo?: string;   // ISO date-time
  page?: number;
  limit?: number;
}

function buildQuery(filters: CourseFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return params.toString() ? `?${params.toString()}` : '';
}

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/course`;

export async function createCourse(data: CourseFormValues, token: string): Promise<Course> {
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
    throw new Error(error.message || 'Erro ao criar curso');
  }

  return res.json();
}

export async function getCourses(token: string, filters: CourseFilters = {}): Promise<Course[]> {
  const query = buildQuery(filters);
  const res = await fetch(`${BASE}${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao buscar cursos');
  }
  const data = await res.json() as {
    items: Course[];
    total: number;
    page: number;
    limit: number;
  };
  return data.items;
}

export async function getCourseById(id: string, token: string): Promise<Course & { instructors: any[]; students: any[] }> {
  const res = await fetch(`${BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao buscar curso');
  }
  return res.json();
}

export async function updateCourse(id: string, data: CourseFormValues, token: string): Promise<Course> {
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
    throw new Error(error.message || 'Erro ao atualizar curso');
  }
  return res.json();
}

export async function deleteCourse(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao deletar curso');
  }
}

export async function addInstructor(courseId: string, userId: string, token: string): Promise<{ courseId: string; userId: string; createdAt: string }> {
  const res = await fetch(`${BASE}/${courseId}/instructors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao adicionar instrutor');
  }
  return res.json();
}

export async function removeInstructor(courseId: string, userId: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}/${courseId}/instructors/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao remover instrutor');
  }
}
