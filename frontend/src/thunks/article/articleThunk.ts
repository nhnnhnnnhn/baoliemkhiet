import { createAsyncThunk } from '@reduxjs/toolkit';
import articleApi, { GetArticlesParams } from '../../apis/article';

export const handleGetArticles = createAsyncThunk(
  'article/getArticles',
  async (params: GetArticlesParams, { rejectWithValue }) => {
    try {
      console.log('Fetching articles with params:', params);
      const response = await articleApi.getArticles(params);
      console.log('Articles API response:', response);
      return response;
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách bài viết');
    }
  }
);

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

export const handleUpdateArticle = createAsyncThunk(
  'article/updateArticle',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await articleApi.updateArticle(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật bài viết');
    }
  }
);

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