import { createAsyncThunk } from '@reduxjs/toolkit'
import commentApi, { CreateCommentPayload, EditCommentPayload } from '@/src/apis/comment'

export const handleGetComments = createAsyncThunk(
  'comment/getComments',
  async ({ articleId, page = 1, limit = 10 }: { articleId: number; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await commentApi.getComments(articleId, page, limit);
      
      // Kiểm tra nếu response không tồn tại
      if (!response) {
        return {
          comments: [],
          totalComments: 0,
          currentPage: 1,
          totalPages: 1
        };
      }
      
      // Nếu response là một mảng bình luận (backend trả về mảng đơn giản)
      if (Array.isArray(response)) {
        // Chỉ lấy các bình luận đã được phê duyệt để hiển thị
        const approvedComments = response.filter(comment => comment.status === 'APPROVED');
        
        return {
          comments: approvedComments,
          totalComments: approvedComments.length,
          currentPage: 1,
          totalPages: 1
        };
      }
      
      // Nếu response là object có dạng paged (có phân trang)
      if (response.comments) {
        // Chỉ lấy các bình luận đã được phê duyệt 
        const approvedComments = response.comments.filter(comment => comment.status === 'APPROVED');
        
        // Tính toán tổng số bình luận đã được phê duyệt
        const totalApprovedComments = response.totalApprovedComments || approvedComments.length;
        
        return {
          comments: approvedComments,
          totalComments: totalApprovedComments,
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1
        };
      }
      
      // Trường hợp khác, trả về dữ liệu trống
      return {
        comments: [],
        totalComments: 0,
        currentPage: 1,
        totalPages: 1
      };
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch comments');
    }
  }
)

export const handleCreateComment = createAsyncThunk(
  'comment/createComment',
  async (data: CreateCommentPayload, { rejectWithValue }) => {
    try {
      const response = await commentApi.createComment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create comment');
    }
  }
)

export const handleUpdateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ articleId, commentId, data }: { articleId: number; commentId: number; data: EditCommentPayload }, { rejectWithValue }) => {
    try {
      const response = await commentApi.updateComment(articleId, commentId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update comment');
    }
  }
)

export const handleDeleteComment = createAsyncThunk(
  'comment/deleteComment',
  async ({ articleId, commentId }: { articleId: number; commentId: number }, { rejectWithValue }) => {
    try {
      await commentApi.deleteComment(articleId, commentId);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete comment');
    }
  }
)