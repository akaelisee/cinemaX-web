import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Indique un e-mail valide.'),
  password: z.string().min(1, 'Le mot de passe est requis.'),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est requis.').max(100),
  lastName: z.string().trim().min(1, 'Le nom est requis.').max(100),
  email: z.string().trim().email('Indique un e-mail valide.'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères.').max(128),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
