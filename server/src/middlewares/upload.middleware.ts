import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { getFullImageUrl } from '../utils/getImageUrl.js';

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

const parseBase64Image = (base64Str: string) => {
  const matches = base64Str.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) return null;

  return {
    ext: matches[1] === 'jpeg' ? 'jpg' : matches[1],
    buffer: Buffer.from(matches[2], 'base64'),
  };
};

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
 * HTML Content-এর ভেতরের Base64 ইমেজ প্রসেস করার হেলপার
 */
const processHtmlContentImages = async (
  req: Request,
  htmlContent: string,
  targetDir: string,
  folderName: string
): Promise<string> => {
  if (!htmlContent) return htmlContent;

  const base64Regex = /data:image\/[a-zA-Z]+;base64,[^"'\s>]+/g;
  const matches = htmlContent.match(base64Regex);

  if (!matches || matches.length === 0) return htmlContent;

  let updatedContent = htmlContent;

  for (const base64Str of matches) {
    const parsed = parseBase64Image(base64Str);
    if (parsed) {
      const relativePath = await saveProcessedImage(parsed.buffer, targetDir, folderName);
      const fullUrl = getFullImageUrl(req, relativePath);
      updatedContent = updatedContent.replace(base64Str, fullUrl);
    }
  }

  return updatedContent;
};

/**
 * একক ইমেজ প্রসেসিং হেলপার (Multer File, Base64 String অথবা Exiting URL handling)
 */
const processSingleImageInput = async (
  input: any,
  file: Express.Multer.File | undefined,
  targetDir: string,
  folderName: string
): Promise<string | undefined> => {
  // ১. Multer File থাকলে প্রাধান্য পাবে
  if (file) {
    return await saveProcessedImage(file.buffer, targetDir, folderName);
  }

  // ২. Base64 String থাকলে তা ফাইল হিসেবে সেভ হবে
  if (typeof input === 'string' && input.startsWith('data:image')) {
    const parsed = parseBase64Image(input);
    if (parsed) {
      return await saveProcessedImage(parsed.buffer, targetDir, folderName);
    }
  }

  // ৩. আগের কোনো URL/Path থাকলে সেটি অপরিবর্তিত থাকবে
  if (typeof input === 'string' && input.trim() !== '') {
    return input;
  }

  return undefined;
};

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

    // ১. HTML Content প্রসেসিং
    if (req.body.content && typeof req.body.content === 'string') {
      req.body.content = await processHtmlContentImages(
        req,
        req.body.content,
        targetDir,
        folderName
      );
    }

    // ২. Settings ফোল্ডারের জন্য স্পেশাল হ্যান্ডলিং
    if (folderName === 'settings') {
      const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      
      const logoFile = filesObj?.['siteLogo']?.[0] || (req.file?.fieldname === 'siteLogo' ? req.file : undefined);
      const faviconFile = filesObj?.['siteFavicon']?.[0] || (req.file?.fieldname === 'siteFavicon' ? req.file : undefined);

      const processedLogo = await processSingleImageInput(
        req.body.siteLogo,
        logoFile,
        targetDir,
        folderName
      );

      const processedFavicon = await processSingleImageInput(
        req.body.siteFavicon,
        faviconFile,
        targetDir,
        folderName
      );

      if (processedLogo !== undefined) req.body.siteLogo = processedLogo;
      if (processedFavicon !== undefined) req.body.siteFavicon = processedFavicon;

      return next();
    }

    // ৩. অন্যান্য ফোল্ডারের (products, categories, partners, etc.) জন্য জেনেরিক হ্যান্ডলিং
    let existingUrls: string[] = [];
    const base64Buffers: Buffer[] = [];
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
    parseInput(req.body.logo);

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

    for (const file of multerFiles) {
      const relativePath = await saveProcessedImage(file.buffer, targetDir, folderName);
      uploadedPaths.push(relativePath);
    }

    for (const buffer of base64Buffers) {
      const relativePath = await saveProcessedImage(buffer, targetDir, folderName);
      uploadedPaths.push(relativePath);
    }

    const allImages = [...existingUrls, ...uploadedPaths];

    if (folderName === 'categories') {
      delete req.body.image;
      delete req.body.images;
      req.body.image = allImages[0] || '';
    } else if (folderName === 'partners') {
      delete req.body.logo;
      delete req.body.image;
      delete req.body.images;
      req.body.logo = allImages[0] || '';
    } else if (folderName === 'blogs') {
      if (allImages.length > 0) {
        req.body.image = allImages[0];
      }
    } else {
      delete req.body.image;
      delete req.body.images;
      req.body.images = allImages;
    }

    next();
  } catch (error) {
    next(error);
  }
};