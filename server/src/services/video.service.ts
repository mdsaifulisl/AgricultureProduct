import { PrismaClient, Video, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const createVideo = async (payload: Video): Promise<Video> => {
  // যদি নতুন ভিডিওটি featured: true হয়, তবে বাকি সব ভিডিওর featured = false করুন
  if (payload.featured) {
    await prisma.video.updateMany({
      where: { featured: true },
      data: { featured: false },
    });
  }

  return await prisma.video.create({
    data: payload,
  });
};

const getAllVideos = async (searchTerm?: string): Promise<Video[]> => {
  const whereCondition: Prisma.VideoWhereInput = searchTerm
    ? {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { category: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      }
    : {};

  return await prisma.video.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
  });
};

const getVideoById = async (id: string): Promise<Video | null> => {
  return await prisma.video.findUnique({
    where: { id },
  });
};

const updateVideo = async (
  id: string,
  payload: Partial<Video>
): Promise<Video> => {
  // যদি আপডেট করার সময় featured: true দেওয়া হয়, তবে বর্তমান আইডি বাদে বাকিগুলোর featured = false করুন
  if (payload.featured) {
    await prisma.video.updateMany({
      where: {
        id: { not: id },
        featured: true,
      },
      data: { featured: false },
    });
  }

  return await prisma.video.update({
    where: { id },
    data: payload,
  });
};

const deleteVideo = async (id: string): Promise<Video> => {
  return await prisma.video.delete({
    where: { id },
  });
};

export const VideoService = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};