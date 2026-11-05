import { Router } from 'express';
import { getAllIpsController, toggleBlockIpController, getDeviceBlocksController, toggleDeviceBlockController } from '../controllers/ipLog.controller.js';
import { validate } from '../middlewares/validate.js';
import { toggleBlockIpSchema } from '../validations/ipLog.validation.js';
import { auth } from '../middlewares/auth.js';
import { z } from 'zod';

const router = Router();

router.get('/devices', auth('admin'), getDeviceBlocksController);
router.patch('/devices/toggle-block', auth('admin'), (req, res, next) => {
  const parsed = z.object({ fingerprint: z.string().regex(/^[a-f0-9]{64}$/i), isBlocked: z.boolean(), reason: z.string().max(300).optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'ডিভাইস ব্লক তথ্য সঠিক নয়।' });
  next();
}, toggleDeviceBlockController);

// ফ্রন্টএন্ডে সব IP দেখাবে
router.get('/', auth('admin', 'moderator'), getAllIpsController);

// ফ্রন্টএন্ড থেকে ব্লক/আনব্লক করবে
router.patch(
  '/toggle-block',
  auth('admin', 'moderator'),
  validate(toggleBlockIpSchema),
  toggleBlockIpController
);

export const IpLogRoutes = router;

