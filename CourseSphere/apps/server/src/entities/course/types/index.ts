export interface CourseFilters {
  name?: string;
  description?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  limit?: number;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseBody {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateCourseBody {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface AddInstructorBody {
  userId: string;
}