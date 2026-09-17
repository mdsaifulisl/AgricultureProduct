import prisma from '../config/prisma.js';
import type { CreateCategoryInput, UpdateCategoryInput } from '../validations/category.validation.js';
import { deleteLocalFile } from '../utils/file.util.js';

export const createCategoryService = async (data: CreateCategoryInput & { images?: string[] }) => {
  // 🟢 req.body বা মিডলওয়্যার থেকে আসা 'images' ফিল্ডটি আলাদা করে সরিয়ে নেওয়া হচ্ছে
  const { images, ...categoryData } = data;

  return await prisma.category.create({
    data: categoryData,
  });
};

export const getAllCategoriesService = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getCategoryByIdService = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const updateCategoryService = async (
  id: string, 
  data: UpdateCategoryInput & { images?: string[] }
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  // 🟢 এখানেও 'images' বাদ দিয়ে বাকি ফিল্ডগুলো নেওয়া হচ্ছে
  const { images, ...categoryData } = data;

  let cleanedImage = categoryData.image;
  if (cleanedImage && (cleanedImage.startsWith('http://') || cleanedImage.startsWith('https://'))) {
    try {
      cleanedImage = new URL(cleanedImage).pathname;
    } catch {
      cleanedImage = categoryData.image;
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      ...categoryData,
      ...(cleanedImage && { image: cleanedImage }),
    },
  });

  if (cleanedImage && existingCategory.image && existingCategory.image !== cleanedImage) {
    deleteLocalFile(existingCategory.image);
  }

  return updatedCategory;
};

export const deleteCategoryService = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const deletedCategory = await prisma.category.delete({
    where: { id },
  });

  if (category.image) {
    deleteLocalFile(category.image);
  }

  return deletedCategory;
};