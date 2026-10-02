import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Request ইন্টারফেসে user প্রপার্টি যোগ করা
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authGuard = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ১. কুকি অথবা authorization হেডার থেকে টোকেন নেওয়া
      let token = req.cookies?.accessToken;

      if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'আপনার এই রিসোর্সে অ্যাক্সেসের অনুমতি নেই। লগইন করুন',
        });
      }

      // ২. টোকেন ভেরিফাই করা
      const secret = process.env.JWT_SECRET || 'your_fallback_secret_key';
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // ৩. কুকি এবং authorization হেডার থেকে টুকেন নেওয়া
      req.user = decoded;

      // ৪. রোল বেসড অ্যাক্সেস চেক (যদি ভূমিকা নির্দিষ্ট করা থাকে)
      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: 'আপনার এই কাজটি করার অনুমতি বা এক্সেস নেই',
        });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: 'অবৈধ বা মেয়াদোত্তীর্ণ টোকেন। পুনরায় লগইন করুন',
      });
    }
  };
};