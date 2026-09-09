import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

declare global {
  namespace Express {
    interface Request {
      uploadFolder?: string;
    }
  }
}

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WEBP formats are allowed!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

/**
 * Base64 ডাটা থেকে Buffer এবং Extension পাওয়ার হেলপার ফাংশন
 */
const parseBase64Image = (base64Str: string) => {
  const matches = base64Str.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) return null;

  return {
    ext: matches[1] === 'jpeg' ? 'jpg' : matches[1],
    buffer: Buffer.from(matches[2], 'base64'),
  };
};

/**
 * Buffer নিয়ে Sharp দিয়ে প্রসেস ও ফাইল রাইট করার হেলপার ফাংশন
 */
const saveProcessedImage = async (
  inputBuffer: Buffer,
  targetDir: string,
  folderName: string
): Promise<string> => {
  const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const filePath = path.join(targetDir, filename);

  const MAX_SIZE_BYTES = 300 * 1024; // 300 KB
  let quality = 90;

  let compressedBuffer = await sharp(inputBuffer)
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .toFormat('jpeg')
    .jpeg({ quality, progressive: true })
    .toBuffer();

  while (compressedBuffer.length > MAX_SIZE_BYTES && quality > 10) {
    quality -= 10;
    compressedBuffer = await sharp(inputBuffer)
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .toFormat('jpeg')
      .jpeg({ quality })
      .toBuffer();
  }

  await fs.promises.writeFile(filePath, compressedBuffer);
  return `/uploads/${folderName}/${filename}`;
};

/**
 * একাধিক ছবি (req.files, Base64 স্ট্রিং, অথবা লিঙ্ক) প্রসেস ও সেভ করার মিডলওয়্যার
 */
export const compressAndSaveImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const folderName = req.uploadFolder || 'products';
    const targetDir = path.join(process.cwd(), 'public', 'uploads', folderName);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let existingUrls: string[] = [];
    const base64Buffers: Buffer[] = [];

    // ১. req.body.images থেকে Base64 ডাটা এবং আগের URL আলাদা করা
    if (req.body.images) {
      const imagesArray = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];

      for (const item of imagesArray) {
        if (typeof item === 'string') {
          if (item.startsWith('data:image')) {
            const parsed = parseBase64Image(item);
            if (parsed) base64Buffers.push(parsed.buffer);
          } else {
            existingUrls.push(item);
          }
        }
      }
    }

    const uploadedPaths: string[] = [];

    // ২. FormData (req.files) এর মাধ্যমে আসা ছবি প্রসেস করা
    if (files && Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        const savedPath = await saveProcessedImage(file.buffer, targetDir, folderName);
        uploadedPaths.push(savedPath);
      }
    }

    // ৩. JSON-এ পাঠানো Base64 ছবি প্রসেস করে ফাইলে সেভ করা
    if (base64Buffers.length > 0) {
      for (const buffer of base64Buffers) {
        const savedPath = await saveProcessedImage(buffer, targetDir, folderName);
        uploadedPaths.push(savedPath);
      }
    }

    // ৪. আগের লিঙ্ক এবং নতুন সেভ হওয়া সব ফাইল লিঙ্ক একসাথে সেট করা
    req.body.images = [...existingUrls, ...uploadedPaths];

    next();
  } catch (error) {
    next(error);
  }
};