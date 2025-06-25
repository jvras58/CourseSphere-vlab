import { z } from "zod";

export const SignUpFormSchema = z
  .object({
    name: z.string().min(2).trim(),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[a-zA-Z]/, { message: "Contém pelo menos uma letra." })
      .regex(/[0-9]/, {
        message: "Contém pelo menos um número.",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contém pelo menos um caractere especial.",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;