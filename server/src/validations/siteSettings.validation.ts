import { z } from 'zod';

export const updateSiteSettingsSchema = z.object({
  body: z.object({
    siteLogo: z.any().optional(),
    siteFavicon: z.any().optional(),
    siteTitle: z.string().min(1, 'Site title is required'),
    siteDescription: z.string().optional().or(z.literal('')),
    metaKeywords: z.string().optional().or(z.literal('')),
    contactPhone: z.string().optional().or(z.literal('')),
    contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    facebookUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    youtubeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    tiktokUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    instagramUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
});

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>['body'];