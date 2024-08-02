// src/redux/features/activity/thunk/createActivity.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IActivity } from '../../../../types';

export const createActivity = createAsyncThunk(
  'activities/createActivity',
  async (activity: IActivity, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/activities', activity);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);
