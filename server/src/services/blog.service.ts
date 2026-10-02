import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type {
  CreateBlogPostInput,
  UpdateBlogPostInput,
  CreateBlogCommentInput,
} from '../validations/blog.validation.js';
import {
  deleteLocalFile,
  cleanupBlogImagesOnUpdate,
  deleteBlogContentImages,
} from '../utils/file.util.js';

export interface IBlogQuery {
  category?: string;
  search?: string;
  status?: 'published' | 'draft' | 'archived';
}

// Helper: Full URL থেকে Relative Path বের করার জন্য
const cleanImagePath = (img?: string): string | undefined => {
  if (!img) return undefined;
  if (img.startsWith('http://') || img.startsWith('https://')) {
    try {
      return new URL(img).pathname;
    } catch {
      return img;
    }
  }
  return img;
};

export const createBlogService = async (data: CreateBlogPostInput) => {
  // images property টি আলাদা ডিস্ট্রাকচার করে ফেলে দেয়া হচ্ছে যাতে Prisma তে এরর না দেয়
  const { image, images, ...blogData } = data as any;

  // যদি image প্রপার্টি তে ভ্যালু না থাকে তবে images[0] থেকে নেওয়া হবে
  const rawImage = image || (Array.isArray(images) && images.length > 0 ? images[0] : '');
  const finalImage = cleanImagePath(rawImage) || '';

  return await prisma.blogPost.create({
    data: {
      ...blogData,
      image: finalImage,
    },
    include: {
      comments: true,
    },
  });
};

export const getAllBlogsService = async (query: IBlogQuery) => {
  const { category, search, status } = query;
  const where: Prisma.BlogPostWhereInput = {};

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }

  return await prisma.blogPost.findMany({
    where,
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getBlogByIdService = async (id: string) => {
  return await prisma.blogPost.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

export const updateBlogService = async (
  id: string,
  data: UpdateBlogPostInput
) => {
  // ১. আগের ডাটাবেজের কভার ফটো এবং কন্টেন্ট নিয়ে আসা
  const existingBlog = await prisma.blogPost.findUnique({
    where: { id },
    select: { image: true, content: true },
  });

  if (!existingBlog) {
    throw new Error('Blog post not found');
  }

  const { image, images, ...blogData } = data as any;
  
  const rawImage = image || (Array.isArray(images) && images.length > 0 ? images[0] : undefined);
  const cleanedImage = cleanImagePath(rawImage);

  const updatedBlog = await prisma.blogPost.update({
    where: { id },
    data: {
      ...blogData,
      ...(cleanedImage !== undefined && { image: cleanedImage }),
    },
    include: {
      comments: true,
    },
  });

  // ২. যদি কভার ইমেজ পরিবর্তন হয়, আগের ফাইল সার্ভার থেকে ডিলিট
  if (cleanedImage !== undefined && existingBlog.image && existingBlog.image !== cleanedImage) {
    deleteLocalFile(existingBlog.image);
  }

  // ৩. যদি ব্লগ কন্টেন্ট আপডেট হয়ে থাকে, নতুন কন্টেন্ট থেকে রিমুভ হওয়া ছবিগুলো ডিলিট
  if (data.content && existingBlog.content && existingBlog.content !== data.content) {
    cleanupBlogImagesOnUpdate(existingBlog.content, data.content);
  }

  return updatedBlog;
};

export const deleteBlogService = async (id: string) => {
  // ১. ডিলিট করার আগে ইমেজের কভার ফটো ও কন্টেন্ট নেওয়া
  const blog = await prisma.blogPost.findUnique({
    where: { id },
    select: { image: true, content: true },
  });

  if (!blog) {
    throw new Error('Blog post not found');
  }

  const deletedBlog = await prisma.blogPost.delete({
    where: { id },
  });

  // ২. ব্লগের কভার ফটো ডিলিট করা
  if (blog.image) {
    deleteLocalFile(blog.image);
  }

  // ৩. ব্লগের HTML কন্টেন্টের ভেতরের সমস্ত ছবি সার্ভার থেকে ডিলিট করা
  if (blog.content) {
    deleteBlogContentImages(blog.content);
  }

  return deletedBlog;
};

export const addBlogCommentService = async (
  blogId: string,
  data: CreateBlogCommentInput
) => {
  const blog = await prisma.blogPost.findUnique({
    where: { id: blogId },
  });

  if (!blog) {
    throw new Error('Blog post not found');
  }

  return await prisma.blogComment.create({
    data: {
      ...data,
      blogId,
    },
  });
};

export const toggleBlogLikeService = async (
  id: string,
  action?: 'like' | 'unlike'
) => {
  const blog = await prisma.blogPost.findUnique({
    where: { id },
    select: { likes: true },
  });

  if (!blog) {
    throw new Error('Blog post not found');
  }

  // যদি action 'unlike' হয় এবং লাইক ১ বা তার বেশি থাকে, তবে ১ কমাবে
  if (action === 'unlike') {
    return await prisma.blogPost.update({
      where: { id },
      data: {
        likes: {
          decrement: blog.likes > 0 ? 1 : 0,
        },
      },
      include: {
        comments: true,
      },
    });
  }

  // ডিফল্টভাবে 'like' অ্যাকশন (increment: 1)
  return await prisma.blogPost.update({
    where: { id },
    data: {
      likes: {
        increment: 1,
      },
    },
    include: {
      comments: true,
    },
  });
};

export const deleteBlogCommentService = async (commentId: string) => {
  const comment = await prisma.blogComment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error('Comment not found');
  }

  return await prisma.blogComment.delete({
    where: { id: commentId },
  });
};

