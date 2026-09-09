import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod এর এরর মেসেজগুলো ক্লিন ফরম্যাটে সাজিয়ে পাঠানো
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.').replace('body.', ''),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
};

