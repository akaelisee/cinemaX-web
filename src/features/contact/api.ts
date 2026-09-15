import { z } from 'zod';
import { api, unwrap } from '@/shared/api/client';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.').max(100),
  subject: z.string().trim().min(1, 'Le sujet est requis.').max(200),
  message: z.string().trim().min(1, 'Le message est requis.').max(5000),
});

export type ContactValues = z.infer<typeof contactSchema>;

export function sendContact(values: ContactValues): Promise<{ id: string }> {
  return unwrap(api.post('/contacts', values));
}
