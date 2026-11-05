import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  changePassword,
  clearAuthError,
  fetchMe,
  loginUser,
  logoutUser,
  resetPasswordWithOtp,
  sendForgotPasswordOtp,
  verifyOtpCode,
} from './authSlice';
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from './authTypes';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, isError, error } =
    useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    (payload: LoginPayload) => dispatch(loginUser(payload)).unwrap(),
    [dispatch]
  );

  const getProfile = useCallback(
    () => dispatch(fetchMe()).unwrap(),
    [dispatch]
  );

  const handleForgotPassword = useCallback(
    (payload: ForgotPasswordPayload) =>
      dispatch(sendForgotPasswordOtp(payload)).unwrap(),
    [dispatch]
  );

  const handleVerifyOtp = useCallback(
    (payload: VerifyOtpPayload) => dispatch(verifyOtpCode(payload)).unwrap(),
    [dispatch]
  );

  const handleResetPassword = useCallback(
    (payload: ResetPasswordPayload) =>
      dispatch(resetPasswordWithOtp(payload)).unwrap(),
    [dispatch]
  );

  const handleChangePassword = useCallback(
    (payload: ChangePasswordPayload) =>
      dispatch(changePassword(payload)).unwrap(),
    [dispatch]
  );

  const handleLogout = useCallback(
    () => dispatch(logoutUser()).unwrap(),
    [dispatch]
  );

  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  return useMemo(
    () => ({
      // State Values
      user,
      token,
      isAuthenticated,
      isLoading,
      isError,
      error,

      // Action Handlers
      handleLogin,
      getProfile,
      handleForgotPassword,
      handleVerifyOtp,
      handleResetPassword,
      handleChangePassword,
      handleLogout,
      clearError,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      isError,
      error,
      handleLogin,
      getProfile,
      handleForgotPassword,
      handleVerifyOtp,
      handleResetPassword,
      handleChangePassword,
      handleLogout,
      clearError,
    ]
  );
};