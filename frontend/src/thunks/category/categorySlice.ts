import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/src/store';
import { handleCreateCategory, handleDeleteCategory, handleDeleteMultipleCategories, handleGetArticlesCount, handleGetCategories, handleGetCategoryById, handleUpdateCategory } from './categoryThunk';
import { Category as ApiCategory } from '@/src/apis/category';

// Sử dụng lại kiểu Category từ API để đảm bảo tính nhất quán
export type Category = ApiCategory;

interface ArticlesCount {
  [categoryId: string]: number;
}

interface CategoryState {
  categories: Category[];
  totalCategories: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  selectedCategory: Category | null;
  articlesCount: ArticlesCount;
  isCreatingCategory: boolean;
  createCategoryError: string | null;
  createCategorySuccess: boolean;
  isUpdatingCategory: boolean;
  updateCategoryError: string | null;
  updateCategorySuccess: boolean;
  isDeletingCategory: boolean;
  deleteCategoryError: string | null;
  deleteCategorySuccess: boolean;
  isDeletingMultipleCategories: boolean;
  deleteMultipleCategoriesError: string | null;
  deleteMultipleCategoriesSuccess: boolean;
  selectedCategoryIds: number[];
}

const initialState: CategoryState = {
  categories: [],
  totalCategories: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  selectedCategory: null,
  articlesCount: {},
  isCreatingCategory: false,
  createCategoryError: null,
  createCategorySuccess: false,
  isUpdatingCategory: false,
  updateCategoryError: null,
  updateCategorySuccess: false,
  isDeletingCategory: false,
  deleteCategoryError: null,
  deleteCategorySuccess: false,
  isDeletingMultipleCategories: false,
  deleteMultipleCategoriesError: null,
  deleteMultipleCategoriesSuccess: false,
  selectedCategoryIds: []
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearCreateCategoryState: (state) => {
      state.createCategoryError = null;
      state.createCategorySuccess = false;
    },
    clearUpdateCategoryState: (state) => {
      state.updateCategoryError = null;
      state.updateCategorySuccess = false;
    },
    clearDeleteCategoryState: (state) => {
      state.deleteCategoryError = null;
      state.deleteCategorySuccess = false;
    },
    clearDeleteMultipleCategoriesState: (state) => {
      state.deleteMultipleCategoriesError = null;
      state.deleteMultipleCategoriesSuccess = false;
    },
    toggleCategorySelection: (state, action) => {
      const categoryId = action.payload;
      const index = state.selectedCategoryIds.indexOf(categoryId);
      if (index === -1) {
        state.selectedCategoryIds.push(categoryId);
      } else {
        state.selectedCategoryIds.splice(index, 1);
      }
    },
    clearSelectedCategories: (state) => {
      state.selectedCategoryIds = [];
    },
    selectAllCategories: (state) => {
      state.selectedCategoryIds = state.categories.map(category => category.id);
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý lấy danh sách category
      .addCase(handleGetCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Xử lý nhiều dạng dữ liệu trả về từ API
        if (action.payload?.categories) {
          // Trường hợp API trả về đúng định dạng
          state.categories = action.payload.categories;
        } else if (action.payload?.data) {
          // Trường hợp API trả về dữ liệu trong trường data
          state.categories = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          // Trường hợp API trả về trực tiếp mảng
          state.categories = action.payload;
        } else {
          // Trường hợp không xác định, gán mảng rỗng
          state.categories = [];
        }
        
        // Xử lý thông tin phân trang
        if (action.payload?.pagination) {
          state.totalCategories = action.payload.pagination.total || 0;
          state.currentPage = action.payload.pagination.page || 1;
          state.totalPages = action.payload.pagination.totalPages || 1;
        } else {
          // Thử lấy thông tin phân trang trực tiếp từ payload
          state.totalCategories = action.payload?.total || state.categories.length || 0;
          state.currentPage = action.payload?.page || 1;
          state.totalPages = action.payload?.totalPages || 1;
        }
      })
      .addCase(handleGetCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Xử lý lấy thông tin category theo ID
      .addCase(handleGetCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(handleGetCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Xử lý tạo category mới
      .addCase(handleCreateCategory.pending, (state) => {
        state.isCreatingCategory = true;
        state.createCategoryError = null;
        state.createCategorySuccess = false;
      })
      .addCase(handleCreateCategory.fulfilled, (state, action) => {
        state.isCreatingCategory = false;
        state.createCategorySuccess = true;
        state.categories = [...state.categories, action.payload];
        state.totalCategories += 1;
      })
      .addCase(handleCreateCategory.rejected, (state, action) => {
        state.isCreatingCategory = false;
        state.createCategoryError = action.payload as string;
        state.createCategorySuccess = false;
      })

      // Xử lý cập nhật category
      .addCase(handleUpdateCategory.pending, (state) => {
        state.isUpdatingCategory = true;
        state.updateCategoryError = null;
        state.updateCategorySuccess = false;
      })
      .addCase(handleUpdateCategory.fulfilled, (state, action) => {
        state.isUpdatingCategory = false;
        state.updateCategorySuccess = true;
        state.categories = state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        );
        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(handleUpdateCategory.rejected, (state, action) => {
        state.isUpdatingCategory = false;
        state.updateCategoryError = action.payload as string;
        state.updateCategorySuccess = false;
      })

      // Xử lý xóa category
      .addCase(handleDeleteCategory.pending, (state) => {
        state.isDeletingCategory = true;
        state.deleteCategoryError = null;
        state.deleteCategorySuccess = false;
      })
      .addCase(handleDeleteCategory.fulfilled, (state, action) => {
        state.isDeletingCategory = false;
        state.deleteCategorySuccess = true;
        state.categories = state.categories.filter(category => category.id !== action.payload);
        state.totalCategories -= 1;
        // Xóa khỏi danh sách đã chọn nếu có
        const index = state.selectedCategoryIds.indexOf(action.payload);
        if (index !== -1) {
          state.selectedCategoryIds.splice(index, 1);
        }
      })
      .addCase(handleDeleteCategory.rejected, (state, action) => {
        state.isDeletingCategory = false;
        state.deleteCategoryError = action.payload as string;
        state.deleteCategorySuccess = false;
      })

      // Xử lý xóa nhiều category
      .addCase(handleDeleteMultipleCategories.pending, (state) => {
        state.isDeletingMultipleCategories = true;
        state.deleteMultipleCategoriesError = null;
        state.deleteMultipleCategoriesSuccess = false;
      })
      .addCase(handleDeleteMultipleCategories.fulfilled, (state, action) => {
        state.isDeletingMultipleCategories = false;
        state.deleteMultipleCategoriesSuccess = true;
        const deletedIds = action.payload;
        state.categories = state.categories.filter(category => !deletedIds.includes(category.id));
        state.totalCategories -= deletedIds.length;
        // Xóa khỏi danh sách đã chọn
        state.selectedCategoryIds = state.selectedCategoryIds.filter(id => !deletedIds.includes(id));
      })
      .addCase(handleDeleteMultipleCategories.rejected, (state, action) => {
        state.isDeletingMultipleCategories = false;
        state.deleteMultipleCategoriesError = action.payload as string;
        state.deleteMultipleCategoriesSuccess = false;
      })

      // Xử lý lấy số lượng bài viết theo category
      .addCase(handleGetArticlesCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticlesCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articlesCount = action.payload || {};
      })
      .addCase(handleGetArticlesCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Export các actions
export const { 
  clearCategoryError, 
  clearCreateCategoryState, 
  clearUpdateCategoryState, 
  clearDeleteCategoryState, 
  clearDeleteMultipleCategoriesState,
  toggleCategorySelection,
  clearSelectedCategories,
  selectAllCategories
} = categorySlice.actions;

// Export các selectors
export const selectCategories = (state: RootState) => state.category.categories;
export const selectTotalCategories = (state: RootState) => state.category.totalCategories;
export const selectCurrentPage = (state: RootState) => state.category.currentPage;
export const selectTotalPages = (state: RootState) => state.category.totalPages;
export const selectIsLoading = (state: RootState) => state.category.isLoading;
export const selectError = (state: RootState) => state.category.error;
export const selectSelectedCategory = (state: RootState) => state.category.selectedCategory;
export const selectArticlesCount = (state: RootState) => state.category.articlesCount;
export const selectArticleCountByCategoryId = (categoryId: number) => (state: RootState) => 
  state.category.articlesCount[categoryId.toString()] || 0;

export const selectIsCreatingCategory = (state: RootState) => state.category.isCreatingCategory;
export const selectCreateCategoryError = (state: RootState) => state.category.createCategoryError;
export const selectCreateCategorySuccess = (state: RootState) => state.category.createCategorySuccess;

export const selectIsUpdatingCategory = (state: RootState) => state.category.isUpdatingCategory;
export const selectUpdateCategoryError = (state: RootState) => state.category.updateCategoryError;
export const selectUpdateCategorySuccess = (state: RootState) => state.category.updateCategorySuccess;

export const selectIsDeletingCategory = (state: RootState) => state.category.isDeletingCategory;
export const selectDeleteCategoryError = (state: RootState) => state.category.deleteCategoryError;
export const selectDeleteCategorySuccess = (state: RootState) => state.category.deleteCategorySuccess;

export const selectIsDeletingMultipleCategories = (state: RootState) => state.category.isDeletingMultipleCategories;
export const selectDeleteMultipleCategoriesError = (state: RootState) => state.category.deleteMultipleCategoriesError;
export const selectDeleteMultipleCategoriesSuccess = (state: RootState) => state.category.deleteMultipleCategoriesSuccess;

export const selectSelectedCategoryIds = (state: RootState) => state.category.selectedCategoryIds;

// Export reducer
export default categorySlice.reducer;
