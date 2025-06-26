export interface User {
  id: string;
  name: string;
  email: string;
  role_id: number;
  bio?: string;
  image?: string;
}

export interface SampleFilters {
  name?: string
  description?: string
  createdFrom?: string
  createdTo?: string
  page?: number
  limit?: number
}

export interface Sample {
  id: string
  name: string
  description?: string
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  creatorId: string;
  instructors: { userId: string; name: string }[];
  students: { userId: string; name: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishDate: string;
  videoUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  courseId: string;
  creatorId: string;
}



export interface AuthResponse {
  user: User;
  token: { accessToken: string };
}