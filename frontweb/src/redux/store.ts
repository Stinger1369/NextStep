// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import companyReducer from './features/company/companySlice';
import userReducer from './features/user/userSlice';
import imageReducer from './features/image/imageSlice';
import jobReducer from './features/jobs/jobSlice';
import themeReducer from './features/theme/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    user: userReducer,
    images: imageReducer,
    jobs: jobReducer,
    theme: themeReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
