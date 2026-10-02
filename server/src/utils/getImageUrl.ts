// utils/getImageUrl.ts
import { Request } from 'express';

export const getFullImageUrl = (req: Request, relativePath: string): string => {
  
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // আপনার সার্ভারের মূল URL (যেমন: http://localhost:5000)
  const protocol = req.protocol; // http বা https
  const host = req.get('host');   // localhost:5000 বা yourdomain.com

  // সাশ (/) সম্পর্কিত সমস্যা দূর করে ফুল URL তৈরি
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  return `${protocol}://${host}${cleanPath}`;
};