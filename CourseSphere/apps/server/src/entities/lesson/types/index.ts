export enum LessonStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface LessonFilters {
  title?: string;
  status?: LessonStatus;
  courseId?: string;
  page?: number;
  limit?: number;
}

export interface Lesson {
  id: string;
  title: string;
  status: LessonStatus;
  publishDate: string;
  videoUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  courseId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonBody {
  title: string;
  status: LessonStatus;
  publishDate: string;
  videoUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  courseId: string;
}

export interface UpdateLessonBody {
  title?: string;
  status?: LessonStatus;
  publishDate?: string;
  videoUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
}