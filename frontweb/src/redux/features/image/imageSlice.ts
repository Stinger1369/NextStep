import { createSlice } from "@reduxjs/toolkit";
import { addImage } from "./thunks/addImage";
import { addImages } from "./thunks/addImages";
import { deleteImage } from "./thunks/deleteImage";
import { updateImage } from "./thunks/updateImage";

interface ImageState {
  images: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = [...new Set([...state.images, action.payload])]; // Éviter les duplicatas
      })
      .addCase(addImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add image";
      })
      .addCase(addImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = [...new Set([...state.images, ...action.payload])]; // Éviter les duplicatas
      })
      .addCase(addImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add images";
      })
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter(
          (image) => !image.includes(action.payload.imageName)
        );
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete image";
      })
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.images.findIndex((image) =>
          image.includes(action.payload.oldImage)
        );
        if (index !== -1) {
          state.images[index] = action.payload.newImage;
        }
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update image";
      });
  },
});

export { addImage, addImages, deleteImage, updateImage };
export default imageSlice.reducer;
