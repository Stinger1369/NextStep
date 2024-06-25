// src/redux/features/auth/authLogout.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

export const performLogout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    dispatch(logout());
  }
);
