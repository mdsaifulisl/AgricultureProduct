import { useEffect, useCallback, useRef } from 'react';
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

  // Redux State Selectors
  const products = useAppSelector((state) => state.product.products);
  const selectedProduct = useAppSelector((state) => state.product.selectedProduct);
  const isLoading = useAppSelector((state) => state.product.isLoading);
  const isError = useAppSelector((state) => state.product.isError);
  const error = useAppSelector((state) => state.product.error);

  // একবার Fetch হয়ে গেলে আর auto-fetch করবে না
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // 1. autoFetch true হতে হবে
    // 2. আগে কখনো fetch না হতে হবে (hasFetchedRef.current === false)
    // 3. Redux-এ ডাটা খালি থাকতে হবে
    // 4. বর্তমানে Loading বা Error অবস্থায় না থাকতে হবে
    if (
      autoFetch &&
      !hasFetchedRef.current &&
      products.length === 0 &&
      !isLoading &&
      !isError
    ) {
      hasFetchedRef.current = true; // একই সময়ে duplicate request আটকান
      dispatch(getProducts())
        .unwrap()
        .catch(() => {
          // অনুরোধ ব্যর্থ হলে retry action-কে আবার চালানোর সুযোগ দিন।
          hasFetchedRef.current = false;
        });
    }
  }, [autoFetch, dispatch, products.length, isLoading, isError]);

  // Action Handlers
  const fetchAllProducts = useCallback(() => {
    return dispatch(getProducts()).unwrap();
  }, [dispatch]);

  const createNewProduct = useCallback(
    (productData: FormData | Partial<Product>) => {
      return dispatch(addProduct(productData)).unwrap();
    },
    [dispatch]
  );

  const editProduct = useCallback(
    (id: string, data: FormData | Partial<Product>) => {
      return dispatch(updateProduct({ id, data })).unwrap();
    },
    [dispatch]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      return dispatch(removeProduct(id)).unwrap();
    },
    [dispatch]
  );

  const selectProduct = useCallback(
    (product: Product | null) => {
      dispatch(setSelectedProduct(product));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearProductError());
  }, [dispatch]);

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
