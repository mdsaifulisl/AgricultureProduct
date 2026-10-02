import prisma from '../config/prisma.js';
import type { UpdateSiteSettingsInput } from '../validations/siteSettings.validation.js';
import { deleteLocalFile } from '../utils/file.util.js';

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

export const getSiteSettingsService = async () => {
  let settings = await prisma.siteSetting.findFirst();

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {},
    });
  }

  return settings;
};

export const updateSiteSettingsService = async (data: UpdateSiteSettingsInput) => {
  const existingSettings = await getSiteSettingsService();

  // images ফিল্ডটি আলাদা ডিস্ট্রাকচার করে বাদ দিয়ে দেয়া হলো
  const { siteLogo, siteFavicon, images, ...settingsData } = data as any;

  const cleanedLogo = cleanImagePath(siteLogo);
  const cleanedFavicon = cleanImagePath(siteFavicon);

  const updatedSettings = await prisma.siteSetting.update({
    where: { id: existingSettings.id },
    data: {
      ...settingsData,
      ...(cleanedLogo !== undefined && { siteLogo: cleanedLogo }),
      ...(cleanedFavicon !== undefined && { siteFavicon: cleanedFavicon }),
    },
  });

  if (cleanedLogo !== undefined && existingSettings.siteLogo && existingSettings.siteLogo !== cleanedLogo) {
    deleteLocalFile(existingSettings.siteLogo);
  }

  if (cleanedFavicon !== undefined && existingSettings.siteFavicon && existingSettings.siteFavicon !== cleanedFavicon) {
    deleteLocalFile(existingSettings.siteFavicon);
  }

  return updatedSettings;
};

