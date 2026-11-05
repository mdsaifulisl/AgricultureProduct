import { z } from 'zod';

export const toggleBlockIpSchema = z.object({
  body: z.object({
    ip: z.string().min(1, 'IP address is required'),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    isBlocked: z.boolean({ required_error: 'isBlocked status is required' }),
  }),
});