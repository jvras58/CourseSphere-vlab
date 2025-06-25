export interface SampleFilters {
  name?: string;
  description?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  limit?: number;
}

export interface Sample {
  id: string
  name: string
  description?: string
}


export interface CreateSampleBody {
  name: string
  description?: string
}

export interface CreateSampleInput extends CreateSampleBody {
  userId: string
}

export interface UpdateSampleInput {
  name?: string
  description?: string
}
