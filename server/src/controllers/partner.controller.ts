import { Request, Response, NextFunction } from 'express';
import { PartnerService } from '../services/partner.service.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';

const formatPartnerImage = (req: Request<any, any, any, any>, partner: any) => {
  if (!partner) return partner;

  return {
    ...(partner as Record<string, any>),
    logo: partner.logo ? getFullImageUrl(req, partner.logo) : partner.logo,
  };
};

export const createPartnerHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, websiteUrl, logo } = req.body;

    const payload: Record<string, any> = {
      name,
      websiteUrl: websiteUrl || null,
    };

    // upload.single() হলে req.file, আর upload.array() হলে req.files পাওয়া যায়
    const singleFile = req.file as Express.Multer.File | undefined;
    const arrayFiles = req.files as Express.Multer.File[] | undefined;

    if (singleFile?.filename) {
      payload.logo = `/uploads/partners/${singleFile.filename}`;
    } else if (arrayFiles && arrayFiles.length > 0 && arrayFiles[0].filename) {
      payload.logo = `/uploads/partners/${arrayFiles[0].filename}`;
    } else if (logo) {
      payload.logo = logo;
    }

    const partner = await PartnerService.createPartner(payload as any);

    return res.status(201).json({
      success: true,
      message: 'Partner created successfully',
      data: formatPartnerImage(req, partner),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create partner',
    });
  }
};

export const getPartnersHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await PartnerService.getAllPartners();

    let formattedData;
    if (Array.isArray(result)) {
      formattedData = result.map((p) => formatPartnerImage(req, p));
    } else {
      formattedData = result;
    }

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch partners',
    });
  }
};

export const getPartnerByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const partner = await PartnerService.getSinglePartner(req.params.id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: formatPartnerImage(req, partner),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch partner',
    });
  }
};

export const updatePartnerHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { name, websiteUrl, logo } = req.body;

    const payload: Record<string, any> = {};

    if (name !== undefined) payload.name = name;
    if (websiteUrl !== undefined) payload.websiteUrl = websiteUrl;

    const singleFile = req.file as Express.Multer.File | undefined;
    const arrayFiles = req.files as Express.Multer.File[] | undefined;

    if (singleFile?.filename) {
      payload.logo = `/uploads/partners/${singleFile.filename}`;
    } else if (arrayFiles && arrayFiles.length > 0 && arrayFiles[0].filename) {
      payload.logo = `/uploads/partners/${arrayFiles[0].filename}`;
    } else if (logo !== undefined) {
      payload.logo = logo;
    }

    const partner = await PartnerService.updatePartner(req.params.id, payload as any);

    return res.status(200).json({
      success: true,
      message: 'Partner updated successfully',
      data: formatPartnerImage(req, partner),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update partner',
    });
  }
};

export const deletePartnerHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const deletedPartner = await PartnerService.deletePartner(id);

    return res.status(200).json({
      success: true,
      message: 'Partner deleted successfully',
      data: deletedPartner,
    });
  } catch (error: any) {
    next(error);
  }
};