// utils/file.util.ts
import fs from 'fs';
import path from 'path';

export const deleteLocalFile = (imageUrl: string): void => {
  if (!imageUrl) return;

  let relativePath = imageUrl;

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      const parsedUrl = new URL(imageUrl);
      relativePath = parsedUrl.pathname;
    } catch {
      return;
    }
  }

  if (!relativePath.startsWith('/uploads/')) return;

  const cleanPath = relativePath.replace(/^\//, '');
  const filePath = path.join(process.cwd(), 'public', cleanPath);

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

/**
 * HTML Content থেকে সকল ইমেজ URL (src) এক্সট্র্যাক্ট করার হেলপার
 */
export const extractImageUrlsFromHtml = (htmlContent: string): string[] => {
  if (!htmlContent) return [];
  
  // HTML-এর <img src="..."> থেকে সকল image link বের করার RegEx
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  const urls: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  return urls;
};

/**
 * ব্লগ কন্টেন্ট ডিলিট করার সময় তার ভেতরের সমস্ত ছবি ফাইলসিস্টেম থেকে ডিলিট করার ফাংশন
 */
export const deleteBlogContentImages = (htmlContent: string): void => {
  const imageUrls = extractImageUrlsFromHtml(htmlContent);
  deleteLocalFiles(imageUrls);
};

/**
 * ব্লগ আপডেট করার সময় আগের কন্টেন্ট ও নতুন কন্টেন্ট তুলনা করে যেগুলো রিমুভ হয়েছে সেগুলো ডিলিট করবে
 */
export const cleanupBlogImagesOnUpdate = (oldHtml: string, newHtml: string): void => {
  const oldImages = extractImageUrlsFromHtml(oldHtml);
  const newImages = extractImageUrlsFromHtml(newHtml);

  // পুরোনো ইমেজের মধ্যে যেগুলো নতুন কন্টেন্টে নেই, সেগুলো ডিলিট করা হবে
  const removedImages = oldImages.filter((url) => !newImages.includes(url));
  deleteLocalFiles(removedImages);
};