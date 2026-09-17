import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, 'Name cannot be empty'),
    image: z.string({ required_error: 'Image is required' }).min(1, 'Image cannot be empty'),
    description: z.string({ required_error: 'Description is required' }).min(1, 'Description cannot be empty'),
    badge: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    image: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    badge: z.string().optional().nullable(),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>['body'];