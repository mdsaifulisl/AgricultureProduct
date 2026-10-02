import { z } from 'zod';

export const createHeroSlideSchema = z.object({
  body: z.object({
    badge: z.string().optional(),
    title: z.string({ required_error: 'Title is required' }),
    highlightText: z.string().optional(),
    description: z.string().optional(),
    primaryBtnText: z.string().optional(),
    primaryBtnLink: z.string().optional(),
    secondaryBtnText: z.string().optional(),
    secondaryBtnLink: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tag: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const updateHeroSlideSchema = z.object({
  body: z.object({
    badge: z.string().optional(),
    title: z.string().optional(),
    highlightText: z.string().optional(),
    description: z.string().optional(),
    primaryBtnText: z.string().optional(),
    primaryBtnLink: z.string().optional(),
    secondaryBtnText: z.string().optional(),
    secondaryBtnLink: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tag: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export type CreateHeroSlideInput = z.infer<typeof createHeroSlideSchema>['body'];
export type UpdateHeroSlideInput = z.infer<typeof updateHeroSlideSchema>['body'];