import axiosClient from './axiosClient';

export interface Article {
  id: string;
  title: string;
  publishedAt: string;
  view: number;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
}

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
      return await axiosClient.get('/dashboard/statistic');
    } catch (error) {
      console.error('[API] Error fetching dashboard statistics:', error);
      throw error;
    }
  },

  // Get weekly views
  getWeeklyViews: async (): Promise<WeeklyViews> => {
    try {
      console.log('[API] Fetching weekly views');
      return await axiosClient.get('/dashboard/view-week');
    } catch (error) {
      console.error('[API] Error fetching weekly views:', error);
      throw error;
    }
  },

  // Get most viewed articles
  getMostViewedArticles: async (): Promise<Article[]> => {
    try {
      console.log('[API] Fetching most viewed articles');
      return await axiosClient.get('/dashboard/most-viewed-articles');
    } catch (error) {
      console.error('[API] Error fetching most viewed articles:', error);
      throw error;
    }
  }
};

export default dashboardApi; 