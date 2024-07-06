import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosConfig';
import { RootState } from '../../store';
import { AxiosError } from 'axios';
import { ApiError } from '../../../../src/types';
import { updateUser } from '../user/userSlice';
import { webSocketService } from '../../../websocket/websocket';

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
  emailOrPhone: string;
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
  apiKey: string | null; // Ajout de l'API key
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  apiKey: localStorage.getItem('apiKey'), // Initialisation de l'API key
  status: 'idle',
  error: null
};

// Thunk pour générer l'API key via WebSocket
export const fetchApiKey = createAsyncThunk('auth/fetchApiKey', async (owner: string, { rejectWithValue }) => {
  return new Promise<string>((resolve, reject) => {
    webSocketService.connect('ws://localhost:8080/ws', (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'generateApiKey') {
        if (data.success) {
          resolve(data.apiKey);
        } else {
          reject(data.error);
        }
      }
    });

    webSocketService.send(JSON.stringify({ action: 'generateApiKey', data: { owner } }));
  }).catch((error: ApiError) => {
    return rejectWithValue(error);
  });
});

export const login = createAsyncThunk(
  'auth/login',
  async (
    {
      emailOrPhone,
      password
    }: {
      emailOrPhone: string;
      password: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        emailOrPhone,
        password
      });

      // Générer l'API key après la connexion réussie
      const { user } = response.data;
      dispatch(fetchApiKey(user._id));

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

export const requestPasswordReset = createAsyncThunk('auth/requestPasswordReset', async (emailOrPhone: string) => {
  await axiosInstance.post('/auth/request-password-reset', { emailOrPhone });
});

export const resendVerificationCode = createAsyncThunk('auth/resendVerificationCode', async (emailOrPhone: string) => {
  await axiosInstance.post('/auth/resend-verification-code', {
    emailOrPhone
  });
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ emailOrPhone, code, newPassword }: { emailOrPhone: string; code: string; newPassword: string }) => {
  await axiosInstance.post('/auth/reset-password', {
    emailOrPhone,
    code,
    newPassword
  });
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async ({ emailOrPhone, code }: { emailOrPhone: string; code: string }) => {
  await axiosInstance.post('/auth/verify-email', { emailOrPhone, code });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.apiKey = null; // Réinitialisation de l'API key
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('apiKey'); // Suppression de l'API key
    },
    initializeAuthState: (state) => {
      state.user = JSON.parse(localStorage.getItem('user') || 'null');
      state.token = localStorage.getItem('token');
      state.refreshToken = localStorage.getItem('refreshToken');
      state.apiKey = localStorage.getItem('apiKey'); // Initialisation de l'API key
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
      .addCase(fetchApiKey.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApiKey.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.apiKey = action.payload;
        localStorage.setItem('apiKey', action.payload);
      })
      .addCase(fetchApiKey.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? (action.payload as ApiError).message : 'Failed to fetch API key';
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
