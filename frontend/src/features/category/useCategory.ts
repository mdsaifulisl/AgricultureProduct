import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks'; // আপনার থাঙ্ক হুক প্যাথ অনুযায়ী এডজাস্ট করুন
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  clearSelectedCategory,
  clearCategoryError,
} from './categorySlice';
import type { CreateCategoryPayload, UpdateCategoryPayload } from './categoryTypes';

export const useCategory = () => {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory, loading, error } = useAppSelector(
    (state) => state.category
  );

  const getCategories = useCallback(() => {
    return dispatch(fetchCategories());
  }, [dispatch]);

  const getCategoryById = useCallback(
    (id: string) => {
      return dispatch(fetchCategoryById(id));
    },
    [dispatch]
  );

  const addCategory = useCallback(
    (payload: CreateCategoryPayload | FormData) => {
      return dispatch(createCategory(payload));
    },
    [dispatch]
  );

  const editCategory = useCallback(
    (id: string, data: UpdateCategoryPayload | FormData) => {
      return dispatch(updateCategory({ id, data }));
    },
    [dispatch]
  );

  const removeCategory = useCallback(
    (id: string) => {
      return dispatch(deleteCategory(id));
    },
    [dispatch]
  );

  const resetSelectedCategory = useCallback(() => {
    dispatch(clearSelectedCategory());
  }, [dispatch]);

  const resetCategoryError = useCallback(() => {
    dispatch(clearCategoryError());
  }, [dispatch]);

  return {
    categories,
    selectedCategory,
    loading,
    error,
    getCategories,
    getCategoryById,
    addCategory,
    editCategory,
    removeCategory,
    resetSelectedCategory,
    resetCategoryError,
  };
};