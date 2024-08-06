// updateVideo.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';

// Créer une action asynchrone pour mettre à jour une vidéo
export const updateVideo = createAsyncThunk<
  { oldVideo: string; newVideo: string }, // Le type de retour en cas de succès
  { userId: string; videoName: string; videoBase64: string } // Les arguments
>('videos/updateVideo', async ({ userId, videoName, videoBase64 }) => {
  const response = await axiosInstance.put(
    `/videos/user/${userId}/video/${encodeURIComponent(videoName)}`,
    {
      videoBase64
    }
  );
  if (response.status === 400 && response.data.error) {
    throw new Error(response.data.error);
  }
  return { oldVideo: videoName, newVideo: response.data.link };
});
