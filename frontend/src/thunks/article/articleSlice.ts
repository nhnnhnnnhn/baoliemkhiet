import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/src/store'
import { Article, ArticleStatistics } from '@/src/apis/article'
import {
  handleGetArticles,
  handleGetPostedArticles,
  handleGetArticleById,
  handleGetArticleBySlug,
  handleGetMostViewedArticles,
  handleGetArticlesByCategory,
  handleGetArticlesByAuthor,
  handleGetMostLikedArticles,
  handleGetArticlesByStatus,
  handleGetArticlesByTag,
  handleGetArticlesByDateRange,
  handleGetRelatedArticles,
  handleGetStatistics,
  handleSearchArticles,
  handleCreateArticle,
  handleUpdateArticle,
  handleApproveArticle,
  handleRejectArticle,
  handleDeleteArticle,
  handleDeleteMultipleArticles
} from './articleThunk'

interface ArticleState {
  articles: Article[]
  filteredArticles: Article[]
  selectedArticle: Article | null
  relatedArticles: Article[]
  mostViewedArticles: Article[]
  mostLikedArticles: Article[]
  statistics: ArticleStatistics | null
  totalArticles: number
  currentPage: number
  totalPages: number
  selectedArticleIds: number[]
  isLoading: boolean
  error: string | null
  
  // Trạng thái tạo bài viết
  isCreatingArticle: boolean
  createArticleError: string | null
  createArticleSuccess: boolean
  
  // Trạng thái cập nhật bài viết
  isUpdatingArticle: boolean
  updateArticleError: string | null
  updateArticleSuccess: boolean
  
  // Trạng thái duyệt bài viết
  isApprovingArticle: boolean
  approveArticleError: string | null
  approveArticleSuccess: boolean
  
  // Trạng thái từ chối bài viết
  isRejectingArticle: boolean
  rejectArticleError: string | null
  rejectArticleSuccess: boolean
  
  // Trạng thái xóa bài viết
  isDeletingArticle: boolean
  deleteArticleError: string | null
  deleteArticleSuccess: boolean
  
  // Trạng thái xóa nhiều bài viết
  isDeletingMultipleArticles: boolean
  deleteMultipleArticlesError: string | null
  deleteMultipleArticlesSuccess: boolean
}

const initialState: ArticleState = {
  articles: [],
  filteredArticles: [],
  selectedArticle: null,
  relatedArticles: [],
  mostViewedArticles: [],
  mostLikedArticles: [],
  statistics: null,
  totalArticles: 0,
  currentPage: 1,
  totalPages: 1,
  selectedArticleIds: [],
  isLoading: false,
  error: null,
  
  // Trạng thái tạo bài viết
  isCreatingArticle: false,
  createArticleError: null,
  createArticleSuccess: false,
  
  // Trạng thái cập nhật bài viết
  isUpdatingArticle: false,
  updateArticleError: null,
  updateArticleSuccess: false,
  
  // Trạng thái duyệt bài viết
  isApprovingArticle: false,
  approveArticleError: null,
  approveArticleSuccess: false,
  
  // Trạng thái từ chối bài viết
  isRejectingArticle: false,
  rejectArticleError: null,
  rejectArticleSuccess: false,
  
  // Trạng thái xóa bài viết
  isDeletingArticle: false,
  deleteArticleError: null,
  deleteArticleSuccess: false,
  
  // Trạng thái xóa nhiều bài viết
  isDeletingMultipleArticles: false,
  deleteMultipleArticlesError: null,
  deleteMultipleArticlesSuccess: false
}

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setSelectedArticle: (state, action: PayloadAction<Article>) => {
      state.selectedArticle = action.payload;
    },
    clearSelectedArticle: (state) => {
      state.selectedArticle = null;
    },
    setSelectedArticleIds: (state, action: PayloadAction<number[]>) => {
      state.selectedArticleIds = action.payload;
    },
    addSelectedArticleId: (state, action: PayloadAction<number>) => {
      if (!state.selectedArticleIds.includes(action.payload)) {
        state.selectedArticleIds.push(action.payload);
      }
    },
    removeSelectedArticleId: (state, action: PayloadAction<number>) => {
      state.selectedArticleIds = state.selectedArticleIds.filter(id => id !== action.payload);
    },
    clearSelectedArticles: (state) => {
      state.selectedArticleIds = [];
    },
    selectAllArticles: (state) => {
      state.selectedArticleIds = state.articles.map(article => article.id);
    },
    // Xóa thông báo lỗi
    clearArticleError: (state) => {
      state.error = null;
    },
    // Xóa các trạng thái tạo bài viết
    clearCreateArticleState: (state) => {
      state.createArticleError = null;
      state.createArticleSuccess = false;
    },
    // Xóa các trạng thái cập nhật bài viết
    clearUpdateArticleState: (state) => {
      state.updateArticleError = null;
      state.updateArticleSuccess = false;
    },
    // Xóa các trạng thái duyệt bài viết
    clearApproveArticleState: (state) => {
      state.approveArticleError = null;
      state.approveArticleSuccess = false;
    },
    // Xóa các trạng thái từ chối bài viết
    clearRejectArticleState: (state) => {
      state.rejectArticleError = null;
      state.rejectArticleSuccess = false;
    },
    // Xóa các trạng thái xóa bài viết
    clearDeleteArticleState: (state) => {
      state.deleteArticleError = null;
      state.deleteArticleSuccess = false;
    },
    // Xóa các trạng thái xóa nhiều bài viết
    clearDeleteMultipleArticlesState: (state) => {
      state.deleteMultipleArticlesError = null;
      state.deleteMultipleArticlesSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý lấy danh sách bài viết
      .addCase(handleGetArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Xử lý nhiều dạng dữ liệu trả về từ API
        if (action.payload?.articles) {
          state.articles = action.payload.articles;
          state.totalArticles = action.payload.totalArticles || action.payload.articles.length;
          state.currentPage = action.payload.currentPage || 1;
          state.totalPages = action.payload.totalPages || 1;
        } else if (Array.isArray(action.payload)) {
          state.articles = action.payload;
          state.totalArticles = action.payload.length;
          state.currentPage = 1;
          state.totalPages = 1;
        }
      })
      .addCase(handleGetArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy danh sách bài viết đã đăng
      .addCase(handleGetPostedArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetPostedArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload;
      })
      .addCase(handleGetPostedArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy chi tiết bài viết theo ID
      .addCase(handleGetArticleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedArticle = action.payload;
      })
      .addCase(handleGetArticleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy chi tiết bài viết theo slug
      .addCase(handleGetArticleBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticleBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedArticle = action.payload;
      })
      .addCase(handleGetArticleBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy bài viết được xem nhiều nhất
      .addCase(handleGetMostViewedArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetMostViewedArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mostViewedArticles = action.payload;
      })
      .addCase(handleGetMostViewedArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy bài viết theo danh mục
      .addCase(handleGetArticlesByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticlesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredArticles = action.payload;
      })
      .addCase(handleGetArticlesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy bài viết theo tác giả
      .addCase(handleGetArticlesByAuthor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticlesByAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredArticles = action.payload;
      })
      .addCase(handleGetArticlesByAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy bài viết được thích nhiều nhất
      .addCase(handleGetMostLikedArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetMostLikedArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mostLikedArticles = action.payload;
      })
      .addCase(handleGetMostLikedArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy bài viết theo trạng thái
      .addCase(handleGetArticlesByStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticlesByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredArticles = action.payload;
      })
      .addCase(handleGetArticlesByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy bài viết theo tag
      .addCase(handleGetArticlesByTag.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticlesByTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredArticles = action.payload;
      })
      .addCase(handleGetArticlesByTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy bài viết theo khoảng thời gian
      .addCase(handleGetArticlesByDateRange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticlesByDateRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredArticles = action.payload;
      })
      .addCase(handleGetArticlesByDateRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy bài viết liên quan
      .addCase(handleGetRelatedArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetRelatedArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.relatedArticles = action.payload;
      })
      .addCase(handleGetRelatedArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý lấy thống kê bài viết
      .addCase(handleGetStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statistics = action.payload;
      })
      .addCase(handleGetStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý tìm kiếm bài viết
      .addCase(handleSearchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleSearchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredArticles = action.payload;
      })
      .addCase(handleSearchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Xử lý tạo bài viết mới
      .addCase(handleCreateArticle.pending, (state) => {
        state.isCreatingArticle = true;
        state.createArticleError = null;
        state.createArticleSuccess = false;
      })
      .addCase(handleCreateArticle.fulfilled, (state, action) => {
        state.isCreatingArticle = false;
        state.createArticleSuccess = true;
        state.articles = [...state.articles, action.payload];
        state.totalArticles += 1;
      })
      .addCase(handleCreateArticle.rejected, (state, action) => {
        state.isCreatingArticle = false;
        state.createArticleError = action.payload as string;
        state.createArticleSuccess = false;
      })
      
      // Xử lý cập nhật bài viết
      .addCase(handleUpdateArticle.pending, (state) => {
        state.isUpdatingArticle = true;
        state.updateArticleError = null;
        state.updateArticleSuccess = false;
      })
      .addCase(handleUpdateArticle.fulfilled, (state, action) => {
        state.isUpdatingArticle = false;
        state.updateArticleSuccess = true;
        state.articles = state.articles.map(article => 
          article.id === action.payload.id ? action.payload : article
        );
        if (state.selectedArticle?.id === action.payload.id) {
          state.selectedArticle = action.payload;
        }
      })
      .addCase(handleUpdateArticle.rejected, (state, action) => {
        state.isUpdatingArticle = false;
        state.updateArticleError = action.payload as string;
        state.updateArticleSuccess = false;
      })
      
      // Xử lý duyệt bài viết
      .addCase(handleApproveArticle.pending, (state) => {
        state.isApprovingArticle = true;
        state.approveArticleError = null;
        state.approveArticleSuccess = false;
      })
      .addCase(handleApproveArticle.fulfilled, (state, action) => {
        state.isApprovingArticle = false;
        state.approveArticleSuccess = true;
        state.articles = state.articles.map(article => 
          article.id === action.payload.id ? action.payload : article
        );
        if (state.selectedArticle?.id === action.payload.id) {
          state.selectedArticle = action.payload;
        }
      })
      .addCase(handleApproveArticle.rejected, (state, action) => {
        state.isApprovingArticle = false;
        state.approveArticleError = action.payload as string;
        state.approveArticleSuccess = false;
      })
      
      // Xử lý từ chối bài viết
      .addCase(handleRejectArticle.pending, (state) => {
        state.isRejectingArticle = true;
        state.rejectArticleError = null;
        state.rejectArticleSuccess = false;
      })
      .addCase(handleRejectArticle.fulfilled, (state, action) => {
        state.isRejectingArticle = false;
        state.rejectArticleSuccess = true;
        state.articles = state.articles.map(article => 
          article.id === action.payload.id ? action.payload : article
        );
        if (state.selectedArticle?.id === action.payload.id) {
          state.selectedArticle = action.payload;
        }
      })
      .addCase(handleRejectArticle.rejected, (state, action) => {
        state.isRejectingArticle = false;
        state.rejectArticleError = action.payload as string;
        state.rejectArticleSuccess = false;
      })
      
      // Xử lý xóa bài viết
      .addCase(handleDeleteArticle.pending, (state) => {
        state.isDeletingArticle = true;
        state.deleteArticleError = null;
        state.deleteArticleSuccess = false;
      })
      .addCase(handleDeleteArticle.fulfilled, (state, action) => {
        state.isDeletingArticle = false;
        state.deleteArticleSuccess = true;
        state.articles = state.articles.filter(article => article.id !== action.payload);
        state.totalArticles -= 1;
        // Xóa khỏi danh sách đã chọn nếu có
        const index = state.selectedArticleIds.indexOf(action.payload);
        if (index !== -1) {
          state.selectedArticleIds.splice(index, 1);
        }
      })
      .addCase(handleDeleteArticle.rejected, (state, action) => {
        state.isDeletingArticle = false;
        state.deleteArticleError = action.payload as string;
        state.deleteArticleSuccess = false;
      })
      
      // Xử lý xóa nhiều bài viết
      .addCase(handleDeleteMultipleArticles.pending, (state) => {
        state.isDeletingMultipleArticles = true;
        state.deleteMultipleArticlesError = null;
        state.deleteMultipleArticlesSuccess = false;
      })
      .addCase(handleDeleteMultipleArticles.fulfilled, (state, action) => {
        state.isDeletingMultipleArticles = false;
        state.deleteMultipleArticlesSuccess = true;
        
        // Xóa các bài viết có id trong danh sách id đã xóa
        const deletedIds = action.payload as number[];
        state.articles = state.articles.filter(article => !deletedIds.includes(article.id));
        state.totalArticles -= deletedIds.length;
        
        // Xóa khỏi danh sách đã chọn
        state.selectedArticleIds = state.selectedArticleIds.filter(id => !deletedIds.includes(id));
      })
      .addCase(handleDeleteMultipleArticles.rejected, (state, action) => {
        state.isDeletingMultipleArticles = false;
        state.deleteMultipleArticlesError = action.payload as string;
        state.deleteMultipleArticlesSuccess = false;
      });
  }
});

// Export actions
export const {
  setSelectedArticle,
  clearSelectedArticle,
  setSelectedArticleIds,
  addSelectedArticleId,
  removeSelectedArticleId,
  clearSelectedArticles,
  selectAllArticles,
  clearArticleError,
  clearCreateArticleState,
  clearUpdateArticleState,
  clearApproveArticleState,
  clearRejectArticleState,
  clearDeleteArticleState,
  clearDeleteMultipleArticlesState
} = articleSlice.actions;

// Export selectors
export const selectArticles = (state: RootState) => state.article.articles;
export const selectFilteredArticles = (state: RootState) => state.article.filteredArticles;
export const selectSelectedArticle = (state: RootState) => state.article.selectedArticle;
export const selectRelatedArticles = (state: RootState) => state.article.relatedArticles;
export const selectMostViewedArticles = (state: RootState) => state.article.mostViewedArticles;
export const selectMostLikedArticles = (state: RootState) => state.article.mostLikedArticles;
export const selectStatistics = (state: RootState) => state.article.statistics;
export const selectTotalArticles = (state: RootState) => state.article.totalArticles;
export const selectCurrentPage = (state: RootState) => state.article.currentPage;
export const selectTotalPages = (state: RootState) => state.article.totalPages;
export const selectSelectedArticleIds = (state: RootState) => state.article.selectedArticleIds;
export const selectIsLoading = (state: RootState) => state.article.isLoading;
export const selectError = (state: RootState) => state.article.error;

// Export selectors cho trạng thái tạo bài viết
export const selectIsCreatingArticle = (state: RootState) => state.article.isCreatingArticle;
export const selectCreateArticleError = (state: RootState) => state.article.createArticleError;
export const selectCreateArticleSuccess = (state: RootState) => state.article.createArticleSuccess;

// Export selectors cho trạng thái cập nhật bài viết
export const selectIsUpdatingArticle = (state: RootState) => state.article.isUpdatingArticle;
export const selectUpdateArticleError = (state: RootState) => state.article.updateArticleError;
export const selectUpdateArticleSuccess = (state: RootState) => state.article.updateArticleSuccess;

// Export selectors cho trạng thái duyệt bài viết
export const selectIsApprovingArticle = (state: RootState) => state.article.isApprovingArticle;
export const selectApproveArticleError = (state: RootState) => state.article.approveArticleError;
export const selectApproveArticleSuccess = (state: RootState) => state.article.approveArticleSuccess;

// Export selectors cho trạng thái từ chối bài viết
export const selectIsRejectingArticle = (state: RootState) => state.article.isRejectingArticle;
export const selectRejectArticleError = (state: RootState) => state.article.rejectArticleError;
export const selectRejectArticleSuccess = (state: RootState) => state.article.rejectArticleSuccess;

// Export selectors cho trạng thái xóa bài viết
export const selectIsDeletingArticle = (state: RootState) => state.article.isDeletingArticle;
export const selectDeleteArticleError = (state: RootState) => state.article.deleteArticleError;
export const selectDeleteArticleSuccess = (state: RootState) => state.article.deleteArticleSuccess;

// Export selectors cho trạng thái xóa nhiều bài viết
export const selectIsDeletingMultipleArticles = (state: RootState) => state.article.isDeletingMultipleArticles;
export const selectDeleteMultipleArticlesError = (state: RootState) => state.article.deleteMultipleArticlesError;
export const selectDeleteMultipleArticlesSuccess = (state: RootState) => state.article.deleteMultipleArticlesSuccess;

export default articleSlice.reducer;
