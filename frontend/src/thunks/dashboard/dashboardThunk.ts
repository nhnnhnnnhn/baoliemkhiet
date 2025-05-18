import { createAsyncThunk } from '@reduxjs/toolkit';
import dashboardApi from '@/src/apis/dashboard';

// Get dashboard statistics
export const handleGetStatistics = createAsyncThunk(
  'dashboard/getStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getStatistics();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard statistics');
    }
  }
);

// Get weekly views
export const handleGetWeeklyViews = createAsyncThunk(
  'dashboard/getWeeklyViews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getWeeklyViews();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weekly views');
    }
  }
);

// Get most viewed articles
export const handleGetMostViewedArticles = createAsyncThunk(
  'dashboard/getMostViewedArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getMostViewedArticles();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch most viewed articles');
    }
  }
); 