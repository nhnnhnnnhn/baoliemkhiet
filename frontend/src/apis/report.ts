import axiosClient from './axiosClient';

export interface Report {
  id: number;
  reportedBy: number;
  articleId: number | null;
  commentId: number | null;
  reason: string;
  createdAt: string;
  updatedAt: string;
  reportedByUser: {
    id: number;
    fullname: string;
  };
  article?: {
    id: number;
    title: string;
    content: string;
    thumbnail?: string;
    authorId: number;
    categoryId: number;
    status: string;
    publishedAt: string;
    isPublish: boolean;
    view: number;
    createdAt: string;
    updatedAt: string;
  };
  comment?: {
    id: number;
    articleId: number;
    userId: number;
    content: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user?: {
      id: number;
      fullname: string;
      email: string;
      avatar?: string;
    };
  };
}

const reportApi = {
  // Get all reports
  getAllReports: async (): Promise<Report[]> => {
    try {
      console.log('[API] Fetching all reports');
      const response = await axiosClient.get<Report[]>('/reports/get');
      console.log('[API] Reports fetched:', response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('[API] Error fetching reports:', error);
      throw error;
    }
  },

  // Get report by ID
  getReportById: async (id: number): Promise<Report> => {
    try {
      console.log(`[API] Fetching report ${id}`);
      const response = await axiosClient.get<Report>(`/reports/get/${id}`);
      console.log('[API] Report fetched:', response);
      if (!response) {
        throw new Error('Report not found');
      }
      return response as unknown as Report;
    } catch (error) {
      console.error('[API] Error fetching report:', error);
      throw error;
    }
  },

  // Get reports by article ID
  getReportsByArticleId: async (articleId: number): Promise<Report[]> => {
    try {
      console.log(`[API] Fetching reports for article ${articleId}`);
      const response = await axiosClient.get<Report[]>(`/reports/get-article/${articleId}`);
      console.log('[API] Reports fetched:', response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('[API] Error fetching article reports:', error);
      throw error;
    }
  },

  // Get reports by comment ID
  getReportsByCommentId: async (commentId: number): Promise<Report[]> => {
    try {
      console.log(`[API] Fetching reports for comment ${commentId}`);
      const response = await axiosClient.get<Report[]>(`/reports/get-comment/${commentId}`);
      console.log('[API] Reports fetched:', response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('[API] Error fetching comment reports:', error);
      throw error;
    }
  },

  // Delete a report
  deleteReport: async (id: number): Promise<void> => {
    try {
      console.log(`[API] Deleting report ${id}`);
      await axiosClient.delete(`/reports/delete/${id}`);
      console.log('[API] Report deleted successfully');
    } catch (error) {
      console.error('[API] Error deleting report:', error);
      throw error;
    }
  },

  // Delete multiple reports
  deleteMultipleReports: async (reportIds: number[]): Promise<void> => {
    try {
      console.log(`[API] Deleting multiple reports: ${reportIds.join(', ')}`);
      await axiosClient.delete('/reports/delete-multiple', {
        data: { reportIds }
      });
      console.log('[API] Reports deleted successfully');
    } catch (error) {
      console.error('[API] Error deleting reports:', error);
      throw error;
    }
  },

  // Edit a report
  editReport: async (id: number, reason: string): Promise<Report> => {
    try {
      console.log(`[API] Editing report ${id}`);
      const response = await axiosClient.patch<Report>(`/reports/edit/${id}`, { reason });
      console.log('[API] Report edited successfully:', response);
      return response as unknown as Report;
    } catch (error) {
      console.error('[API] Error editing report:', error);
      throw error;
    }
  },

  // Create a report for an article
  createArticleReport: async (data: { 
    reportedBy: number; 
    articleId: number; 
    reason: string; 
  }): Promise<Report> => {
    try {
      console.log(`[API] Creating report for article ${data.articleId}`);
      const response = await axiosClient.post<Report>('/reports/create', data);
      console.log('[API] Report created successfully:', response);
      return response as unknown as Report;
    } catch (error) {
      console.error('[API] Error creating article report:', error);
      throw error;
    }
  }
};

export default reportApi; 