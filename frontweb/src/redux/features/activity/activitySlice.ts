import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../../axiosConfig';
import { IActivity } from '../../../types';

interface ActivityState {
  activities: IActivity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null
};

export const fetchActivities = createAsyncThunk('activities/fetchActivities', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IActivity[]>('/activities');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('An unexpected error occurred');
    }
  }
});

export const createActivity = createAsyncThunk('activities/createActivity', async (activity: IActivity, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<IActivity>('/activities', activity);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('An unexpected error occurred');
    }
  }
});

export const updateActivity = createAsyncThunk('activities/updateActivity', async ({ id, activity }: { id: string; activity: Partial<IActivity> }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<IActivity>(`/activities/${id}`, activity);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('An unexpected error occurred');
    }
  }
});

export const deleteActivity = createAsyncThunk('activities/deleteActivity', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/activities/${id}`);
    return id;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('An unexpected error occurred');
    }
  }
});

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<IActivity[]>) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action: PayloadAction<IActivity>) => {
        state.loading = false;
        state.activities.push(action.payload);
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action: PayloadAction<IActivity>) => {
        state.loading = false;
        const index = state.activities.findIndex((activity) => activity._id === action.payload._id);
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.activities = state.activities.filter((activity) => activity._id !== action.payload);
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default activitySlice.reducer;
