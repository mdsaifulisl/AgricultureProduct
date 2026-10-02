/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
  likeBlog,
  setSelectedBlogId,
  toggleCommentModal,
  setCommentModalState,
} from './blogSlice';
import type { CreateBlogCommentInput } from './blogTypes';

export const useBlog = () => { 
  const dispatch = useAppDispatch();

  const {
    blogs,
    singleBlog,
    selectedBlogId,
    isCommentModalOpen,
    isLoading,
    isError,
    errorMessage,
  } = useAppSelector((state) => state.blog);

  const getAllBlogs = useCallback(() => {
    return dispatch(fetchBlogs()).unwrap();
  }, [dispatch]);

  const getBlogById = useCallback(
    (id: string) => {
      return dispatch(fetchBlogById(id)).unwrap();
    },
    [dispatch]
  );

  const handleCreateBlog = useCallback(
    (blogData: FormData | Record<string, any>) => {
      return dispatch(createBlog(blogData)).unwrap();
    },
    [dispatch]
  );

  const handleUpdateBlog = useCallback(
    (id: string, blogData: FormData | Record<string, any>) => {
      return dispatch(updateBlog({ id, blogData })).unwrap();
    },
    [dispatch]
  );

  const handleDeleteBlog = useCallback(
    (id: string) => {
      return dispatch(deleteBlog(id)).unwrap();
    },
    [dispatch]
  );

  const handleAddComment = useCallback(
    (payload: { blogId: string; commentData: CreateBlogCommentInput }) => {
      return dispatch(addComment(payload)).unwrap();
    },
    [dispatch]
  );

  const handleDeleteComment = useCallback(
    (commentId: string) => {
      return dispatch(deleteComment(commentId)).unwrap();
    },
    [dispatch]
  );

  const handleLikeBlog = useCallback(
    (id: string, action?: 'like' | 'unlike') => {
      return dispatch(likeBlog({ id, action })).unwrap();
    },
    [dispatch]
  );

  const handleSelectBlog = useCallback(
    (id: string | null) => {
      dispatch(setSelectedBlogId(id));
    },
    [dispatch]
  );

  const handleToggleCommentModal = useCallback(() => {
    dispatch(toggleCommentModal());
  }, [dispatch]);

  const handleSetCommentModalState = useCallback(
    (isOpen: boolean) => {
      dispatch(setCommentModalState(isOpen));
    },
    [dispatch]
  );

  return {
    blogs,
    singleBlog,
    selectedBlogId,
    isCommentModalOpen,
    isLoading,
    isError,
    errorMessage,

    getAllBlogs,
    getBlogById,
    handleCreateBlog,
    handleUpdateBlog,
    handleDeleteBlog,
    handleAddComment,
    handleDeleteComment,
    handleLikeBlog,
    handleSelectBlog,
    handleToggleCommentModal,
    handleSetCommentModalState,
  };
};