import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addUser,
  clearUserError,
  getUsers,
  removeUser,
  setSelectedUser,
  updateUser,
} from './userSlice';
import type {
  CreateUserPayload,
  GetUsersQueryParams,
  UpdateUserPayload,
  User,
} from './userTypes';

export const useUser = (
  autoFetch: boolean = false,
  params?: GetUsersQueryParams
) => {
  const dispatch = useAppDispatch();
  const { users, selectedUser, isLoading, isError, error } = useAppSelector(
    (state) => state.user
  );

  // Object reference stabilization using JSON stringify or Ref
  const serializedParams = JSON.stringify(params);
  const isFetchedRef = useRef(false);

  useEffect(() => {
    if (autoFetch && !isFetchedRef.current && !isLoading && !isError) {
      isFetchedRef.current = true;
      dispatch(getUsers(params));
    }
  }, [autoFetch, dispatch, isLoading, isError, serializedParams]);

  // Actions Wrapper Functions WITH useCallback & .unwrap()
  const fetchAllUsers = useCallback(
    (queryParams?: GetUsersQueryParams) =>
      dispatch(getUsers(queryParams)).unwrap(),
    [dispatch]
  );

  const createNewUser = useCallback(
    (userData: CreateUserPayload) =>
      dispatch(addUser(userData)).unwrap(),
    [dispatch]
  );

  const editUser = useCallback(
    (id: string, data: UpdateUserPayload) =>
      dispatch(updateUser({ id, data })).unwrap(),
    [dispatch]
  );

  const deleteUser = useCallback(
    (id: string) => dispatch(removeUser(id)).unwrap(),
    [dispatch]
  );

  const selectUser = useCallback(
    (user: User | null) => dispatch(setSelectedUser(user)),
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearUserError()),
    [dispatch]
  );

  return {
    // State Values
    users,
    selectedUser,
    isLoading,
    isError,
    error,

    // Action Handlers
    fetchAllUsers,
    createNewUser,
    editUser,
    deleteUser,
    selectUser,
    clearError,
  };
};