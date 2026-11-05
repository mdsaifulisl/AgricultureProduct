import { Request, Response } from 'express';
import { getAllIpsService, toggleBlockIpService, getDeviceBlocksService, toggleDeviceBlockService } from '../services/ipLog.service.js';

// সব IP এর লিস্ট ক্লাইন্টকে দেওয়ার জন্য
export const getAllIpsController = async (_req: Request, res: Response) => {
  try {
    const result = await getAllIpsService();
    return res.status(200).json({
      success: true,
      message: 'All IPs fetched successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch IPs',
    });
  }
};

// IP ব্লক বা আনব্লক (Toggle) করার জন্য
export const toggleBlockIpController = async (req: Request, res: Response) => {
  try {
    const { ip, isBlocked } = req.body;
    const result = await toggleBlockIpService(ip, isBlocked);

    return res.status(200).json({
      success: true,
      message: `IP ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update IP status',
    });
  }
};

export const getDeviceBlocksController = async (_req: Request, res: Response) => {
  const data = await getDeviceBlocksService();
  res.status(200).json({ success: true, data });
};

export const toggleDeviceBlockController = async (req: Request, res: Response) => {
  const { fingerprint, isBlocked, reason } = req.body;
  const data = await toggleDeviceBlockService(fingerprint, isBlocked, reason);
  res.status(200).json({ success: true, data });
};
