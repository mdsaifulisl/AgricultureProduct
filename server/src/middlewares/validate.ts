import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import path from 'path';
import fs from 'fs';
import { deleteLocalFile } from '../utils/file.util.js';
import { AppError } from '../utils/AppError.js';

// Request-এ কাস্টম প্রপার্টি টাইপ অ্যাড করা
declare global {
  namespace Express {
    interface Request {
      uploadFolder?: string;
    }
  }
}

const extractImageSrcs = (htmlContent: string): string[] => {
  if (!htmlContent) return [];
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["']/g;
  const matches: string[] = [];
  let match;
  while ((match = imgTagRegex.exec(htmlContent)) !== null) {
    if (!match[1].startsWith('data:image')) {
      matches.push(match[1]);
    }
  }
  return matches;
};

const cleanupFile = (imageUrlOrPath: string, folderName = 'blogs') => {
  if (!imageUrlOrPath) return;

  try {
    const cleanUrl = imageUrlOrPath.split('?')[0];
    const filename = path.basename(cleanUrl);

    if (!filename) return;

    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', folderName, filename),
      path.join(process.cwd(), 'uploads', folderName, filename),
      path.join(process.cwd(), imageUrlOrPath),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        deleteLocalFile(filePath);
        break;
      }
    }
  } catch (error) {
    console.error('Failed to cleanup file:', error);
  }
};

export const validate =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      const folder = req.uploadFolder || 'blogs';

      // ১. কভার ইমেজ ক্লিনআপ
      if (req.file?.path) {
        cleanupFile(req.file.path, folder);
      }
      if (req.body?.image) {
        cleanupFile(req.body.image, folder);
      }

      // ২. Rich Text Content এর ভেতরের সব আপলোড করা ছবি ক্লিনআপ
      if (req.body?.content) {
        const imageUrls = extractImageSrcs(req.body.content);
        imageUrls.forEach((url) => cleanupFile(url, folder));
      }

      // ৩. AppError এর মাধ্যমে Global Error Handler এ পাস করা
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.filter((p) => p !== 'body' && p !== 'query' && p !== 'params').join('.'),
          message: err.message,
        }));

        return next(new AppError('Validation failed', 400, formattedErrors));
      }

      return next(error);
    }
  };