// frontweb/src/redux/features/image/thunks/deleteImage.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';

export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async ({ userId, imageName }: { userId: string; imageName: string }) => {
    await axiosInstance.delete(`/images/user/${userId}/image/${imageName}`);
    return { imageName };
  }
);
