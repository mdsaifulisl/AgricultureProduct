import prisma from '../config/prisma.js';
import type { CreateHeroSlideInput, UpdateHeroSlideInput } from '../validations/heroSlide.validation.js';
import { deleteLocalFile } from '../utils/file.util.js';

export const createHeroSlideService = async (data: CreateHeroSlideInput & { images?: string[] }) => {
  // ফ্রন্টএন্ড থেকে আসা 'id' (নাম্বারটি) বাদ দিয়ে শুধু বাকি ফিল্ডগুলো 'slideData' তে রাখা হচ্ছে
  const { images, id, ...slideData } = data as any;

  const imageValue = images && images.length > 0 ? images[0] : slideData.image ?? '';

  const finalImageData = {
    ...slideData,
    image: imageValue,
  };

  return await prisma.heroSlide.create({
    data: finalImageData, // এখানে আর 'id' ফিল্ড থাকছে না
  });
};

export const getAllHeroSlidesService = async (search?: string) => {
  return await prisma.heroSlide.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { tag: { contains: search, mode: 'insensitive' } },
            { badge: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getHeroSlideByIdService = async (id: string) => {
  return await prisma.heroSlide.findUnique({
    where: { id },
  });
};

export const updateHeroSlideService = async (
  id: string,
  data: UpdateHeroSlideInput & { images?: string[] }
) => {
  const existingSlide = await prisma.heroSlide.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!existingSlide) {
    throw new Error('Hero slide not found');
  }

  const { images, ...slideData } = data;

  let cleanedImage = images && images.length > 0 ? images[0] : slideData.image;

  if (cleanedImage && (cleanedImage.startsWith('http://') || cleanedImage.startsWith('https://'))) {
    try {
      cleanedImage = new URL(cleanedImage).pathname;
    } catch {
      cleanedImage = slideData.image;
    }
  }

  const updatedSlide = await prisma.heroSlide.update({
    where: { id },
    data: {
      ...slideData,
      ...(cleanedImage && { image: cleanedImage }),
    },
  });

  if (cleanedImage && existingSlide.image && existingSlide.image !== cleanedImage) {
    deleteLocalFile(existingSlide.image);
  }

  return updatedSlide;
};

export const toggleHeroSlideStatusService = async (id: string) => {
  const existingSlide = await prisma.heroSlide.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!existingSlide) {
    throw new Error('Hero slide not found');
  }

  const newStatus = existingSlide.status === 'active' ? 'inactive' : 'active';

  return await prisma.heroSlide.update({
    where: { id },
    data: { status: newStatus },
  });
};

export const deleteHeroSlideService = async (id: string) => {
  const slide = await prisma.heroSlide.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!slide) {
    throw new Error('Hero slide not found');
  }

  const deletedSlide = await prisma.heroSlide.delete({
    where: { id },
  });

  if (slide.image) {
    deleteLocalFile(slide.image);
  }

  return deletedSlide;
};