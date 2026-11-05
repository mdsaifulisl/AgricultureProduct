import { Router } from 'express';
import { generateSitemap, generateRobotsTxt } from '../controllers/sitemap.controller.js';

const router = Router();

router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', generateRobotsTxt);

export default router;

