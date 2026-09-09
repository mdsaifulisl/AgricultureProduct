import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreateProductInput, UpdateProductInput } from '../validations/product.validation.js';
import { deleteLocalFile, deleteLocalFiles } from '../utils/file.util.js';

export interface IProductQuery {
  categorySlug?: string;
  isFeatured?: string;
  search?: string;
}

export const createProductService = async (data: CreateProductInput) => {
  const { specifications, sku, ...productData } = data;

  // sku না পাঠানো হলে অটোমেটিক ইউনিক SKU তৈরি করা হবে
  const finalSku = sku || `SKU-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    return await prisma.product.create({
      data: {
        ...productData,
        sku: finalSku,
        specifications: specifications
          ? {
              create: specifications,
            }
          : undefined,
      },
      include: {
        specifications: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error(`The SKU "${finalSku}" already exists. Please provide a unique SKU.`);
    }
    throw error;
  }
};

export const getAllProductsService = async (query: IProductQuery) => {
  const { categorySlug, isFeatured, search } = query;

  const where: Prisma.ProductWhereInput = {};

  if (categorySlug) {
    where.categorySlug = categorySlug;
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured === 'true';
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }

  return await prisma.product.findMany({
    where,
    include: {
      specifications: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getProductByIdService = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      specifications: true,
    },
  });
};

// product.service.ts-এর updateProductService অংশ

// product.service.ts

export const updateProductService = async (
  id: string,
  data: UpdateProductInput
) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: { images: true },
  });

  if (!existingProduct) {
    throw new Error('Product not found');
  }

  const { specifications, images, ...productData } = data;

  // 💡 ১. images যদি undefined বা অনুপস্থিত হয়, তবে বিদ্যমান images-ই রাখা হবে।
  // 💡 ২. যদি নতুন images পাঠানো হয়, তবে সেটিকে ক্লিওন করা হবে।
  let cleanedImages: string[] | undefined = undefined;

  if (Array.isArray(images)) {
    cleanedImages = images.map((img) => {
      if (img.startsWith('http://') || img.startsWith('https://')) {
        try {
          return new URL(img).pathname;
        } catch {
          return img;
        }
      }
      return img;
    });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        // 🟢 যদি নতুন ছবি (অ্যারে) পাঠানো হয় তবেই কেবল ডাটাবেজের images ফিল্ড আপডেট হবে
        ...(cleanedImages !== undefined && { images: cleanedImages }),

        ...(specifications && {
          specifications: {
            deleteMany: {},
            create: specifications.map((spec) => ({
              key: spec.key,
              value: spec.value,
            })),
          },
        }),
      },
      include: {
        specifications: true,
      },
    });

    // 🟢 ৩. ফাইল ডিলিট করার লজিক: কেবল যদি images পাঠানো হয়ে থাকে
    if (cleanedImages !== undefined) {
      const oldImages = existingProduct.images || [];

      // যেসব পুরোনো ছবি নতুন লিস্টে (cleanedImages) নেই সেগুলো খুঁজে বের করা
      const removedImages = oldImages.filter(
        (oldImg) => !cleanedImages!.includes(oldImg)
      );

      if (removedImages.length > 0) {
        deleteLocalFiles(removedImages);
      }
    }

    return updatedProduct;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new Error(
        'The SKU you provided already exists on another product.'
      );
    }
    throw error;
  }
};

export const deleteProductService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { images: true },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // 
  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  // ২. ডাটাবেস ডিলিট সফল হওয়ার পর ফাইলগুলো রিমুভ করুন
  if (product.images && product.images.length > 0) {
    deleteLocalFiles(product.images);
  }

  return deletedProduct;
};

