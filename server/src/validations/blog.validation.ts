import { z } from 'zod';

export const createBlogCommentSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(2, 'User name must be at least 2 characters')
    .max(30, 'User name must not exceed 30 characters'),

  commentText: z
    .string()
    .trim()
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must not exceed 1000 characters'),
});

export const createBlogPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    metaDescription: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
    category: z.string().min(1, 'Category is required'),
    author: z.string().min(1, 'Author is required'), 
    authorRole: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    readTime: z.string().min(1, 'Read time is required'),
    image: z.string().optional(), // <--- এটাকে optional() করে দিন
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    status: z.enum(['published', 'draft', 'archived']).optional(),
  }),
});

export const updateBlogPostSchema = z.object({
  body: createBlogPostSchema.shape.body.partial(),
});

export const addCommentSchema = z.object({
  body: createBlogCommentSchema,
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>['body'];
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>['body'];
export type CreateBlogCommentInput = z.infer<typeof addCommentSchema>['body'];