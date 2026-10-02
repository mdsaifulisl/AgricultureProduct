import { z } from "zod";

const createVideoSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "ভিডিওর শিরোনাম আবশ্যক",
    }),
    description: z.string().optional(),
    youtubeId: z.string({
      required_error: "ইউটিউব লিংক বা আইডি আবশ্যক",
    }),
    category: z.string().optional(),
    duration: z.string().optional(),
    views: z.string().optional(),
    featured: z.boolean().optional().default(false),
    status: z.enum(["active", "inactive"]).optional().default("active"),
  }),
});

const updateVideoSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    youtubeId: z.string().optional(),
    category: z.string().optional(),
    duration: z.string().optional(),
    views: z.string().optional(),
    featured: z.boolean().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});

export const VideoValidation = {
  createVideoSchema,
  updateVideoSchema,
};