import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .describe("E-mail * // Por favor insira seu e-mail")
    .email({ message: "Por favor, insira um e-mail válido." }),
  password: z
    .string()
    .describe("Senha * // Por favor insira sua senha")
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
