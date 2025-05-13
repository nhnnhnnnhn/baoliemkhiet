import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/src/store';
import { Notification } from '@/src/apis/notification';
import { 
  handleGetNotifications, 
  handleMarkAsRead, 
  handleMarkAllAsRead, 
  handleGetUnreadCount,
  handleDeleteNotification 
} from './notificationThunk';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markingAsRead: boolean;
  markingAllAsRead: boolean;
  deleting: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  markingAsRead: false,
  markingAllAsRead: false,
  deleting: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotificationState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Notifications
      .addCase(handleGetNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGetNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.notifications = action.payload.data;
        }
      })
      .addCase(handleGetNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      
      // Mark as Read
      .addCase(handleMarkAsRead.pending, (state) => {
        state.markingAsRead = true;
      })
      .addCase(handleMarkAsRead.fulfilled, (state, action) => {
        state.markingAsRead = false;
        if (action.meta.arg) {
          const notificationId = action.meta.arg;
          state.notifications = state.notifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true } 
              : notification
          );
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(handleMarkAsRead.rejected, (state) => {
        state.markingAsRead = false;
      })
      
      // Mark All as Read
      .addCase(handleMarkAllAsRead.pending, (state) => {
        state.markingAllAsRead = true;
      })
      .addCase(handleMarkAllAsRead.fulfilled, (state) => {
        state.markingAllAsRead = false;
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          is_read: true
        }));
        state.unreadCount = 0;
      })
      .addCase(handleMarkAllAsRead.rejected, (state) => {
        state.markingAllAsRead = false;
      })
      
      // Get Unread Count
      .addCase(handleGetUnreadCount.fulfilled, (state, action) => {
        if (action.payload?.count?.data !== undefined) {
          state.unreadCount = action.payload.count.data;
        }
      })
      
      // Delete Notification
      .addCase(handleDeleteNotification.pending, (state) => {
        state.deleting = true;
      })
      .addCase(handleDeleteNotification.fulfilled, (state, action) => {
        state.deleting = false;
        if (action.meta.arg) {
          const notificationId = action.meta.arg;
          state.notifications = state.notifications.filter(
            notification => notification.id !== notificationId
          );
          // Update unread count if the deleted notification was unread
          const deletedNotification = state.notifications.find(
            notification => notification.id === notificationId
          );
          if (deletedNotification && !deletedNotification.is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      .addCase(handleDeleteNotification.rejected, (state) => {
        state.deleting = false;
      });
  },
});

export const { clearNotificationState } = notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notification.notifications;
export const selectUnreadCount = (state: RootState) => state.notification.unreadCount;
export const selectNotificationLoading = (state: RootState) => state.notification.loading;
export const selectNotificationError = (state: RootState) => state.notification.error;
export const selectMarkingAsRead = (state: RootState) => state.notification.markingAsRead;
export const selectMarkingAllAsRead = (state: RootState) => state.notification.markingAllAsRead;
export const selectDeletingNotification = (state: RootState) => state.notification.deleting;

export default notificationSlice.reducer; 