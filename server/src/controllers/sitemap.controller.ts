import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const generateSitemap = async (req: Request, res: Response) => {
  try {
    const baseUrl = (process.env.CLIENT_URL || 'https://yourdomain.com').replace(/\/$/, '');

    // ১. স্ট্যাটিক পেজসমূহ
    const staticPages = [
      '',
      '/shop',
      '/categories',
      '/offers',
      '/blog',
      '/about',
      '/videos',
    ];

    // ২. Prisma দিয়ে ডাটাবেজ থেকে প্রোডাক্ট আইডি টেনে আনা
    const products = await prisma.product.findMany({
      select: { id: true, updatedAt: true },
    });

    // ৩. Prisma দিয়ে ডাটাবেজ থেকে ব্লগ আইডি টেনে আনা
    const blogs = await prisma.blogPost.findMany({
      select: { id: true, updatedAt: true },
    });

    // XML স্ট্রাকচার শুরু
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // স্ট্যাটিক ইউআরএল যোগ করা
    staticPages.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // ডায়নামিক প্রোডাক্ট ইউআরএল যোগ করা (/product/:id)
    products.forEach((product) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product/${product.id}</loc>\n`;
      xml += `    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // ডায়নামিক ব্লগ পোস্ট ইউআরএল যোগ করা (/blog/post/:id)
    blogs.forEach((blog) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/post/${blog.id}</loc>\n`;
      xml += `    <lastmod>${new Date(blog.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    // রেসপন্স হেডার সেট করে XML রিটার্ন করা
    res.type('application/xml');
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};


export const generateRobotsTxt = (req: Request, res: Response) => {
  const baseUrl = process.env.CLIENT_URL || 'https://yourdomain.com';

  const robotsTxt = `User-agent: *
Allow: /

# Block sensitive/private pages
Disallow: /cart
Disallow: /checkout
Disallow: /login
Disallow: /admin
Disallow: /dashboard

# Dynamic Sitemap URL
Sitemap: ${baseUrl}/sitemap.xml
`;

  res.type('text/plain');
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.send(robotsTxt);
};
