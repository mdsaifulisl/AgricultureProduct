import { z } from 'zod';

export const specificationSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    categorySlug: z.string().min(1, 'Category slug is required'),
    price: z.number().positive('Price must be positive'),
    originalPrice: z.number().positive().optional(),
    unit: z.string().min(1, 'Unit is required'),
    rating: z.number().min(0).max(5).optional(),
    reviewsCount: z.number().int().min(0).optional(),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().min(1, 'Short description is required'),
    metaDescription: z.string().optional(),
    badge: z.string().optional(),
    inStock: z.boolean().optional(),
    stockCount: z.number().int().min(0),
    sku: z.string().optional(), // 👈 optional করা হলো
    isFeatured: z.boolean().optional(),
    specifications: z.array(specificationSchema).optional(),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];