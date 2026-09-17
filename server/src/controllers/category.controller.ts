import { Request, Response } from 'express';
import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from '../services/category.service.js';
import { CreateCategoryInput, UpdateCategoryInput } from '../validations/category.validation.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';

const formatCategoryImage = (req: Request<any, any, any, any>, category: any) => {
  if (!category) return category;

  return {
    ...(category as Record<string, any>),
    image: category.image ? getFullImageUrl(req, category.image) : category.image,
  };
};

export const createCategoryHandler = async (
  req: Request<{}, {}, CreateCategoryInput>,
  res: Response
) => {
  try {
    const category = await createCategoryService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: formatCategoryImage(req, category),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category',
    });
  }
};

export const getCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoriesService();
    const formattedData = categories.map((cat: any) => formatCategoryImage(req, cat));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories',
    });
  }
};

export const getCategoryByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: formatCategoryImage(req, category),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch category',
    });
  }
};

export const updateCategoryHandler = async (
  req: Request<{ id: string }, {}, UpdateCategoryInput>,
  res: Response
) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: formatCategoryImage(req, category),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update category',
    });
  }
};

export const deleteCategoryHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await deleteCategoryService(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category',
    });
  }
};