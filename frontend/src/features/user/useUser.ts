import { useEffect } from 'react';
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

  useEffect(() => {
    if (autoFetch && users.length === 0 && !isLoading && !isError) {
      dispatch(getUsers(params));
    }
  }, [autoFetch, dispatch, users.length, isLoading, isError, params]);

  // Actions Wrapper Functions WITH .unwrap()
  const fetchAllUsers = (queryParams?: GetUsersQueryParams) =>
    dispatch(getUsers(queryParams)).unwrap();

  const createNewUser = (userData: CreateUserPayload) =>
    dispatch(addUser(userData)).unwrap();

  const editUser = (id: string, data: UpdateUserPayload) =>
    dispatch(updateUser({ id, data })).unwrap();

  const deleteUser = (id: string) => dispatch(removeUser(id)).unwrap();

  const selectUser = (user: User | null) =>
    dispatch(setSelectedUser(user));

  const clearError = () => dispatch(clearUserError());

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


