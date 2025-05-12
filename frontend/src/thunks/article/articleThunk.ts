import { createAsyncThunk } from '@reduxjs/toolkit'
import articleApi, {
  Article,
  GetArticlesParams,
  CreateArticlePayload,
  EditArticlePayload,
  DeleteMultipleArticlesPayload,
  GetArticlesResponse,
  ArticleStatistics
} from '@/src/apis/article'

// Thunk để lấy danh sách bài viết
export const handleGetArticles = createAsyncThunk(
  'article/getArticles',
  async (params: GetArticlesParams = {}, { rejectWithValue }) => {
    try {
      const response = await articleApi.getArticles(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết');
    }
  }
);

// Thunk để lấy danh sách bài viết đã đăng
export const handleGetPostedArticles = createAsyncThunk(
  'article/getPostedArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await articleApi.getPostedArticles();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết đã đăng');
    }
  }
);

// Thunk để lấy chi tiết bài viết theo ID
export const handleGetArticleById = createAsyncThunk(
  'article/getArticleById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await articleApi.getArticleById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin bài viết');
    }
  }
);

// Thunk để lấy bài viết được xem nhiều nhất
export const handleGetMostViewedArticles = createAsyncThunk(
  'article/getMostViewedArticles',
  async (timePeriod: string, { rejectWithValue }) => {
    try {
      const response = await articleApi.getMostViewedArticles(timePeriod);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết được xem nhiều nhất');
    }
  }
);

// Thunk để lấy bài viết theo danh mục
export const handleGetArticlesByCategory = createAsyncThunk(
  'article/getArticlesByCategory',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await articleApi.getArticlesByCategory(categoryId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết theo danh mục');
    }
  }
);

// Thunk để lấy bài viết theo tác giả
export const handleGetArticlesByAuthor = createAsyncThunk(
  'article/getArticlesByAuthor',
  async (authorId: number, { rejectWithValue }) => {
    try {
      const response = await articleApi.getArticlesByAuthor(authorId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết theo tác giả');
    }
  }
);

// Thunk để lấy bài viết được thích nhiều nhất
export const handleGetMostLikedArticles = createAsyncThunk(
  'article/getMostLikedArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await articleApi.getMostLikedArticles();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết được thích nhiều nhất');
    }
  }
);

// Thunk để lấy bài viết theo trạng thái
export const handleGetArticlesByStatus = createAsyncThunk(
  'article/getArticlesByStatus',
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await articleApi.getArticlesByStatus(status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết theo trạng thái');
    }
  }
);

// Thunk để lấy bài viết theo tag
export const handleGetArticlesByTag = createAsyncThunk(
  'article/getArticlesByTag',
  async (tagId: number, { rejectWithValue }) => {
    try {
      const response = await articleApi.getArticlesByTag(tagId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết theo tag');
    }
  }
);

// Thunk để lấy bài viết theo khoảng thời gian
export const handleGetArticlesByDateRange = createAsyncThunk(
  'article/getArticlesByDateRange',
  async ({startDate, endDate}: {startDate: string, endDate: string}, { rejectWithValue }) => {
    try {
      const response = await articleApi.getArticlesByDateRange(startDate, endDate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết theo khoảng thời gian');
    }
  }
);

// Thunk để lấy bài viết liên quan
export const handleGetRelatedArticles = createAsyncThunk(
  'article/getRelatedArticles',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await articleApi.getRelatedArticles(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết liên quan');
    }
  }
);

// Thunk để lấy thống kê bài viết
export const handleGetStatistics = createAsyncThunk(
  'article/getStatistics',
  async ({startDate, endDate}: {startDate: string, endDate: string}, { rejectWithValue }) => {
    try {
      const response = await articleApi.getStatistics(startDate, endDate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thống kê bài viết');
    }
  }
);

// Thunk để tìm kiếm bài viết
export const handleSearchArticles = createAsyncThunk(
  'article/searchArticles',
  async (keyword: string, { rejectWithValue }) => {
    try {
      const response = await articleApi.searchArticles(keyword);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tìm kiếm bài viết');
    }
  }
);

// Thunk để tạo bài viết mới
export const handleCreateArticle = createAsyncThunk(
  'article/createArticle',
  async (data: CreateArticlePayload, { rejectWithValue }) => {
    try {
      const response = await articleApi.createArticle(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo bài viết mới');
    }
  }
);

// Thunk để cập nhật bài viết
export const handleUpdateArticle = createAsyncThunk(
  'article/updateArticle',
  async ({ id, data }: { id: number; data: EditArticlePayload }, { rejectWithValue }) => {
    try {
      const response = await articleApi.updateArticle(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật bài viết');
    }
  }
);

// Thunk để duyệt bài viết
export const handleApproveArticle = createAsyncThunk(
  'article/approveArticle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await articleApi.approveArticle(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể duyệt bài viết');
    }
  }
);

// Thunk để từ chối bài viết
export const handleRejectArticle = createAsyncThunk(
  'article/rejectArticle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await articleApi.rejectArticle(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể từ chối bài viết');
    }
  }
);

// Thunk để xóa bài viết
export const handleDeleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async (id: number, { rejectWithValue }) => {
    try {
      await articleApi.deleteArticle(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa bài viết');
    }
  }
);

// Thunk để xóa nhiều bài viết
export const handleDeleteMultipleArticles = createAsyncThunk(
  'article/deleteMultipleArticles',
  async (data: DeleteMultipleArticlesPayload, { rejectWithValue }) => {
    try {
      await articleApi.deleteMultipleArticles(data);
      return data.ids;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa nhiều bài viết');
    }
  }
);
