// addVideo.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';
import { AxiosError } from 'axios';

// Interface pour les erreurs lors de l'ajout d'une vidéo
interface AddVideoError {
  message: string;
  code: string | null;
}

// Interface pour les données de réponse d'erreur
interface ErrorResponseData {
  message: string;
  code: string | null;
}

// Créer une action asynchrone pour ajouter une vidéo
export const addVideo = createAsyncThunk<
  string, // Le type de retour en cas de succès
  { userId: string; videoName: string; videoBase64: string }, // Les arguments
  { rejectValue: AddVideoError } // Le type de valeur de rejet
>('videos/addVideo', async ({ userId, videoName, videoBase64 }, { rejectWithValue }) => {
  console.log('Dispatching addVideo with payload:', { userId, videoName });
  try {
    const response = await axiosInstance.post(`/videos/user/${userId}/video`, {
      videoName,
      videoBase64
    });
    console.log('Response from server:', response.data);
    if (response.status === 400 && response.data.error) {
      console.error('Error adding video:', response.data.error);
      return rejectWithValue({
        message: response.data.message,
        code: response.data.code
      });
    }
    return response.data.videos[response.data.videos.length - 1]; // Retourner l'URL de la dernière vidéo ajoutée
  } catch (error) {
    console.error('Error adding video:', error);
    if (isAxiosError<ErrorResponseData>(error)) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue({
          message: error.response.data.message,
          code: error.response.data.code
        });
      }
    }
    return rejectWithValue({
      message: 'Failed to upload video',
      code: 'UNKNOWN_ERROR'
    });
  }
});

// Fonction d'aide pour vérifier si une erreur est un AxiosError avec un type de données de réponse spécifique
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>).isAxiosError !== undefined;
}
