import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';
import { AxiosError } from 'axios';
import { ERROR_CODES } from '../../../../utils/errorCodes';

// Interface for the add image response
export interface AddImageResponse {
  images: string[];
}

// Interface for error handling
interface ErrorResponse {
  message: string;
  code: string;
}

// Create an asynchronous action to add an image
export const addImage = createAsyncThunk<
  AddImageResponse,
  { userId: string; imageName: string; imageBase64: string }
>('images/addImage', async ({ userId, imageName, imageBase64 }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/images/user/${userId}/image`, {
      imageName,
      imageBase64
    });

    // Check if the image is NSFW before returning the success response
    if (response.data.code === ERROR_CODES.ErrImageNSFW) {
      console.info('NSFW image detected:', response.data.message);
      return rejectWithValue({
        message: response.data.message,
        code: ERROR_CODES.ErrImageNSFW
      });
    }

    // Return the array of images on success
    return response.data as AddImageResponse;
  } catch (error) {
    if (isAxiosError<ErrorResponse>(error)) {
      if (error.response && error.response.data) {
        // Handle other specific errors
        console.warn('Non-NSFW error encountered:', error.response.data.message);
        return rejectWithValue({
          message: error.response.data.message,
          code: error.response.data.code
        });
      }
    }

    // Return a general error message if the error does not match any specific case
    console.warn('Failed to upload image due to unknown error:', error);
    return rejectWithValue({
      message: 'Failed to upload image',
      code: 'UNKNOWN_ERROR'
    });
  }
});

// Helper function to check if an error is an AxiosError with a specific response type
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>).isAxiosError !== undefined;
}
