import { Request, Response, NextFunction } from 'express';
import { getAboutData, updateAboutData } from '../services/about.service.js';

// Get About Data Controller
export const getAboutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getAboutData();
    res.status(200).json({
      success: true,
      message: 'About section data fetched successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Update About Data Controller
export const updateAboutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    
    // যদি ফাইল আপলোড থেকে ছবি ইমেজ ইউআরএল হিসেবে দেওয়া থাকে
    if (req.body.images && req.body.images.length > 0) {
      payload.imageUrl = req.body.images[0];
    }

    const updatedData = await updateAboutData(payload);

    res.status(200).json({
      success: true,
      message: 'About section updated successfully',
      data: updatedData,
    });
  } catch (error) {
    next(error);
  }
};