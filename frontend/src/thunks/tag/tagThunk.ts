import { createAsyncThunk } from '@reduxjs/toolkit';
import tagApi, { CreateTagPayload, GetTagsParams, UpdateTagPayload } from '@/src/apis/tag';

// Thunk để lấy danh sách tag
export const handleGetTags = createAsyncThunk(
  'tag/getTags',
  async (params: GetTagsParams = {}, { rejectWithValue }) => {
    try {
      const response = await tagApi.getTags(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách tag');
    }
  }
);

// Thunk để lấy thông tin tag theo ID
export const handleGetTagById = createAsyncThunk(
  'tag/getTagById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await tagApi.getTagById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin tag');
    }
  }
);

// Thunk để lấy danh sách tag của một bài viết
export const handleGetTagsByArticleId = createAsyncThunk(
  'tag/getTagsByArticleId',
  async (articleId: number, { rejectWithValue }) => {
    try {
      const response = await tagApi.getTagsByArticleId(articleId);
      return { articleId, tags: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách tag của bài viết');
    }
  }
);

// Thunk để tạo tag mới
export const handleCreateTag = createAsyncThunk(
  'tag/createTag',
  async (data: CreateTagPayload, { rejectWithValue }) => {
    try {
      const response = await tagApi.createTag(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo tag mới');
    }
  }
);

// Thunk để xóa tag
export const handleDeleteTag = createAsyncThunk(
  'tag/deleteTag',
  async (id: number, { rejectWithValue }) => {
    try {
      await tagApi.deleteTag(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa tag');
    }
  }
);

export const handleUpdateTag = createAsyncThunk(
  'tag/updateTag',
  async ({ id, data }: { id: number; data: UpdateTagPayload }, { rejectWithValue }) => {
    try {
      const response = await tagApi.updateTag(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thẻ');
    }
  }
);
