import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addImage, AddImageResponse } from './thunks/addImage';
import { addImages } from './thunks/addImages';
import { deleteImage } from './thunks/deleteImage';
import { updateImage } from './thunks/updateImage';
import { ERROR_CODES } from '../../../utils/errorCodes';
import { userFriendlyMessages } from '../../../utils/errorMessages';

// Interface for image state
interface ImageState {
  images: string[];
  loading: boolean;
  error: { message: string; code: string | null } | null;
  imageErrors: { imageName: string; message: string; code: string | null }[];
}

// Interface for error payload
interface ErrorPayload {
  message: string;
  code: string | null;
}

// Interface for added image data
interface AddImagesPayload {
  imageName: string;
  status: string;
  url?: string;
  message?: string;
  code?: string;
}

// Initial state
const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
  imageErrors: []
};

// Function to extract error code from error message
const extractErrorCode = (message: string): string | null => {
  const match = message.match(/\[([A-Z0-9]+)\]/);
  return match ? match[1] : null;
};

// Create a slice for images
const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    removeNSFWImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((image) => !image.includes(action.payload));
      state.imageErrors = state.imageErrors.filter((error) => error.imageName !== action.payload);
      state.error = null; // Reset error state
    },
    clearErrors: (state) => {
      state.error = null;
      state.imageErrors = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('addImage.pending');
      })
      .addCase(addImage.fulfilled, (state, action: PayloadAction<AddImageResponse>) => {
        state.loading = false;
        state.images = [...new Set([...state.images, ...action.payload.images])]; // Avoid duplicates
        console.log('addImage.fulfilled:', action.payload);
      })
      .addCase(addImage.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = payload.code || extractErrorCode(payload.message);

          // Log NSFW images as info, not error
          if (errorCode === ERROR_CODES.ErrImageNSFW) {
            console.info('Image is inappropriate (NSFW):', payload.message);
            state.imageErrors.push({
              imageName: action.meta.arg.imageName,
              message: 'Image is inappropriate (NSFW)',
              code: errorCode
            });
          } else {
            console.error('Error adding image:', payload.message);
            state.error = {
              message:
                errorCode && userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
                  ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
                  : payload.message,
              code: errorCode
            };
          }
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
        state.images = [...new Set([...state.images, ...successfulImages])];
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
        if (payload) {
          const errorCode = payload.code || extractErrorCode(payload.message);
          state.error = {
            message:
              errorCode && userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
                ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
                : payload.message,
            code: errorCode
          };

          if (errorCode === ERROR_CODES.ErrImageNSFW) {
            console.info('Image is inappropriate (NSFW):', payload.message);
            // Remove NSFW images from the state
            state.images = state.images.filter((image) => !image.includes(payload.message));
            // Add error to imageErrors
            state.imageErrors.push({
              imageName: payload.message,
              message: 'Image is inappropriate (NSFW)',
              code: errorCode
            });
          } else if (errorCode === ERROR_CODES.ErrMaxImagesReached) {
            console.error('Maximum number of images reached:', payload.message);
            state.imageErrors.push({
              imageName: 'multiple',
              message: 'Maximum number of images reached',
              code: errorCode
            });
          }
        } else {
          state.error = {
            message: 'Failed to add images',
            code: 'UNKNOWN_ERROR'
          };
        }
        // Reset general error after handling specific errors
        state.error = null;
      })
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('deleteImage.pending');
      })
      .addCase(deleteImage.fulfilled, (state, action: PayloadAction<{ imageName: string }>) => {
        state.loading = false;
        state.images = state.images.filter((image) => !image.includes(action.payload.imageName));
        console.log('deleteImage.fulfilled:', action.payload);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        console.error('deleteImage rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload) {
          const errorCode = payload.code || extractErrorCode(payload.message);
          state.error = {
            message:
              errorCode && userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
                ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
                : payload.message,
            code: errorCode
          };

          if (errorCode === ERROR_CODES.ErrImageNSFW) {
            console.info('Image is inappropriate (NSFW):', payload.message);
            state.images = state.images.filter(
              (image) => !image.includes(action.meta.arg.imageName)
            );
          } else if (errorCode === ERROR_CODES.ErrMaxImagesReached) {
            console.error('Maximum number of images reached:', payload.message);
          }
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
        if (payload) {
          const errorCode = payload.code || extractErrorCode(payload.message);
          state.error = {
            message:
              errorCode && userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
                ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
                : payload.message,
            code: errorCode
          };

          if (errorCode === ERROR_CODES.ErrImageNSFW) {
            console.info('Image is inappropriate (NSFW):', payload.message);
          } else if (errorCode === ERROR_CODES.ErrMaxImagesReached) {
            console.error('Maximum number of images reached:', payload.message);
          }
        } else {
          state.error = {
            message: 'Failed to update image',
            code: 'UNKNOWN_ERROR'
          };
        }
      });
  }
});

export const { removeNSFWImage, clearErrors } = imageSlice.actions; // Export de l'action removeNSFWImage
export { addImage, addImages, deleteImage, updateImage };
export default imageSlice.reducer;
