import axiosClient from './axiosClient';

export interface DashboardStatistics {
  viewsInThisMonth: number;
  viewsInPreviousMonth: number;
  countArticlesInThisMonth: number;
  countArticlesInPreviousMonth: number;
  likesInThisMonth: number;
  likesInPreviousMonth: number;
  commentsInThisMonth: number;
  commentsInPreviousMonth: number;
  viewPercentage: string;
  articlePercentage: string;
  likePercentage: string;
  commentPercentage: string;
}

export interface WeeklyViews {
  week1: number;
  week2: number;
  week3: number;
  week4: number;
}

const dashboardApi = {
  // Get dashboard statistics
  getStatistics: async (): Promise<DashboardStatistics> => {
    try {
      console.log('[API] Fetching dashboard statistics');
      const response = await axiosClient.get<DashboardStatistics>('/dashboard/statistic');
      console.log('[API] Dashboard statistics:', response);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching dashboard statistics:', error);
      throw error;
    }
  },

  // Get weekly views
  getWeeklyViews: async (): Promise<WeeklyViews> => {
    try {
      console.log('[API] Fetching weekly views');
      const response = await axiosClient.get<WeeklyViews>('/dashboard/view-week');
      console.log('[API] Weekly views:', response);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching weekly views:', error);
      throw error;
    }
  },

  // Get most viewed articles
  getMostViewedArticles: async () => {
    try {
      console.log('[API] Fetching most viewed articles');
      const response = await axiosClient.get('/dashboard/most-viewed-articles');
      console.log('[API] Most viewed articles:', response);
      return response.data;
    } catch (error) {
      console.error('[API] Error fetching most viewed articles:', error);
      throw error;
    }
  }
};

export default dashboardApi; 