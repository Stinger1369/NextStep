import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';
import { AxiosError } from 'axios';

// Interface for errors when adding videos
interface AddVideosError {
  message: string;
  code: string | null;
}

// Interface for error response data
interface ErrorResponseData {
  message: string;
  code: string | null;
}

// Create an async thunk for adding multiple videos
export const addVideos = createAsyncThunk<
  {
    videoName: string;
    status: string;
    url?: string;
    message?: string;
    code?: string;
  }[], // Return type on success
  { userId: string; videos: { videoName: string; videoBase64: string }[] }, // Arguments
  { rejectValue: AddVideosError } // Rejection value type
>('videos/addVideos', async ({ userId, videos }, { rejectWithValue }) => {
  console.log('Dispatching addVideos with payload:', { userId, videos });
  try {
    const response = await axiosInstance.post(`/videos/user/${userId}/videos`, {
      videos
    });
    console.log('Response from server:', response.data);
    if (response.status === 400 && response.data.error) {
      console.error('Error adding videos:', response.data.error);
      return rejectWithValue({
        message: response.data.message,
        code: response.data.code
      });
    }
    return response.data.results;
  } catch (error) {
    console.error('Error adding videos:', error);
    if (isAxiosError<ErrorResponseData>(error)) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue({
          message: error.response.data.message,
          code: error.response.data.code
        });
      }
    }
    return rejectWithValue({
      message: 'Failed to upload videos',
      code: 'UNKNOWN_ERROR'
    });
  }
});

// Helper function to check if an error is an AxiosError with a specific response data type
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>).isAxiosError !== undefined;
}
