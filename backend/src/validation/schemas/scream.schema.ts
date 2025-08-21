import { z } from 'zod';

export const screamInputSchema = z.object({
  userEmail: z.string().email('Invalid email address'),
  explicitMode: z.boolean().default(false),
});