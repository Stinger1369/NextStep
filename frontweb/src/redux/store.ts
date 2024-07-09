// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import companyReducer from './features/company/companySlice';
import userReducer from './features/user/userSlice';
import imageReducer from './features/image/imageSlice';
import jobReducer from './features/jobs/jobSlice';
import themeReducer from './features/theme/themeSlice';
import conversationReducer from './features/SocketServer/Thunk/conversationSlice';
import commentReducer from './features/SocketServer/Thunk/commentSlice';
import userSocketReducer from './features/SocketServer/userSocketSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    user: userReducer,
    images: imageReducer,
    jobs: jobReducer,
    theme: themeReducer,
    conversation: conversationReducer,
    comment: commentReducer,
    userSocket: userSocketReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
