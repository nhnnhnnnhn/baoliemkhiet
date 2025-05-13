import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationApi, { Notification, GetNotificationsResponse, GetNotificationCountResponse } from '@/src/apis/notification';

export const handleGetNotifications = createAsyncThunk(
  'notification/getNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getNotifications();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
    }
  }
);

export const handleMarkAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAsRead(notificationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to mark notification as read');
    }
  }
);

export const handleMarkAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAllAsRead();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to mark all notifications as read');
    }
  }
);

export const handleGetUnreadCount = createAsyncThunk(
  'notification/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to get unread count');
    }
  }
);

export const handleDeleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.deleteNotification(notificationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete notification');
    }
  }
); 