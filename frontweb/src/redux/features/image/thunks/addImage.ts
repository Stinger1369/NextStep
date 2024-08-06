// src/redux/thunks/addImage.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../axiosConfig';
import { AxiosError } from 'axios';

// Interface pour les erreurs lors de l'ajout d'images
interface AddImageError {
  message: string;
  code: string | null;
}

// Interface pour les données de réponse d'erreur
interface ErrorResponseData {
  message: string;
  code: string | null;
}

// Créer une action asynchrone pour ajouter une image
export const addImage = createAsyncThunk<
  string, // Le type de retour en cas de succès
  { userId: string; imageName: string; imageBase64: string }, // Les arguments
  { rejectValue: AddImageError } // Le type de valeur de rejet
>('images/addImage', async ({ userId, imageName, imageBase64 }, { rejectWithValue }) => {
  console.log('Dispatching addImage with payload:', { userId, imageName });
  try {
    const response = await axiosInstance.post(`/images/user/${userId}/image`, {
      imageName,
      imageBase64
    });
    console.log('Response from server:', response.data);
    if (response.status === 400 && response.data.error) {
      console.error('Error adding image:', response.data.error);
      return rejectWithValue({
        message: response.data.message,
        code: response.data.code
      });
    }
    return response.data.images[response.data.images.length - 1]; // Retourner l'URL de la dernière image ajoutée
  } catch (error) {
    console.error('Error adding image:', error);
    if (isAxiosError<ErrorResponseData>(error)) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue({
          message: error.response.data.message,
          code: error.response.data.code
        });
      }
    }
    return rejectWithValue({
      message: 'Failed to upload image',
      code: 'UNKNOWN_ERROR'
    });
  }
});

// Fonction d'aide pour vérifier si une erreur est un AxiosError avec un type de données de réponse spécifique
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>).isAxiosError !== undefined;
}
