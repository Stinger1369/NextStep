// frontweb/src/redux/features/image/thunks/addImages.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosConfig";

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
