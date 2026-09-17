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
 * Base64 ডাটা থেকে Buffer এবং Extension পাওয়ার হেলপার ফাংশন
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
 * Buffer নিয়ে Sharp দিয়ে প্রসেস ও ফাইল রাইট করার হেলপার ফাংশন
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
 * একাধিক ছবি (req.files/req.file, Base64 স্ট্রিং, অথবা লিঙ্ক) প্রসেস ও সেভ করার সার্বজনীন মিডলওয়্যার
 */
export const compressAndSaveImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const folderName = req.uploadFolder || 'products';
    const targetDir = path.join(process.cwd(), 'public', 'uploads', folderName);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let existingUrls: string[] = [];
    const base64Buffers: Buffer[] = [];

    // ১. req.body.images এবং req.body.image থেকে Base64 এবং আগের URL হ্যান্ডেল করা
    const rawInputs: any[] = [];

    const parseInput = (input: any) => {
      if (!input) return;
      if (typeof input === 'string') {
        if (input.startsWith('[') && input.endsWith(']')) {
          try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed)) rawInputs.push(...parsed);
          } catch {
            rawInputs.push(input);
          }
        } else {
          rawInputs.push(input);
        }
      } else if (Array.isArray(input)) {
        input.forEach(parseInput);
      }
    };

    parseInput(req.body.images);
    parseInput(req.body.image);

    for (const item of rawInputs) {
      if (typeof item === 'string') {
        if (item.startsWith('data:image')) {
          const parsed = parseBase64Image(item);
          if (parsed) base64Buffers.push(parsed.buffer);
        } else if (item.trim() !== '') {
          existingUrls.push(item);
        }
      }
    }

    // ২. Multer এর ফাইল প্রসেসিং
    const multerFiles: Express.Multer.File[] = [];

    if (req.file) {
      multerFiles.push(req.file);
    }

    if (req.files) {
      if (Array.isArray(req.files)) {
        multerFiles.push(...req.files);
      } else {
        Object.values(req.files).forEach((fileArray) => {
          multerFiles.push(...fileArray);
        });
      }
    }

    const uploadedPaths: string[] = [];

    // ৩. Multer Files থেকে ফাইল সেভ করা
    for (const file of multerFiles) {
      const savedPath = await saveProcessedImage(file.buffer, targetDir, folderName);
      uploadedPaths.push(savedPath);
    }

    // ৪. Base64 থেকে ছবি সেভ করা
    for (const buffer of base64Buffers) {
      const savedPath = await saveProcessedImage(buffer, targetDir, folderName);
      uploadedPaths.push(savedPath);
    }

    const allImages = [...existingUrls, ...uploadedPaths];

    // ৫. প্রসেস করা ডাটা req.body তে সেট করা
    // আগের অতিরিক্ত 'image' এবং 'images' ফিল্ড ক্লিনআপ
    delete req.body.image;
    delete req.body.images;

    if (folderName === 'categories') {
      // ক্যাটাগরির জন্য সিঙ্গেল ইমেজ স্ট্রিং
      req.body.image = allImages[0] || '';
    } else {
      // প্রোডাক্টের জন্য ইমেজ অ্যারে
      req.body.images = allImages;
    }

    next();
  } catch (error) {
    next(error);
  }
};