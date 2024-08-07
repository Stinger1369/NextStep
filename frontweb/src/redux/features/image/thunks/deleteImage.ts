import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';
import { AxiosError } from 'axios';

// Interface for the delete image response
interface DeleteImageResponse {
  imageName: string;
}

// Interface for error handling
interface ErrorResponse {
  message: string;
  code?: string;
}

// Define the type of the error response data
interface AxiosErrorResponseData {
  message: string;
  code?: string;
}

export const deleteImage = createAsyncThunk<
  DeleteImageResponse, // Success return type
  { userId: string; imageName: string }, // Arguments
  { rejectValue: ErrorResponse } // Rejection value type
>('images/deleteImage', async ({ userId, imageName }, { rejectWithValue }) => {
  try {
    // Make the DELETE request to remove the image
    await axiosInstance.delete(`/images/user/${userId}/image/${imageName}`);
    return { imageName }; // Return imageName on success
  } catch (error) {
   if (isAxiosError<AxiosErrorResponseData>(error)) {
     const errorMessage = error.response?.data?.message || 'Failed to delete image';
     const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR';
     return rejectWithValue({ message: errorMessage, code: errorCode });
   }
    return rejectWithValue({ message: 'Failed to delete image', code: 'UNKNOWN_ERROR' });
  }
});

// Helper function to check if an error is an AxiosError
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>).isAxiosError !== undefined;
}
