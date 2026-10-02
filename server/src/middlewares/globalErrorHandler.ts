// middlewares/globalErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response, 
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
  });
};