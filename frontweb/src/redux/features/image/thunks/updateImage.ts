// frontweb/src/redux/features/image/thunks/updateImage.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';

export const updateImage = createAsyncThunk(
  'images/updateImage',
  async ({
    userId,
    imageName,
    imageBase64
  }: {
    userId: string;
    imageName: string;
    imageBase64: string;
  }) => {
    const response = await axiosInstance.put(`/images/user/${userId}/image/${imageName}`, {
      imageBase64
    });
    if (response.status === 400 && response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.link;
  }
);
