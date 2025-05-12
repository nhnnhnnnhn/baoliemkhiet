import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/src/store';
import { handleGetArticles, handleGetArticleById, handleUpdateArticle, handleDeleteArticle } from './articleThunk';
import { Article as ApiArticle } from '@/src/apis/article';

// Use the Article type from API for consistency
export type Article = ApiArticle;

interface ArticleState {
  articles: Article[];
  totalArticles: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  selectedArticle: Article | null;
}

const initialState: ArticleState = {
  articles: [],
  totalArticles: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  selectedArticle: null
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle get all articles
      .addCase(handleGetArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.totalArticles = action.payload.pagination.total;
        state.currentPage = action.payload.pagination.current_page;
        state.totalPages = action.payload.pagination.total_pages;
      })
      .addCase(handleGetArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle get article by id
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

      // Handle update article
      .addCase(handleUpdateArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleUpdateArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update article in list if exists
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      })
      .addCase(handleUpdateArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle delete article
      .addCase(handleDeleteArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleDeleteArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = state.articles.filter(article => article.id !== action.payload);
      })
      .addCase(handleDeleteArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Export actions
export const { clearError } = articleSlice.actions;

// Export selectors
export const selectArticles = (state: RootState) => state.article.articles;
export const selectTotalArticles = (state: RootState) => state.article.totalArticles;
export const selectCurrentPage = (state: RootState) => state.article.currentPage;
export const selectTotalPages = (state: RootState) => state.article.totalPages;
export const selectIsLoading = (state: RootState) => state.article.isLoading;
export const selectError = (state: RootState) => state.article.error;
export const selectSelectedArticle = (state: RootState) => state.article.selectedArticle;

// Export reducer
export default articleSlice.reducer;