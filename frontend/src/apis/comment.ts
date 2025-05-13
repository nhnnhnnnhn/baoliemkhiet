import axiosClient from './axiosClient'
import axios from 'axios'

// Create a public client that doesn't try to use authentication
const publicAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// For the public client, we still want the response data directly
publicAxiosClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

export interface Comment {
  id: number
  content: string
  articleId: number
  userId: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED_BY_AI' | 'REJECTED_BY_REPORT'
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    fullname: string
    email: string
    avatar?: string
  }
}

export interface GetCommentsResponse {
  comments: Comment[]
  totalComments: number
  totalApprovedComments?: number
  currentPage: number
  totalPages: number
}

export interface CreateCommentPayload {
  content: string
  article_id: number
  author_id: number
  status?: 'PENDING' | 'APPROVED' | 'REJECTED_BY_AI' | 'REJECTED_BY_REPORT'
}

export interface EditCommentPayload {
  content: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED_BY_AI' | 'REJECTED_BY_REPORT'
}

const commentApi = {
  // Get comments for an article (approved or all depending on user role)
  getComments: async (articleId: number, page = 1, limit = 10): Promise<Comment[] | GetCommentsResponse> => {
    try {
      // Thêm debug log
      console.log(`Fetching comments for article ${articleId}, page ${page}, limit ${limit}`);
      
      // Use public client to ensure no auth is required
      const response = await publicAxiosClient.get(`/comments/${articleId}`, {
        params: { page, limit }
      });
      
      // Thêm debug log
      console.log('API Response:', response);
      
      // Trả về dữ liệu từ response
      return response.data || response;
    } catch (error: any) {
      console.error('Comment API error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        error
      });
      
      // Nếu lỗi 404 (không tìm thấy), trả về mảng rỗng
      if (error.response?.status === 404) {
        console.log('No comments found, returning empty array');
        return [];
      }
      
      throw error;
    }
  },

  // Create new comment
  createComment: async (data: CreateCommentPayload): Promise<Comment> => {
    try {
      const payload = {
        content: data.content,
        articleId: data.article_id,  // Chuyển đổi từ article_id sang articleId
        authorId: data.author_id,    // Chuyển đổi từ author_id sang authorId
        status: data.status || 'PENDING'
      };
      
      console.log('Creating comment with payload:', payload);
      
      const response = await axiosClient.post(`/comments`, payload);
      console.log('Create comment response:', response);
      
      return response.data || response;
    } catch (error) {
      console.error('Create comment error:', error);
      throw error;
    }
  },

  // Update comment
  updateComment: async (articleId: number, commentId: number, data: EditCommentPayload): Promise<Comment> => {
    try {
      console.log(`Updating comment ${commentId} with data:`, data);
      
      const response = await axiosClient.put(`/comments/${commentId}`, data);
      console.log('Update comment response:', response);
      
      return response.data || response;
    } catch (error) {
      console.error('Update comment error:', error);
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (articleId: number, commentId: number): Promise<void> => {
    try {
      console.log(`Deleting comment ${commentId}`);
      
      const response = await axiosClient.delete(`/comments/${commentId}`);
      console.log('Delete comment response:', response);
      
      return;
    } catch (error) {
      console.error('Delete comment error:', error);
      throw error;
    }
  }
};

export default commentApi;