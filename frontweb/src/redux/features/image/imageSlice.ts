import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosConfig";

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

// Thunks for async actions
export const addImage = createAsyncThunk(
  "images/addImage",
  async ({
    userId,
    imageName,
    imageBase64,
  }: {
    userId: string;
    imageName: string;
    imageBase64: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        `/images/user/${userId}/image`,
        {
          imageName,
          imageBase64,
        }
      );
      if (response.status === 400 && response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data.images[response.data.images.length - 1]; // return the last added image URL
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to upload image");
      }
    }
  }
);

export const addImages = createAsyncThunk(
  "images/addImages",
  async ({
    userId,
    images,
  }: {
    userId: string;
    images: { imageName: string; imageBase64: string }[];
  }) => {
    try {
      const response = await axiosInstance.post(
        `/images/user/${userId}/images`,
        { images }
      );
      if (response.status === 400 && response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data.images; // return all added image URLs
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to upload images");
      }
    }
  }
);

export const deleteImage = createAsyncThunk(
  "images/deleteImage",
  async ({ userId, imageName }: { userId: string; imageName: string }) => {
    const response = await axiosInstance.delete(
      `/images/user/${userId}/image/${imageName}`
    );
    return { imageName };
  }
);

export const updateImage = createAsyncThunk(
  "images/updateImage",
  async ({
    userId,
    imageName,
    imageBase64,
  }: {
    userId: string;
    imageName: string;
    imageBase64: string;
  }) => {
    const response = await axiosInstance.put(
      `/images/user/${userId}/image/${imageName}`,
      { imageBase64 }
    );
    if (response.status === 400 && response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.link;
  }
);

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
        state.images.push(action.payload);
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
        state.images = action.payload;
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

export default imageSlice.reducer;
