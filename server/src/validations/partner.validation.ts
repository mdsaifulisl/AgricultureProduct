import { z } from 'zod';

const createPartnerZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'কোম্পানি বা ব্র্যান্ডের নাম আবশ্যক',
    }).min(1, 'কোম্পানির নাম খালি রাখা যাবে না'),
    logo: z.string().optional(),
    websiteUrl: z.string().url('সঠিক ইউআরএল দিন').optional().or(z.literal('')),
  }),
});

const updatePartnerZodSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    logo: z.string().optional(),
    websiteUrl: z.string().url('সঠিক ইউআরএল দিন').optional().or(z.literal('')),
  }),
});

export const PartnerValidation = {
  createPartnerZodSchema,
  updatePartnerZodSchema,
};

// TS Types export
export type CreatePartnerInput = z.infer<typeof createPartnerZodSchema>['body'];
export type UpdatePartnerInput = z.infer<typeof updatePartnerZodSchema>['body'];