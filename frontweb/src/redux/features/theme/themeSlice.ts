// src/redux/features/theme/themeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getThemeStatus, changeThemeStatus } from './thunks/themeThunk';

export interface ThemeStatus {
  theme_enabled: boolean;
  theme: string;
  profession: string;
}

interface ThemeState {
  themeStatus: ThemeStatus;
  loading: boolean;
  error: string | null;
}

const initialState: ThemeState = {
  themeStatus: { theme_enabled: true, theme: 'no_theme', profession: '' },
  loading: false,
  error: null
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeStatus>) => {
      state.themeStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getThemeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getThemeStatus.fulfilled, (state, action: PayloadAction<ThemeStatus>) => {
        state.loading = false;
        state.themeStatus = action.payload;
      })
      .addCase(getThemeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Unknown error';
      })
      .addCase(changeThemeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeThemeStatus.fulfilled, (state, action: PayloadAction<ThemeStatus>) => {
        state.loading = false;
        state.themeStatus = action.payload;
      })
      .addCase(changeThemeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Unknown error';
      });
  }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
