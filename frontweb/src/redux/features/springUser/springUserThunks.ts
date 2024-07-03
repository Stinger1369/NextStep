import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers, fetchUserById } from '../../../services/springService';

export const getSpringUsers = createAsyncThunk('springUsers/fetchUsers', async () => {
  const response = await fetchUsers();
  return response.data;
});

export const getSpringUserById = createAsyncThunk('springUsers/fetchUserById', async (userId: string) => {
  const response = await fetchUserById(userId);
  return response.data;
});
