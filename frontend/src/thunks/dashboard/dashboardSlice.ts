import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/src/store';
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
      .addCase(handleGetStatistics.pending, (state: DashboardState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetWeeklyViews.pending, (state: DashboardState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetMostViewedArticles.pending, (state: DashboardState) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle success cases
      .addCase(handleGetStatistics.fulfilled, (state: DashboardState, action) => {
        state.statistics = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(handleGetWeeklyViews.fulfilled, (state: DashboardState, action) => {
        state.weeklyViews = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(handleGetMostViewedArticles.fulfilled, (state: DashboardState, action) => {
        state.mostViewedArticles = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      // Handle error cases
      .addCase(handleGetStatistics.rejected, (state: DashboardState, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error fetching statistics';
      })
      .addCase(handleGetWeeklyViews.rejected, (state: DashboardState, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error fetching weekly views';
      })
      .addCase(handleGetMostViewedArticles.rejected, (state: DashboardState, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error fetching most viewed articles';
      });
  }
});

export const selectDashboardStatistics = (state: RootState) => state.dashboard.statistics;
export const selectWeeklyViews = (state: RootState) => state.dashboard.weeklyViews;
export const selectMostViewedArticles = (state: RootState) => state.dashboard.mostViewedArticles;
export const selectDashboardLoading = (state: RootState) => state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer; 