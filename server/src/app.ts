import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
// Routes
import ProductRoutes from './routes/product.route.js';
import OrderRoutes from './routes/order.routes.js';
import CategoryRoutes from './routes/category.route.js';  
import HeroSlideRoutes from './routes/heroSlide.routes.js';
import VideoRoutes from './routes/video.route.js';
import BlogRoutes from './routes/blog.route.js';
import PartnerRoutes from './routes/partner.routes.js';
import SiteSettingsRoutes from './routes/siteSettings.route.js';
import UserRoutes from './routes/user.routes.js';
import { AuthRoutes } from './routes/auth.route.js';

// global error handler
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

const app: Application = express();

// 🟢 Capturing correct client IP behind reverse proxies (Vercel, Render, Nginx, Cloudflare etc.)
app.set('trust proxy', true);

// Security Middleware Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'http://localhost:5000'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  })
);

// Favicon 204 No Content
app.get('/favicon.ico', (_req: Request, res: Response) => {
  res.status(204).end();
});

// Root Route (Server Health Check)
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the API Service',
  }); 
});

// API Routes
app.use('/api/v1/product', ProductRoutes);
app.use('/api/v1/orders', OrderRoutes);
app.use('/api/v1/categories', CategoryRoutes);
app.use('/api/v1/hero-slides', HeroSlideRoutes);
app.use('/api/v1/videos', VideoRoutes);
app.use('/api/v1/blog', BlogRoutes);
app.use('/api/v1/partner', PartnerRoutes);
app.use('/api/v1/site-settings', SiteSettingsRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/auth', AuthRoutes);

// Global Error Handler Middleware
app.use(globalErrorHandler);

// 404 Not Found Middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
  });
});

export default app;