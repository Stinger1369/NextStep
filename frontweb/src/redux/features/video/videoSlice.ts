// videoSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addVideo } from './thunks/addVideo'; // Import du thunk addVideo
import { addVideos } from './thunks/addVideos'; // Import du thunk addVideos
import { deleteVideo } from './thunks/deleteVideo'; // Import du thunk deleteVideo
import { updateVideo } from './thunks/updateVideo'; // Import du thunk updateVideo
import { userFriendlyMessages } from '../../../utils/errorMessages';

interface VideoState {
  videos: string[];
  loading: boolean;
  error: { message: string; code: string | null } | null;
  videoErrors: { videoName: string; message: string; code: string | null }[];
}

interface ErrorPayload {
  message: string;
  code: string | null;
}

interface AddVideosPayload {
  videoName: string;
  status: string;
  url?: string;
  message?: string;
  code?: string;
}

const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
  videoErrors: []
};

const extractErrorCode = (message: string): string | null => {
  const match = message.match(/\[([A-Z0-9]+)\]/);
  return match ? match[1] : null;
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('addVideo.pending');
      })
      .addCase(addVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = [...new Set([...state.videos, action.payload])];
        console.log('addVideo.fulfilled:', action.payload);
      })
      .addCase(addVideo.rejected, (state, action) => {
        state.loading = false;
        console.error('addVideo rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = extractErrorCode(payload.message);
          state.error = {
            message: errorCode
              ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
              : payload.message.split(':')[0],
            code: errorCode
          };
        } else {
          state.error = {
            message: 'Failed to add video',
            code: 'UNKNOWN_ERROR'
          };
        }
      })
      .addCase(addVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.videoErrors = [];
        console.log('addVideos.pending');
      })
      .addCase(addVideos.fulfilled, (state, action: PayloadAction<AddVideosPayload[]>) => {
        state.loading = false;
        const successfulVideos = action.payload
          .filter((vid) => vid.status === 'success' && vid.url !== undefined)
          .map((vid) => vid.url as string);
        state.videos = [...new Set([...state.videos, ...successfulVideos])];
        console.log('addVideos.fulfilled:', action.payload);
        const failedVideos = action.payload.filter((vid) => vid.status === 'failed');
        state.videoErrors = failedVideos.map((vid) => ({
          videoName: vid.videoName,
          message: vid.message || 'Failed to add video',
          code: vid.code || 'UNKNOWN_ERROR'
        }));
      })
      .addCase(addVideos.rejected, (state, action) => {
        state.loading = false;
        console.error('addVideos rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = extractErrorCode(payload.message);
          state.error = {
            message: errorCode
              ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
              : payload.message.split(':')[0],
            code: errorCode
          };
        } else {
          state.error = {
            message: 'Failed to add videos',
            code: 'UNKNOWN_ERROR'
          };
        }
      })
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('deleteVideo.pending');
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter((video) => !video.includes(action.payload.videoName));
        console.log('deleteVideo.fulfilled:', action.payload);
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        console.error('deleteVideo rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = extractErrorCode(payload.message);
          state.error = {
            message: errorCode
              ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
              : payload.message.split(':')[0],
            code: errorCode
          };
        } else {
          state.error = {
            message: 'Failed to delete video',
            code: 'UNKNOWN_ERROR'
          };
        }
      })
      .addCase(updateVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('updateVideo.pending');
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.videos.findIndex((video) => video.includes(action.payload.oldVideo));
        if (index !== -1) {
          state.videos[index] = action.payload.newVideo;
        }
        console.log('updateVideo.fulfilled:', action.payload);
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.loading = false;
        console.error('updateVideo rejected:', action.payload);
        const payload = action.payload as ErrorPayload | undefined;
        if (payload && typeof payload.message === 'string') {
          const errorCode = extractErrorCode(payload.message);
          state.error = {
            message: errorCode
              ? userFriendlyMessages[errorCode as keyof typeof userFriendlyMessages]
              : payload.message.split(':')[0],
            code: errorCode
          };
        } else {
          state.error = {
            message: 'Failed to update video',
            code: 'UNKNOWN_ERROR'
          };
        }
      });
  }
});

export { addVideo, addVideos, deleteVideo, updateVideo };
export default videoSlice.reducer;
