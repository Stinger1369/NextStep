import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';
import { AxiosError } from 'axios';

interface AddImagesError {
  message: string;
  code: string | null;
}

interface ErrorResponseData {
  message: string;
  code: string | null;
}

export const addImages = createAsyncThunk<
  {
    imageName: string;
    status: string;
    url?: string;
    message?: string;
    code?: string;
  }[], // Le type de retour en cas de succès
  { userId: string; images: { imageName: string; imageBase64: string }[] }, // Les arguments
  { rejectValue: AddImagesError } // Le type de valeur de rejet
>('images/addImages', async ({ userId, images }, { rejectWithValue }) => {
  console.log('Dispatching addImages with payload:', { userId, images });
  try {
    const response = await axiosInstance.post(`/images/user/${userId}/images`, {
      images
    });
    console.log('Response from server:', response.data);
    if (response.status === 400 && response.data.error) {
      console.error('Error adding images:', response.data.error);
      return rejectWithValue({
        message: response.data.message,
        code: response.data.code
      });
    }
    return response.data.results;
  } catch (error) {
    console.error('Error adding images:', error);
    if (isAxiosError<ErrorResponseData>(error)) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue({
          message: error.response.data.message,
          code: error.response.data.code
        });
      }
    }
    return rejectWithValue({
      message: 'Failed to upload images',
      code: 'UNKNOWN_ERROR'
    });
  }
});

// Helper function to check if an error is an AxiosError with a specific response data type
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>).isAxiosError !== undefined;
}
