import { Request, Response } from 'express';
import {
  createHeroSlideService,
  getAllHeroSlidesService,
  getHeroSlideByIdService,
  updateHeroSlideService,
  toggleHeroSlideStatusService,
  deleteHeroSlideService,
} from '../services/heroSlide.service.js';
import { CreateHeroSlideInput, UpdateHeroSlideInput } from '../validations/heroSlide.validation.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';

const formatHeroSlideImage = (req: Request<any, any, any, any>, slide: any) => {
  if (!slide) return slide;

  return {
    ...(slide as Record<string, any>),
    image: slide.image ? getFullImageUrl(req, slide.image) : slide.image,
  };
};

export const createHeroSlideHandler = async (
  req: Request<{}, {}, CreateHeroSlideInput>,
  res: Response
) => {
  try {
    const slide = await createHeroSlideService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      data: formatHeroSlideImage(req, slide),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create hero slide',
    });
  }
};

export const getHeroSlidesHandler = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const slides = await getAllHeroSlidesService(search);
    const formattedData = slides.map((slide: any) => formatHeroSlideImage(req, slide));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch hero slides',
    });
  }
};

export const getHeroSlideByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const slide = await getHeroSlideByIdService(req.params.id);
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: formatHeroSlideImage(req, slide),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch hero slide',
    });
  }
};

export const updateHeroSlideHandler = async (
  req: Request<{ id: string }, {}, UpdateHeroSlideInput>,
  res: Response
) => {
  try {
    const slide = await updateHeroSlideService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Hero slide updated successfully',
      data: formatHeroSlideImage(req, slide),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update hero slide',
    });
  }
};

export const toggleHeroSlideStatusHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const slide = await toggleHeroSlideStatusService(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Hero slide status updated successfully',
      data: formatHeroSlideImage(req, slide),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle status',
    });
  }
};

export const deleteHeroSlideHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await deleteHeroSlideService(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Hero slide deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete hero slide',
    });
  }
};