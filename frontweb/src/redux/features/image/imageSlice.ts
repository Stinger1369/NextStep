import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addImage } from './thunks/addImage';
import { addImages } from './thunks/addImages';
import { deleteImage } from './thunks/deleteImage';
import { updateImage } from './thunks/updateImage';
import { ERROR_CODES } from '../../../utils/errorCodes';
import { userFriendlyMessages } from '../../../utils/errorMessages';

interface ImageState {
  images: string[];
  loading: boolean;
  error: { message: string; code: string | null } | null;
  imageErrors: { imageName: string; message: string; code: string | null }[];
}

interface ErrorPayload {
  message: string;
  code: string | null;
}

interface AddImagesPayload {
  imageName: string;
  status: string;
  url?: string;
  message?: string;
  code?: string;
}

const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
  imageErrors: []
};

// Fonction pour extraire le code d'erreur du message d'erreur
const extractErrorCode = (message: string): string | null => {
  const match = message.match(/\[([A-Z0-9]+)\]/);
  return match ? match[1] : null;
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('addImage.pending');
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = [...new Set([...state.images, action.payload])]; // Éviter les duplicatas
        console.log('addImage.fulfilled:', action.payload);
      })
      .addCase(addImage.rejected, (state, action) => {
        state.loading = false;
        console.error('addImage rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = extractErrorCode(payload.message);
          state.error = {
            message: errorCode
              ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
              : payload.message.split(':')[0],
            code: errorCode
          };
        } else {
          state.error = {
            message: 'Failed to add image',
            code: 'UNKNOWN_ERROR'
          };
        }
      })
      .addCase(addImages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.imageErrors = [];
        console.log('addImages.pending');
      })
      .addCase(addImages.fulfilled, (state, action: PayloadAction<AddImagesPayload[]>) => {
        state.loading = false;
        const successfulImages = action.payload
          .filter((img) => img.status === 'success' && img.url !== undefined)
          .map((img) => img.url as string);
        state.images = [...new Set([...state.images, ...successfulImages])]; // Éviter les duplicatas
        console.log('addImages.fulfilled:', action.payload);
        const failedImages = action.payload.filter((img) => img.status === 'failed');
        state.imageErrors = failedImages.map((img) => ({
          imageName: img.imageName,
          message: img.message || 'Failed to add image',
          code: img.code || 'UNKNOWN_ERROR'
        }));
      })
      .addCase(addImages.rejected, (state, action) => {
        state.loading = false;
        console.error('addImages rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = extractErrorCode(payload.message);
          state.error = {
            message: errorCode
              ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
              : payload.message.split(':')[0],
            code: errorCode
          };
        } else {
          state.error = {
            message: 'Failed to add images',
            code: 'UNKNOWN_ERROR'
          };
        }
      })
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('deleteImage.pending');
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter((image) => !image.includes(action.payload.imageName));
        console.log('deleteImage.fulfilled:', action.payload);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        console.error('deleteImage rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = extractErrorCode(payload.message);
          state.error = {
            message: errorCode
              ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
              : payload.message.split(':')[0],
            code: errorCode
          };
        } else {
          state.error = {
            message: 'Failed to delete image',
            code: 'UNKNOWN_ERROR'
          };
        }
      })
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('updateImage.pending');
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.images.findIndex((image) => image.includes(action.payload.oldImage));
        if (index !== -1) {
          state.images[index] = action.payload.newImage;
        }
        console.log('updateImage.fulfilled:', action.payload);
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        console.error('updateImage rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = extractErrorCode(payload.message);
          state.error = {
            message: errorCode
              ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
              : payload.message.split(':')[0],
            code: errorCode
          };
        } else {
          state.error = {
            message: 'Failed to update image',
            code: 'UNKNOWN_ERROR'
          };
        }
      });
  }
});

export { addImage, addImages, deleteImage, updateImage };
export default imageSlice.reducer;
