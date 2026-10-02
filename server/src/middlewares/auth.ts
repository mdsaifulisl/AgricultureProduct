import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ১. হেডার (Bearer <token>) অথবা কুকি (accessToken) থেকে টোকেন নেওয়া
      const token =
        req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'You are not authorized! Token missing.',
        });
      }

      // ২. টোকেন ভেরিফাই করা
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
        id: string;
        email: string;
        role: string;
      };

      // ৩. কেস-ইনসেনসিটিভ রোল ভিত্তিক এক্সেস কন্ট্রোল
      if (requiredRoles.length) {
        const userRole = decoded.role?.toLowerCase();
        const allowedRoles = requiredRoles.map((role) => role.toLowerCase());

        if (!userRole || !allowedRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden! You do not have permission to access this route.',
          });
        }
      }

      // ৪. ডিকোডেড ইউজার ডাটা req.user-এ সেট করা
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token!',
      });
    }
  };
};