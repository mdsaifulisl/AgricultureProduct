/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  clearIpLogError,
  fetchAllIps,
  toggleBlockIp,
} from './ipLogSlice';
import type { ToggleBlockIpPayload } from './ipLogTypes';

export const useIpLog = () => {
  const dispatch = useAppDispatch();
  const { ipLogs, isLoading, isUpdating, isError, error } = useAppSelector(
    (state) => (state as any).ipLog
  );

  const getAllIps = useCallback(async () => {
    const resultAction = await dispatch(fetchAllIps());
    if (fetchAllIps.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error(resultAction.payload || 'Failed to fetch IP logs');
    }
  }, [dispatch]);

  const handleToggleBlockIp = useCallback(
    async (payload: ToggleBlockIpPayload) => {
      const resultAction = await dispatch(toggleBlockIp(payload));
      if (toggleBlockIp.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error(
          (resultAction.payload as string) || 'Failed to update IP block status'
        );
      }
    },
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearIpLogError()),
    [dispatch]
  );

  return useMemo(
    () => ({
      // State Values
      ipLogs,
      isLoading,
      isUpdating,
      isError,
      error,

      // Action Handlers
      getAllIps,
      handleToggleBlockIp,
      clearError,
    }),
    [
      ipLogs,
      isLoading,
      isUpdating,
      isError,
      error,
      getAllIps,
      handleToggleBlockIp,
      clearError,
    ]
  );
};