/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../../api/axiosInstance';
import type {
  ApiResponse,
  BlogPost,
  CreateBlogCommentInput,
} from './blogTypes';

export const fetchBlogsApi = async (): Promise<ApiResponse<BlogPost[]>> => {
  const response = await axiosInstance.get<ApiResponse<BlogPost[]>>('/blog');
  return response.data;
};

export const fetchBlogByIdApi = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await axiosInstance.get<ApiResponse<BlogPost>>(`/blog/${id}`);
  return response.data;
};

export const createBlogApi = async (
  blogData: FormData | Record<string, any>
): Promise<ApiResponse<BlogPost>> => {
  const response = await axiosInstance.post<ApiResponse<BlogPost>>('/blog', blogData, {
    headers:
      blogData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
  });
  return response.data;
};

export const updateBlogApi = async (
  id: string,
  blogData: FormData | Record<string, any>
): Promise<ApiResponse<BlogPost>> => {
  const response = await axiosInstance.patch<ApiResponse<BlogPost>>(`/blog/${id}`, blogData, {
    headers:
      blogData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
  });
  return response.data;
};

export const deleteBlogApi = async (id: string): Promise<ApiResponse<{ id: string }>> => {
  const response = await axiosInstance.delete<ApiResponse<{ id: string }>>(`/blog/${id}`);
  return response.data;
};

export const addCommentApi = async (
  blogId: string,
  commentData: CreateBlogCommentInput
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post<ApiResponse<any>>(
    `/blog/${blogId}/comments`,
    commentData
  );
  return response.data;
};

export const deleteCommentApi = async (
  commentId: string
): Promise<ApiResponse<{ id: string }>> => {
  const response = await axiosInstance.delete<ApiResponse<{ id: string }>>(
    `/blog/comments/${commentId}`
  );
  return response.data;
};

export const likeBlogApi = async (
  id: string,
  action: 'like' | 'unlike' = 'like'
): Promise<ApiResponse<BlogPost>> => {
  const response = await axiosInstance.patch<ApiResponse<BlogPost>>(
    `/blog/${id}/like`,
    { action }
  );
  return response.data;
};

export const uploadEditorImageApi = async (
  formData: FormData
): Promise<ApiResponse<{ url: string }>> => {
  const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
    '/blog/upload-editor-image',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
};