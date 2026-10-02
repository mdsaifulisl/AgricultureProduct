/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchPartners,
  fetchPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  setSelectedPartnerId,
  clearSinglePartner,
} from './PartnerSlice';

export const usePartner = () => {
  const dispatch = useAppDispatch();

  const {
    partners,
    singlePartner,
    selectedPartnerId,
    isLoading,
    isError,
    errorMessage,
  } = useAppSelector((state) => state.partner);

  const getAllPartners = useCallback(() => {
    return dispatch(fetchPartners()).unwrap();
  }, [dispatch]);

  const getPartnerById = useCallback(
    (id: string) => {
      return dispatch(fetchPartnerById(id)).unwrap();
    },
    [dispatch]
  );

  const handleCreatePartner = useCallback(
    (partnerData: FormData | Record<string, any>) => {
      return dispatch(createPartner(partnerData)).unwrap();
    },
    [dispatch]
  );

  const handleUpdatePartner = useCallback(
    (id: string, partnerData: FormData | Record<string, any>) => {
      return dispatch(updatePartner({ id, partnerData })).unwrap();
    },
    [dispatch]
  );

  const handleDeletePartner = useCallback(
    (id: string) => {
      return dispatch(deletePartner(id)).unwrap();
    },
    [dispatch]
  );

  const handleSelectPartner = useCallback(
    (id: string | null) => {
      dispatch(setSelectedPartnerId(id));
    },
    [dispatch]
  );

  const handleClearSinglePartner = useCallback(() => {
    dispatch(clearSinglePartner());
  }, [dispatch]);

  return {
    partners,
    singlePartner,
    selectedPartnerId,
    isLoading,
    isError,
    errorMessage,

    getAllPartners,
    getPartnerById,
    handleCreatePartner,
    handleUpdatePartner,
    handleDeletePartner,
    handleSelectPartner,
    handleClearSinglePartner,
  };
};


