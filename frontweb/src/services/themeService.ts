// src/services/themeService.ts
import axiosFlaskInstance from './axiosFlaskConfig';

export const fetchThemeStatus = (userId: string, profession: string) => {
  return axiosFlaskInstance.post('/theme_status', { userId, profession });
};

export const toggleTheme = (userId: string, profession: string) => {
  return axiosFlaskInstance.post('/toggle_theme', { userId, profession });
};
