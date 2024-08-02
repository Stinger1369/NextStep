// src/redux/features/theme/thunks/themeThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchThemeStatus, toggleTheme } from '../../../../services/themeService';
import { AxiosError } from 'axios';

// Gestionnaire d'erreur pour les actions asynchrones
const handleAsyncError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    return error.response.data.message || 'An error occurred';
  } else {
    return 'An unknown error occurred';
  }
};

// Action asynchrone pour récupérer le statut du thème
export const getThemeStatus = createAsyncThunk(
  'theme/getThemeStatus',
  async ({ userId, profession }: { userId: string; profession: string }, thunkAPI) => {
    try {
      const response = await fetchThemeStatus(userId, profession);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAsyncError(error));
    }
  }
);

// Action asynchrone pour basculer le thème
export const changeThemeStatus = createAsyncThunk(
  'theme/changeThemeStatus',
  async ({ userId, profession }: { userId: string; profession: string }, thunkAPI) => {
    try {
      const response = await toggleTheme(userId, profession);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAsyncError(error));
    }
  }
);
