import { Request, Response, NextFunction } from 'express';
import {
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
  addBlogCommentService,
  toggleBlogLikeService,
  IBlogQuery,
  deleteBlogCommentService,
} from '../services/blog.service.js';
import {
  CreateBlogPostInput,
  UpdateBlogPostInput,
  CreateBlogCommentInput,
} from '../validations/blog.validation.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';

const formatBlogImage = (req: Request<any, any, any, any>, blog: any) => {
  if (!blog) return blog;

  return {
    ...(blog as Record<string, any>),
    image: blog.image ? getFullImageUrl(req, blog.image) : blog.image,
  };
};

export const createBlogHandler = async (
  req: Request<{}, {}, CreateBlogPostInput>,
  res: Response
) => {
  try {
    const payload = { ...req.body };

    // Multer এর মাধ্যমে সিঙ্গেল কভার ফাইল আপলোড হলে তা ইমেজে সেট হবে
    if (req.file) {
      payload.image = `/uploads/blogs/${(req.file as any).filename}`;
    }

    const blog = await createBlogService(payload);

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: formatBlogImage(req, blog),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create blog post',
    });
  }
};

export const getBlogsHandler = async (
  req: Request<{}, {}, {}, IBlogQuery>,
  res: Response
) => {
  try {
    const result = await getAllBlogsService(req.query);

    let formattedData;
    if (Array.isArray(result)) {
      formattedData = result.map((b) => formatBlogImage(req, b));
    } else {
      formattedData = result;
    }

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch blog posts',
    });
  }
};

export const getBlogByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const blog = await getBlogByIdService(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: formatBlogImage(req, blog),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch blog post',
    });
  }
};

export const updateBlogHandler = async (
  req: Request<{ id: string }, {}, UpdateBlogPostInput>,
  res: Response
) => {
  try {
    const payload = { ...req.body };

    // আপডেট করার সময় নতুন ইমেজ পাঠালে তা সেট হবে
    if (req.file) {
      payload.image = `/uploads/blogs/${(req.file as any).filename}`;
    }

    const blog = await updateBlogService(req.params.id, payload);

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: formatBlogImage(req, blog),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update blog post',
    });
  }
};

export const deleteBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await deleteBlogService(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete blog post',
    });
  }
};

export const addCommentHandler = async (
  req: Request<{ id: string }, {}, CreateBlogCommentInput>,
  res: Response
) => {
  try {
    const comment = await addBlogCommentService(req.params.id, req.body);
    return res.status(201).json({
      success: true,
      message: 'আপনার মন্তব্য সফলভাবে যোগ করা হয়েছে',
      data: comment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to add comment',
    });
  }
};

export const likeBlogHandler = async (
  req: Request<{ id: string }, {}, { action?: 'like' | 'unlike' }>,
  res: Response
) => {
  try {
    const { action } = req.body; // Frontend থেকে { action: 'like' } বা { action: 'unlike' } পাঠানো হবে
    const updatedBlog = await toggleBlogLikeService(req.params.id, action);

    return res.status(200).json({
      success: true,
      message:
        action === 'unlike'
          ? 'Blog unliked successfully'
          : 'Blog liked successfully',
      data: formatBlogImage(req, updatedBlog),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update blog like',
    });
  }
};

export const uploadEditorImageHandler = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file || !(req.file as any).filename) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded',
      });
    }

    const relativePath = `/uploads/blogs/${(req.file as any).filename}`;
    const fullUrl = getFullImageUrl(req, relativePath);

    return res.status(200).json({
      success: true,
      url: fullUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};



export const deleteBlogComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = req.params.commentId as string; // <-- 'as string' যোগ করুন
    const deletedComment = await deleteBlogCommentService(commentId);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: deletedComment,
    });
  } catch (error) {
    next(error);
  }
};




