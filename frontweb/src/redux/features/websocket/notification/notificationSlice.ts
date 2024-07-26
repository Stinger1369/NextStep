import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { Notification } from '../../../../types';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess(state, action: PayloadAction<Notification[]>) {
      state.loading = false;
      state.notifications = action.payload;
    },
    fetchNotificationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    }
  }
});

export const { fetchNotificationsRequest, fetchNotificationsSuccess, fetchNotificationsFailure, addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectNotificationsLoading = (state: RootState) => state.notifications.loading;
export const selectNotificationsError = (state: RootState) => state.notifications.error;
