import { Request, Response, RequestHandler } from 'express';
import { VideoService } from "../services/video.service.js";

const createVideo = async (req: Request, res: Response) => {
  try {
    const result = await VideoService.createVideo(req.body);
    res.status(201).json({
      success: true,
      message: "ভিডিও সফলভাবে তৈরি করা হয়েছে",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি", error });
  }
};

const getAllVideos = async (req: Request, res: Response) => {
  try {
    const searchTerm = typeof req.query.searchTerm === "string" ? req.query.searchTerm : undefined;
    const result = await VideoService.getAllVideos(searchTerm);
    res.status(200).json({
      success: true,
      message: "সকল ভিডিও সফলভাবে আনা হয়েছে",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি", error });
  }
};

const getVideoById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({ success: false, message: "অকার্যকর ভিডিও আইডি" });
      return;
    }
    
    const result = await VideoService.getVideoById(id);

    if (!result) {
      res.status(404).json({ success: false, message: "ভিডিও পাওয়া যায়নি" });
      return;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি", error });
  }
};

const updateVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({ success: false, message: "অকার্যকর ভিডিও আইডি" });
      return;
    }

    const result = await VideoService.updateVideo(id, req.body);

    res.status(200).json({
      success: true,
      message: "ভিডিও সফলভাবে আপডেট করা হয়েছে",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি", error });
  }
};

const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const videoId = Array.isArray(id) ? id[0] : id;
    await VideoService.deleteVideo(videoId);
    res.status(200).json({
      success: true,
      message: "ভিডিও মুছে ফেলা হয়েছে",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি", error });
  }
};

export const VideoController = {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};


