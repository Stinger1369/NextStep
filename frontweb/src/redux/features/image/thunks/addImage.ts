// frontweb/src/redux/features/image/thunks/addImage.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosConfig";

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
