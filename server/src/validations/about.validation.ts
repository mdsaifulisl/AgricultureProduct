import { z } from 'zod';

export const updateAboutSchema = z.object({
  body: z.object({
    imageUrl: z.string().optional(),
    badgeTitle: z.string().min(1, 'ব্যাজ টাইটেল আবশ্যক'),
    badgeSubtitle: z.string().min(1, 'ব্যাজ সাবটাইটেল আবশ্যক'),
    tagline: z.string().min(1, 'ট্যাগলাইন আবশ্যক'),
    title: z.string().min(1, 'মেন টাইটেল আবশ্যক'),
    description: z.string().min(1, 'বিবরণ আবশ্যক'),
    features: z.array(z.string()).min(1, 'কমপক্ষে একটি ফিচার পয়েন্ট যোগ করুন'),
    buttonText: z.string().min(1, 'বাটন টেক্সট আবশ্যক'),
    buttonLink: z.string().min(1, 'বাটন লিংক আবশ্যক'),
  }),
});

export type UpdateAboutInput = z.infer<typeof updateAboutSchema>['body'];