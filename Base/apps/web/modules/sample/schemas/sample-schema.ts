import { z } from 'zod';

export const sampleSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().max(500, 'Máximo de 500 caracteres').optional(),
});

export type SampleFormValues = z.infer<typeof sampleSchema>;