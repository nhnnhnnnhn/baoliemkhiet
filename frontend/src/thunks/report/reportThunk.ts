import { createAsyncThunk } from '@reduxjs/toolkit';
import reportApi, { Report } from '../../apis/report';

// Thunk để lấy tất cả báo cáo
export const handleGetAllReports = createAsyncThunk(
  'report/getAllReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportApi.getAllReports();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách báo cáo');
    }
  }
);

// Thunk để lấy báo cáo theo ID
export const handleGetReportById = createAsyncThunk(
  'report/getReportById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await reportApi.getReportById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin báo cáo');
    }
  }
);

// Thunk để lấy báo cáo theo ID bài viết
export const handleGetReportsByArticleId = createAsyncThunk(
  'report/getReportsByArticleId',
  async (articleId: number, { rejectWithValue }) => {
    try {
      const response = await reportApi.getReportsByArticleId(articleId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách báo cáo của bài viết');
    }
  }
);

// Thunk để lấy báo cáo theo ID bình luận
export const handleGetReportsByCommentId = createAsyncThunk(
  'report/getReportsByCommentId',
  async (commentId: number, { rejectWithValue }) => {
    try {
      const response = await reportApi.getReportsByCommentId(commentId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách báo cáo của bình luận');
    }
  }
);

// Thunk để chỉnh sửa báo cáo
export const handleEditReport = createAsyncThunk(
  'report/editReport',
  async ({ id, reason }: { id: number; reason: string }, { rejectWithValue }) => {
    try {
      const response = await reportApi.editReport(id, reason);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể chỉnh sửa báo cáo');
    }
  }
);

// Thunk để xóa báo cáo
export const handleDeleteReport = createAsyncThunk(
  'report/deleteReport',
  async (id: number, { rejectWithValue }) => {
    try {
      await reportApi.deleteReport(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa báo cáo');
    }
  }
);

// Thunk để xóa nhiều báo cáo
export const handleDeleteMultipleReports = createAsyncThunk(
  'report/deleteMultipleReports',
  async (reportIds: number[], { rejectWithValue }) => {
    try {
      await reportApi.deleteMultipleReports(reportIds);
      return reportIds;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa các báo cáo đã chọn');
    }
  }
);

// Thunk để tạo báo cáo cho bài viết
export const handleCreateArticleReport = createAsyncThunk(
  'report/createArticleReport',
  async (data: { reportedBy: number; articleId: number; reason: string }, { rejectWithValue }) => {
    try {
      const response = await reportApi.createArticleReport(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo báo cáo cho bài viết');
    }
  }
); 