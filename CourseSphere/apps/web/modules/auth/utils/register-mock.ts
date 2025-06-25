import type { z } from 'zod';
import { SignUpFormSchema } from '../schemas/sign-up-schema';

type FormValues = z.infer<typeof SignUpFormSchema>;

export async function register(data: FormValues) {
  console.log('Dados recebidos no register:', data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { error: null };
}