import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

// Routes
import ProductRoutes from './routes/product.route.js';
import OrderRoutes from './routes/order.routes.js';
import CategoryRoutes from './routes/category.route.js';  

const app: Application = express();

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
app.use(cors());

// 🟢 শুধুমাত্র লিমিট সহ পার্সার দুটি রাখুন (ডুপ্লিকেট আগের দুটি ডিলিট করা হয়েছে)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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

// 404 Not Found Middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
  });
});

export default app;