import { Partner, Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import { deleteLocalFile } from '../utils/file.util.js';

const createPartner = async (payload: Prisma.PartnerCreateInput): Promise<Partner> => {
  const result = await prisma.partner.create({
    data: payload,
  });
  return result;
};

const getAllPartners = async (): Promise<Partner[]> => {
  const result = await prisma.partner.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const getSinglePartner = async (id: string): Promise<Partner | null> => {
  const result = await prisma.partner.findUnique({
    where: { id },
  });
  return result;
};

const updatePartner = async (
  id: string,
  payload: Prisma.PartnerUpdateInput
): Promise<Partner> => {
  const existingPartner = await prisma.partner.findUnique({
    where: { id },
    select: { logo: true },
  });

  if (!existingPartner) {
    throw new Error('Partner not found');
  }

  const result = await prisma.partner.update({
    where: { id },
    data: payload,
  });

  if (
    payload.logo &&
    typeof payload.logo === 'string' &&
    existingPartner.logo &&
    existingPartner.logo !== payload.logo
  ) {
    deleteLocalFile(existingPartner.logo);
  }

  return result;
};

const deletePartner = async (id: string): Promise<Partner> => {
  const partner = await prisma.partner.findUnique({
    where: { id },
    select: { logo: true },
  });

  if (!partner) {
    throw new Error('Partner not found');
  }

  const result = await prisma.partner.delete({
    where: { id },
  });

  if (partner.logo) {
    deleteLocalFile(partner.logo);
  }

  return result;
};

export const PartnerService = {
  createPartner,
  getAllPartners,
  getSinglePartner,
  updatePartner,
  deletePartner,
};