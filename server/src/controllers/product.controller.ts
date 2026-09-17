import { Request, Response } from 'express';
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  IProductQuery,
} from '../services/product.service.js';
import { CreateProductInput, UpdateProductInput } from '../validations/product.validation.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';

// 🟢 একক প্রডাক্টের ইমেজ URL কে Full Absolute URL এ রূপান্তর করার হেলপার
const formatProductImage = (req: Request<any, any, any, any>, product: any) => {
  if (!product) return product;

  return {
    ...(product as Record<string, any>), // 👈 Type casting
    images: Array.isArray(product.images)
      ? product.images.map((img: string) => getFullImageUrl(req, img))
      : [],
  };
};

export const createProductHandler = async (
  req: Request<{}, {}, CreateProductInput>,
  res: Response
) => {
  try {
    const product = await createProductService(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: formatProductImage(req, product),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

export const getProductsHandler = async (
  req: Request<{}, {}, {}, IProductQuery>,
  res: Response
) => {
  try {
    const result = await getAllProductsService(req.query);

    // যদি রেজাল্ট অ্যারে হয় অথবা pagination object ({ products: [...] }) হয়
    let formattedData;
    if (Array.isArray(result)) {
      formattedData = result.map((p) => formatProductImage(req, p));
    } else if (result && typeof result === 'object' && Array.isArray((result as any).products)) {
      const paginatedResult = result as Record<string, any>;
      formattedData = {
        ...paginatedResult,
        products: paginatedResult.products.map((p: any) => formatProductImage(req, p)),
      };
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
      message: error.message || 'Failed to fetch products',
    });
  }
};

export const getProductByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const product = await getProductByIdService(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: formatProductImage(req, product),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product',
    });
  }
};

export const updateProductHandler = async (
  req: Request<{ id: string }, {}, UpdateProductInput>,
  res: Response
) => {
  try {
    const product = await updateProductService(req.params.id, req.body);
    
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: formatProductImage(req, product),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

export const deleteProductHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await deleteProductService(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};



