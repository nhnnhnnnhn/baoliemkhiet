import { createSlice } from '@reduxjs/toolkit';
import { DashboardStatistics, WeeklyViews } from '@/src/apis/dashboard';
import { handleGetStatistics, handleGetWeeklyViews, handleGetMostViewedArticles } from './dashboardThunk';

interface DashboardState {
  statistics: DashboardStatistics | null;
  weeklyViews: WeeklyViews | null;
  mostViewedArticles: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  statistics: null,
  weeklyViews: null,
  mostViewedArticles: [],
  isLoading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle get statistics
      .addCase(handleGetStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload;
      })
      .addCase(handleGetStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle get weekly views
      .addCase(handleGetWeeklyViews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetWeeklyViews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weeklyViews = action.payload;
      })
      .addCase(handleGetWeeklyViews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle get most viewed articles
      .addCase(handleGetMostViewedArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetMostViewedArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mostViewedArticles = action.payload;
      })
      .addCase(handleGetMostViewedArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectDashboardStatistics = (state: any) => state.dashboard.statistics;
export const selectWeeklyViews = (state: any) => state.dashboard.weeklyViews;
export const selectMostViewedArticles = (state: any) => state.dashboard.mostViewedArticles;
export const selectDashboardLoading = (state: any) => state.dashboard.isLoading;
export const selectDashboardError = (state: any) => state.dashboard.error;

export default dashboardSlice.reducer; 