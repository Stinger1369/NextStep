// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import companyReducer from './features/company/companySlice';
import userReducer from './features/user/userSlice';
import imageReducer from './features/image/imageSlice';
import jobReducer from './features/jobs/jobSlice';
import themeReducer from './features/theme/themeSlice';
import postReducer, { selectPostsWithDates } from './features/websocket/posts/postSlice';
import userWebSocketReducer from './features/websocket/users/userWebSocketSlice';
import commentReducer from './features/websocket/comments/commentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    user: userReducer,
    images: imageReducer,
    jobs: jobReducer,
    theme: themeReducer,
    posts: postReducer,
    userWebSocket: userWebSocketReducer,
    comments: commentReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the selectPostsWithDates selector from the store
export { selectPostsWithDates };
