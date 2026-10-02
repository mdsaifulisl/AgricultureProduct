import { Request, Response } from 'express';
import {
  getSiteSettingsService,
  updateSiteSettingsService,
} from '../services/siteSettings.service.js';
import type { UpdateSiteSettingsInput } from '../validations/siteSettings.validation.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';

const formatSiteSettingsImages = (req: Request<any, any, any, any>, settings: any) => {
  if (!settings) return settings;

  return {
    ...(settings as Record<string, any>),
    siteLogo: settings.siteLogo ? getFullImageUrl(req, settings.siteLogo) : settings.siteLogo,
    siteFavicon: settings.siteFavicon ? getFullImageUrl(req, settings.siteFavicon) : settings.siteFavicon,
  };
};

export const getSiteSettingsHandler = async (req: Request, res: Response) => {
  try {
    const settings = await getSiteSettingsService();

    return res.status(200).json({
      success: true,
      data: formatSiteSettingsImages(req, settings),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch site settings',
    });
  }
};

export const updateSiteSettingsHandler = async (
  req: Request<{}, {}, UpdateSiteSettingsInput>,
  res: Response
) => {
  try {
    // মিডলওয়্যার থেকেই req.body.siteLogo ও req.body.siteFavicon প্রসেস হয়ে স্ট্রিং পাথে রূপান্তরিত হয়ে গেছে
    const updatedSettings = await updateSiteSettingsService(req.body);

    return res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      data: formatSiteSettingsImages(req, updatedSettings),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update site settings',
    });
  }
};