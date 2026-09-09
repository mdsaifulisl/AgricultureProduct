import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  getProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setSelectedProduct,
  clearProductError,
} from './productSlice';
import type { Product } from './productTypes';

export const useProduct = (autoFetch: boolean = false) => {
  const dispatch = useAppDispatch();
  const { products, selectedProduct, isLoading, isError, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (autoFetch && products.length === 0 && !isLoading && !isError) {
      dispatch(getProducts());
    }
  }, [autoFetch, dispatch, products.length, isLoading, isError]);

  // Actions Wrapper Functions WITH .unwrap()
  const fetchAllProducts = () => dispatch(getProducts()).unwrap();

  const createNewProduct = (productData: FormData | Partial<Product>) =>
    dispatch(addProduct(productData)).unwrap();

  const editProduct = (id: string, data: FormData | Partial<Product>) =>
    dispatch(updateProduct({ id, data })).unwrap();

  const deleteProduct = (id: string) => dispatch(removeProduct(id)).unwrap();

  const selectProduct = (product: Product | null) =>
    dispatch(setSelectedProduct(product));

  const clearError = () => dispatch(clearProductError());

  return {
    // State Values
    products,
    selectedProduct,
    isLoading,
    isError,
    error,

    // Action Handlers
    fetchAllProducts,
    createNewProduct,
    editProduct,
    deleteProduct,
    selectProduct,
    clearError,
  };
};