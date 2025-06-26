import { z } from 'zod';

export const lessonSchema = z
  .object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
      errorMap: () => ({ message: 'Status inválido' }),
    }),
    publishDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Data de publicação inválida',
      })
      .refine((val) => new Date(val) > new Date(), {
        message: 'Data de publicação deve ser futura',
      }),
    videoUrl: z.string().url('URL do vídeo inválida'),
    youtubeId: z.string().optional(),
    thumbnailUrl: z.string().url('URL da miniatura inválida').optional(),
    courseId: z.string().min(1, 'Curso é obrigatório'),
  })
  .transform((data) => ({
    ...data,
    publishDate: new Date(data.publishDate).toISOString(),
  }));

export type LessonFormValues = z.infer<typeof lessonSchema>;