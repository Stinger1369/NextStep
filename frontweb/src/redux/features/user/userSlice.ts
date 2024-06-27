import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosConfig';
import { RootState } from '../../store';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  emailOrPhone: string;
  userType?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: Address;
  age?: number;
  profession?: string;
  company?: string; // Ajout de la propriété company
  companyId?: string; // Ajout de la propriété companyId
  bio?: string;
  experience?: string[];
  education?: string[];
  skills?: string[];
  images?: string[];
  videos?: string[];
  sex?: string;
  showAge?: boolean;
}

interface UserState {
  users: User[];
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  users: [],
  user: null,
  status: 'idle',
  error: null
};

export const getUsers = createAsyncThunk('user/getUsers', async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
});

export const getUserById = createAsyncThunk('user/getUserById', async (id: string) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
});

export const updateUser = createAsyncThunk('user/updateUser', async ({ id, userData }: { id: string; userData: Partial<User> }, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.token;

  try {
    const response = await axiosInstance.put(`/users/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('User updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id: string) => {
  await axiosInstance.delete(`/users/${id}`);
  return id;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(getUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update user';
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete user';
      });
  }
});

export default userSlice.reducer;
