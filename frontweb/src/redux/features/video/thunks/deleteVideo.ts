// deleteVideo.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';

// Créer une action asynchrone pour supprimer une vidéo
export const deleteVideo = createAsyncThunk<
  { videoName: string }, // Le type de retour en cas de succès
  { userId: string; videoName: string } // Les arguments
>('videos/deleteVideo', async ({ userId, videoName }) => {
  await axiosInstance.delete(`/videos/user/${userId}/video/${encodeURIComponent(videoName)}`);
  return { videoName };
});
