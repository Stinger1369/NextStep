// src/features/job/jobSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  company: string;
  location: string;
  salary: number;
}

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null
};

// Thunks for asynchronous actions
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const response = await axios.get('/api/jobs');
  return response.data;
});

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (id: string) => {
  const response = await axios.get(`/api/jobs/${id}`);
  return response.data;
});

export const createJob = createAsyncThunk('jobs/createJob', async (jobData: Partial<Job>) => {
  const response = await axios.post('/api/jobs', jobData);
  return response.data;
});

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, jobData }: { id: string; jobData: Partial<Job> }) => {
  const response = await axios.put(`/api/jobs/${id}`, jobData);
  return response.data;
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id: string) => {
  await axios.delete(`/api/jobs/${id}`);
  return id;
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index >= 0) {
          state.jobs[index] = action.payload;
        } else {
          state.jobs.push(action.payload);
        }
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index >= 0) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      });
  }
});

export default jobSlice.reducer;
