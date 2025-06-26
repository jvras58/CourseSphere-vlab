import { z } from 'zod';

export const courseSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    description: z.string().max(500, 'Máximo de 500 caracteres').optional(),
    startDate: z.string(),
    endDate: z.string(),
  })
  .superRefine((data, ctx) => {
    // valida startDate
    if (isNaN(Date.parse(data.startDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: 'Data de início inválida',
      });
    }
    // valida endDate
    if (isNaN(Date.parse(data.endDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'Data de término inválida',
      });
    }
    // se ambas válidas, checa ordem
    if (
      !isNaN(Date.parse(data.startDate)) &&
      !isNaN(Date.parse(data.endDate))
    ) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: 'Data de término deve ser posterior à data de início',
        });
      }
    }
  })
  .transform((data) => ({
    name: data.name,
    description: data.description,
    // converte para ISO 8601 
    startDate: new Date(data.startDate).toISOString(),
    endDate: new Date(data.endDate).toISOString(),
  }));

export type CourseFormValues = z.infer<typeof courseSchema>;
