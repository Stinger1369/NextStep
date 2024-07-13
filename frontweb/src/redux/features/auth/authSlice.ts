// src/redux/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosConfig';
import { RootState } from '../../store';
import { AxiosError } from 'axios';
import { ApiError } from '../../../../src/types';
import { updateUser } from '../user/userSlice';
// Définir les types et interfaces nécessaires
interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface socialMediaLinks {
  github?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  discord?: string;
}

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  userType: 'employer' | 'recruiter' | 'jobSeeker';
  phone?: string;
  dateOfBirth?: Date;
  age?: number;
  showAge?: boolean;
  address?: Address;
  profession?: string;
  bio?: string;
  experience?: string[];
  education?: string[];
  skills?: string[];
  images?: string[];
  videos?: string[];
  hobbies?: string[]; // Ajouté pour les hobbies
  sex?: string;
  isVerified: boolean;
  company?: string; // Pour les utilisateurs travaillant dans une seule entreprise
  companyId?: string; // Pour les utilisateurs travaillant dans une seule entreprise
  companies?: string[]; // Pour les utilisateurs gérant plusieurs entreprises
  socialMediaLinks?: socialMediaLinks; // Liens de réseaux sociaux
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  status: 'idle',
  error: null
};

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

export const register = createAsyncThunk('auth/register', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/register', formData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        return rejectWithValue(error.response.data as ApiError);
      }
    }
    throw error;
  }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { getState }) => {
  const state = getState() as RootState;
  const refreshToken = state.auth.refreshToken;
  if (refreshToken) {
    const response = await axiosInstance.post('/auth/refresh-token', {
      refreshToken
    });
    return response.data;
  }
  throw new Error('No refresh token available');
});

export const requestPasswordReset = createAsyncThunk('auth/requestPasswordReset', async (email: string) => {
  await axiosInstance.post('/auth/request-password-reset', { email });
});

export const resendVerificationCode = createAsyncThunk('auth/resendVerificationCode', async (email: string) => {
  await axiosInstance.post('/auth/resend-verification-code', {
    email
  });
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ email, code, newPassword }: { email: string; code: string; newPassword: string }) => {
  await axiosInstance.post('/auth/reset-password', {
    email,
    code,
    newPassword
  });
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async ({ email, code }: { email: string; code: string }) => {
  await axiosInstance.post('/auth/verify-email', { email, code });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.clear();
    },
    initializeAuthState: (state) => {
      state.user = JSON.parse(localStorage.getItem('user') || 'null');
      state.token = localStorage.getItem('token');
      state.refreshToken = localStorage.getItem('refreshToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            token: string;
            refreshToken: string;
          }>
        ) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? (action.payload as ApiError).message : 'Failed to login';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? (action.payload as ApiError).message : 'Failed to register';
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? (action.payload as ApiError).message : 'Failed to refresh token';
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? (action.payload as ApiError).message : 'Failed to request password reset';
      })
      .addCase(resendVerificationCode.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resendVerificationCode.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? (action.payload as ApiError).message : 'Failed to resend verification code';
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? (action.payload as ApiError).message : 'Failed to reset password';
      })
      .addCase(verifyEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? (action.payload as ApiError).message : 'Failed to verify email';
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        if (state.user && state.user._id === action.payload._id) {
          state.user = action.payload;
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      });
  }
});

export const { logout, initializeAuthState } = authSlice.actions;

export default authSlice.reducer;

// Helper function to check if an error is an AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}
