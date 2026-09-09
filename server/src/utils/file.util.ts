// utils/file.util.ts
import fs from 'fs';
import path from 'path';

export const deleteLocalFile = (imageUrl: string): void => {
  if (!imageUrl) return;

  let relativePath = imageUrl;

  // 🟢 ১. যদি Full URL (http://localhost:5000/uploads/...) আসে, তবে ডোমেন বাদ দিয়ে শুধু /uploads/... বের করে আনা
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      const parsedUrl = new URL(imageUrl);
      relativePath = parsedUrl.pathname; // এটি দিবে /uploads/products/img-xxx.jpg
    } catch {
      return;
    }
  }

  // 🟢 ২. যদি এটি /uploads/ দিয়ে শুরু না হয় তবে স্কিপ করবে
  if (!relativePath.startsWith('/uploads/')) return;

  // 🟢 ৩. public ফোল্ডার সহ Absolute System Path তৈরি করা
  const cleanPath = relativePath.replace(/^\//, ''); // uploads/products/img-xxx.jpg
  const filePath = path.join(process.cwd(), 'public', cleanPath); // public/uploads/products/img-xxx.jpg

  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Failed to delete file at ${filePath}:`, err.message);
    }
  });
};

export const deleteLocalFiles = (imageUrls: string[]): void => {
  if (Array.isArray(imageUrls)) {
    imageUrls.forEach((url) => deleteLocalFile(url));
  }
};


