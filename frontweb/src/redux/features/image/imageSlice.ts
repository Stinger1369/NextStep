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

export const addImage = createAsyncThunk(
  "images/addImage",
  async (
    {
      userId,
      imageName,
      imageBase64,
    }: {
      userId: string;
      imageName: string;
      imageBase64: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/images/user/${userId}/image`,
        {
          imageName,
          imageBase64,
        }
      );
      if (response.status === 400 && response.data.message) {
        return rejectWithValue(response.data.message);
      }
      return response.data.link;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("Failed to upload image");
      }
    }
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
        state.error = action.payload as string;
      });
  },
});

export default imageSlice.reducer;
