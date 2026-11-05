// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import path from 'path';
// import cookieParser from 'cookie-parser';
// import statusMonitor from 'express-status-monitor';

// // Routes
// import ProductRoutes from './routes/product.route.js';
// import OrderRoutes from './routes/order.routes.js';
// import CategoryRoutes from './routes/category.route.js';  
// import HeroSlideRoutes from './routes/heroSlide.routes.js';
// import VideoRoutes from './routes/video.route.js';
// import BlogRoutes from './routes/blog.route.js';
// import PartnerRoutes from './routes/partner.routes.js';
// import SiteSettingsRoutes from './routes/siteSettings.route.js';
// import UserRoutes from './routes/user.routes.js';
// import { AuthRoutes } from './routes/auth.route.js';
// import aboutRouter from './routes/about.route.js';
// import { IpLogRoutes } from './routes/ipLog.routes.js';

// // global error handler
// import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

// const app: Application = express();

// // 🟢 Capturing correct client IP behind reverse proxies (Vercel, Render, Nginx, Cloudflare etc.)
// app.set('trust proxy', true);

// // Security Middleware Configuration
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         imgSrc: ["'self'", 'data:', 'blob:', 'http://localhost:5000'],
//       },
//     },
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
//   })
// );

// // Middlewares
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// app.use(express.static(path.join(process.cwd(), 'public')));
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: 'http://localhost:5173', 
//     credentials: true, 
//   })
// );

// // Favicon 204 No Content
// // app.get('/favicon.ico', (_req: Request, res: Response) => {
// //   res.status(204).end();
// // });

// // Root Route (Server Health Check)
// // app.get('/', (_req: Request, res: Response) => {
// //   res.status(200).json({
// //     success: true,
// //     message: 'Welcome to the API Service',
// //   }); 
// // });






// app.use(statusMonitor()); 

// // API Routes
// app.use('/api/v1/product', ProductRoutes);
// app.use('/api/v1/orders', OrderRoutes);
// app.use('/api/v1/categories', CategoryRoutes);
// app.use('/api/v1/hero-slides', HeroSlideRoutes);
// app.use('/api/v1/videos', VideoRoutes);
// app.use('/api/v1/blog', BlogRoutes);
// app.use('/api/v1/partner', PartnerRoutes);
// app.use('/api/v1/site-settings', SiteSettingsRoutes);
// app.use('/api/v1/user', UserRoutes);
// app.use('/api/v1/auth', AuthRoutes);
// app.use('/api/v1/about', aboutRouter);
// app.use('/api/v1/iplog', IpLogRoutes);


// // ২. Frontend-এর Build ফাইলগুলোকে Static হিসেবে সার্ভ করা
// const frontendBuildPath = path.join(__dirname, '../../frontend/dist'); 
// app.use(express.static(frontendBuildPath));

// // ৩. বাকি সব Routing/Request Frontend-এর index.html-এ পাঠানো (SPA Routing Support)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendBuildPath, 'index.html'));
// });


// // Global Error Handler Middleware
// app.use(globalErrorHandler);

// // 404 Not Found Middleware
// app.use((req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     message: 'Not Found',
//   });
// });

// export default app;









import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
import statusMonitor from 'express-status-monitor';

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
import aboutRouter from './routes/about.route.js';
import { IpLogRoutes } from './routes/ipLog.routes.js';
import sitemapRoute from './routes/sitemap.route.js';
import rateLimit from 'express-rate-limit';
import { createRateLimitStore } from './config/rateLimitStore.js';

// Global error handler
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

const app: Application = express();

// 🟢 Capturing correct client IP behind reverse proxies
const proxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (proxyHops > 0) app.set('trust proxy', proxyHops);

// 🟢 Dynamic CORS setup (একই URL-এ ফ্রন্টএন্ড-ব্যাকএন্ড চললে CORS ইস্যু বন্ধ থাকবে)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5000').split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('এই origin থেকে অনুরোধ অনুমোদিত নয়।'));
    },
    credentials: true,
  })
);

// 🟢 Security Middleware Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
        connectSrc: ["'self'", 'http:', 'https:'],
        // ইউটিউব এবং অন্যান্য এমবেডেড ভিডিও ফ্রেম অ্যালাউ করার জন্য এটি যোগ করুন:
        frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com", "https://www.youtube-nocookie.com"],
        childSrc: ["'self'", "https://www.youtube.com", "https://youtube.com", "https://www.youtube-nocookie.com"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Sitemap ও robots route static file এবং SPA fallback-এর আগেই resolve হবে।
app.use('/', sitemapRoute);

app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(cookieParser());

// Server Monitor UI
if (process.env.ENABLE_STATUS_MONITOR === 'true') app.use(statusMonitor());
app.use('/api', rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false, store: createRateLimitStore('api:') }));

// 🟢 API Routes
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
app.use('/api/v1/about', aboutRouter);
app.use('/api/v1/iplog', IpLogRoutes);

// 🟢 Serve Frontend Build Files
const frontendBuildPath = path.join(process.cwd(), '../frontend/dist');
app.use(express.static(frontendBuildPath, {
  setHeaders: (res, filePath) => {
    const fileName = path.basename(filePath);
    if (fileName === 'index.html' || fileName === 'sw.js' || fileName === 'registerSW.js' || fileName === 'manifest.webmanifest') {
      // HTML ও service worker revalidate হবে, যাতে deployment-এর পর পুরোনো build আটকে না থাকে।
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else if (/[-.][a-f0-9]{8,}\./i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  },
}));

// 🟢 API 404 Handler (যদি কোনো /api/v1/... ম্যাচ না করে)
// 🟢 ১. API 404 Handler (যদি কোনো /api/... ম্যাচ না করে)
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// 🟢 ২. Catch-All Route for Frontend SPA (React Router support)
app.get('/{*splat}', (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), { headers: { 'Cache-Control': 'no-cache' } }, (err) => {
    if (err) {
      res.status(500).send('Frontend build folder not found.');
    }
  });
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;

