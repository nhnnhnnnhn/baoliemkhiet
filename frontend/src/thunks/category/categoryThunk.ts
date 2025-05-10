import { createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi, { CreateCategoryPayload, EditCategoryPayload, GetCategoriesParams, DeleteMultipleCategoriesPayload } from '@/src/apis/category';

// Thunk để lấy danh sách category
export const handleGetCategories = createAsyncThunk(
  'category/getCategories',
  async (params: GetCategoriesParams = {}, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategories(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách danh mục');
    }
  }
);

// Thunk để lấy thông tin category theo ID
export const handleGetCategoryById = createAsyncThunk(
  'category/getCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategoryById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin danh mục');
    }
  }
);

// Thunk để tạo category mới
export const handleCreateCategory = createAsyncThunk(
  'category/createCategory',
  async (data: CreateCategoryPayload, { rejectWithValue }) => {
    try {
      const response = await categoryApi.createCategory(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo danh mục mới');
    }
  }
);

// Thunk để cập nhật category
export const handleUpdateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, data }: { id: number; data: EditCategoryPayload }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.updateCategory(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật danh mục');
    }
  }
);

// Thunk để xóa category
export const handleDeleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryApi.deleteCategory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa danh mục');
    }
  }
);

// Thunk để xóa nhiều category
export const handleDeleteMultipleCategories = createAsyncThunk(
  'category/deleteMultipleCategories',
  async (data: DeleteMultipleCategoriesPayload, { rejectWithValue }) => {
    try {
      await categoryApi.deleteMultipleCategories(data);
      return data.ids;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa các danh mục đã chọn');
    }
  }
);

// Thunk để lấy số lượng bài viết theo category
export const handleGetArticlesCount = createAsyncThunk(
  'category/getArticlesCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getArticlesCount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy số lượng bài viết theo danh mục');
    }
  }
);
