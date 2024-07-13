// src/redux/features/auth/authLogin.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosConfig';
import { ApiError } from '../../../../src/types';
import { AxiosError } from 'axios';

export const login = createAsyncThunk(
  'auth/login',
  async (
    {
      email,
      password
    }: {
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          return rejectWithValue(error.response.data as ApiError);
        }
      }
      throw error;
    }
  }
);

// Helper function to check if an error is an AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}
