import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/src/store';
import { handleCreateTag, handleDeleteTag, handleGetTagById, handleGetTags, handleGetTagsByArticleId } from './tagThunk';
import { Tag as ApiTag } from '@/src/apis/tag';

// Sử dụng lại kiểu Tag từ API để đảm bảo tính nhất quán
export type Tag = ApiTag;

interface ArticleTags {
  [articleId: number]: Tag[];
}

interface TagState {
  tags: Tag[];
  totalTags: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  selectedTag: Tag | null;
  articleTags: ArticleTags;
  isCreatingTag: boolean;
  createTagError: string | null;
  createTagSuccess: boolean;
  isDeletingTag: boolean;
  deleteTagError: string | null;
  deleteTagSuccess: boolean;
}

const initialState: TagState = {
  tags: [],
  totalTags: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  selectedTag: null,
  articleTags: {},
  isCreatingTag: false,
  createTagError: null,
  createTagSuccess: false,
  isDeletingTag: false,
  deleteTagError: null,
  deleteTagSuccess: false
};

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    clearTagError: (state) => {
      state.error = null;
    },
    clearCreateTagState: (state) => {
      state.createTagError = null;
      state.createTagSuccess = false;
    },
    clearDeleteTagState: (state) => {
      state.deleteTagError = null;
      state.deleteTagSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý lấy danh sách tag
      .addCase(handleGetTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetTags.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Xử lý nhiều dạng dữ liệu trả về từ API
        if (action.payload?.tags) {
          // Trường hợp API trả về đúng định dạng
          state.tags = action.payload.tags;
        } else if (action.payload?.data) {
          // Trường hợp API trả về dữ liệu trong trường data
          state.tags = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          // Trường hợp API trả về trực tiếp mảng
          state.tags = action.payload;
        } else {
          // Trường hợp không xác định, gán mảng rỗng
          state.tags = [];
        }
        
        // Xử lý thông tin phân trang
        if (action.payload?.pagination) {
          state.totalTags = action.payload.pagination.total || 0;
          state.currentPage = action.payload.pagination.page || 1;
          state.totalPages = action.payload.pagination.totalPages || 1;
        } else {
          // Thử lấy thông tin phân trang trực tiếp từ payload
          state.totalTags = action.payload?.total || state.tags.length || 0;
          state.currentPage = action.payload?.page || 1;
          state.totalPages = action.payload?.totalPages || 1;
        }
      })
      .addCase(handleGetTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Xử lý lấy thông tin tag theo ID
      .addCase(handleGetTagById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetTagById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTag = action.payload;
      })
      .addCase(handleGetTagById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Xử lý lấy danh sách tag của một bài viết
      .addCase(handleGetTagsByArticleId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetTagsByArticleId.fulfilled, (state, action) => {
        state.isLoading = false;
        const { articleId, tags } = action.payload;
        state.articleTags[articleId] = tags;
      })
      .addCase(handleGetTagsByArticleId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Xử lý tạo tag mới
      .addCase(handleCreateTag.pending, (state) => {
        state.isCreatingTag = true;
        state.createTagError = null;
        state.createTagSuccess = false;
      })
      .addCase(handleCreateTag.fulfilled, (state, action) => {
        state.isCreatingTag = false;
        state.createTagSuccess = true;
        state.tags = [...state.tags, action.payload];
      })
      .addCase(handleCreateTag.rejected, (state, action) => {
        state.isCreatingTag = false;
        state.createTagError = action.payload as string;
        state.createTagSuccess = false;
      })

      // Xử lý xóa tag
      .addCase(handleDeleteTag.pending, (state) => {
        state.isDeletingTag = true;
        state.deleteTagError = null;
        state.deleteTagSuccess = false;
      })
      .addCase(handleDeleteTag.fulfilled, (state, action) => {
        state.isDeletingTag = false;
        state.deleteTagSuccess = true;
        state.tags = state.tags.filter(tag => tag.id !== action.payload);
      })
      .addCase(handleDeleteTag.rejected, (state, action) => {
        state.isDeletingTag = false;
        state.deleteTagError = action.payload as string;
        state.deleteTagSuccess = false;
      });
  }
});

// Export các actions
export const { clearTagError, clearCreateTagState, clearDeleteTagState } = tagSlice.actions;

// Export các selectors
export const selectTags = (state: RootState) => state.tag.tags;
export const selectTotalTags = (state: RootState) => state.tag.totalTags;
export const selectCurrentPage = (state: RootState) => state.tag.currentPage;
export const selectTotalPages = (state: RootState) => state.tag.totalPages;
export const selectIsLoading = (state: RootState) => state.tag.isLoading;
export const selectError = (state: RootState) => state.tag.error;
export const selectSelectedTag = (state: RootState) => state.tag.selectedTag;
export const selectArticleTags = (articleId: number) => (state: RootState) => state.tag.articleTags[articleId] || [];
export const selectIsCreatingTag = (state: RootState) => state.tag.isCreatingTag;
export const selectCreateTagError = (state: RootState) => state.tag.createTagError;
export const selectCreateTagSuccess = (state: RootState) => state.tag.createTagSuccess;
export const selectIsDeletingTag = (state: RootState) => state.tag.isDeletingTag;
export const selectDeleteTagError = (state: RootState) => state.tag.deleteTagError;
export const selectDeleteTagSuccess = (state: RootState) => state.tag.deleteTagSuccess;

// Export reducer
export default tagSlice.reducer;
