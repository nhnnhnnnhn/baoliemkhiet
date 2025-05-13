import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Comment, GetCommentsResponse } from '@/src/apis/comment'
import { RootState } from '@/src/store'
import {
  handleGetComments,
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment
} from './commentThunk'

interface CommentState {
  comments: Comment[]
  totalComments: number
  currentPage: number
  totalPages: number
  isLoading: boolean
  error: string | null
  // Create comment states
  isCreatingComment: boolean
  createCommentError: string | null
  createCommentSuccess: boolean
  // Update comment states
  isUpdatingComment: boolean
  updateCommentError: string | null
  updateCommentSuccess: boolean
  // Delete comment states
  isDeletingComment: boolean
  deleteCommentError: string | null
  deleteCommentSuccess: boolean
}

const initialState: CommentState = {
  comments: [],
  totalComments: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  // Create comment states
  isCreatingComment: false,
  createCommentError: null,
  createCommentSuccess: false,
  // Update comment states
  isUpdatingComment: false,
  updateCommentError: null,
  updateCommentSuccess: false,
  // Delete comment states
  isDeletingComment: false,
  deleteCommentError: null,
  deleteCommentSuccess: false
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    resetCommentState: (state) => {
      return initialState;
    },
    clearCommentError: (state) => {
      state.error = null
    },
    clearCreateCommentState: (state) => {
      state.createCommentError = null
      state.createCommentSuccess = false
      state.isCreatingComment = false
    },
    clearUpdateCommentState: (state) => {
      state.updateCommentError = null
      state.updateCommentSuccess = false
      state.isUpdatingComment = false
    },
    clearDeleteCommentState: (state) => {
      state.deleteCommentError = null
      state.deleteCommentSuccess = false
      state.isDeletingComment = false
    }
  },
  extraReducers: (builder) => {
    builder
      // Get comments
      .addCase(handleGetComments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(handleGetComments.fulfilled, (state, action: PayloadAction<GetCommentsResponse>) => {
        state.isLoading = false
        state.comments = action.payload.comments
        state.totalComments = action.payload.totalComments
        state.currentPage = action.payload.currentPage
        state.totalPages = action.payload.totalPages
        state.error = null
      })
      .addCase(handleGetComments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Failed to fetch comments'
        state.comments = []
      })

      // Create comment
      .addCase(handleCreateComment.pending, (state) => {
        state.isCreatingComment = true
        state.createCommentError = null
        state.createCommentSuccess = false
      })
      .addCase(handleCreateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.isCreatingComment = false
        state.createCommentSuccess = true
        state.createCommentError = null
        
        // Only add to displayed comments if it's approved
        if (action.payload.status === 'APPROVED') {
          state.comments.unshift(action.payload)
          state.totalComments += 1
        }
      })
      .addCase(handleCreateComment.rejected, (state, action) => {
        state.isCreatingComment = false
        state.createCommentError = action.payload as string || 'Failed to create comment'
        state.createCommentSuccess = false
      })

      // Update comment
      .addCase(handleUpdateComment.pending, (state) => {
        state.isUpdatingComment = true
        state.updateCommentError = null
        state.updateCommentSuccess = false
      })
      .addCase(handleUpdateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.isUpdatingComment = false
        state.updateCommentSuccess = true
        state.updateCommentError = null
        
        // Update comment in state array only if it exists and is approved
        if (action.payload.status === 'APPROVED') {
          state.comments = state.comments.map(comment =>
            comment.id === action.payload.id ? action.payload : comment
          )
        } else {
          // If comment status changed to something other than APPROVED, remove it
          state.comments = state.comments.filter(comment => comment.id !== action.payload.id)
          state.totalComments -= 1
        }
      })
      .addCase(handleUpdateComment.rejected, (state, action) => {
        state.isUpdatingComment = false
        state.updateCommentError = action.payload as string || 'Failed to update comment'
        state.updateCommentSuccess = false
      })

      // Delete comment
      .addCase(handleDeleteComment.pending, (state) => {
        state.isDeletingComment = true
        state.deleteCommentError = null
        state.deleteCommentSuccess = false
      })
      .addCase(handleDeleteComment.fulfilled, (state, action: PayloadAction<number>) => {
        state.isDeletingComment = false
        state.deleteCommentSuccess = true
        state.deleteCommentError = null
        state.comments = state.comments.filter(comment => comment.id !== action.payload)
        state.totalComments = Math.max(0, state.totalComments - 1)
      })
      .addCase(handleDeleteComment.rejected, (state, action) => {
        state.isDeletingComment = false
        state.deleteCommentError = action.payload as string || 'Failed to delete comment'
        state.deleteCommentSuccess = false
      })
  }
})

export const {
  resetCommentState,
  clearCommentError,
  clearCreateCommentState,
  clearUpdateCommentState,
  clearDeleteCommentState
} = commentSlice.actions

// Selectors
export const selectComments = (state: RootState) => state.comment.comments
export const selectCommentsLoading = (state: RootState) => state.comment.isLoading
export const selectCommentError = (state: RootState) => state.comment.error
export const selectCommentPagination = (state: RootState) => ({
  totalComments: state.comment.totalComments,
  currentPage: state.comment.currentPage,
  totalPages: state.comment.totalPages
})

// Create comment selectors
export const selectCreateCommentLoading = (state: RootState) => state.comment.isCreatingComment
export const selectCreateCommentError = (state: RootState) => state.comment.createCommentError
export const selectCreateCommentSuccess = (state: RootState) => state.comment.createCommentSuccess

// Update comment selectors
export const selectUpdateCommentLoading = (state: RootState) => state.comment.isUpdatingComment
export const selectUpdateCommentError = (state: RootState) => state.comment.updateCommentError
export const selectUpdateCommentSuccess = (state: RootState) => state.comment.updateCommentSuccess

// Delete comment selectors
export const selectDeleteCommentLoading = (state: RootState) => state.comment.isDeletingComment
export const selectDeleteCommentError = (state: RootState) => state.comment.deleteCommentError
export const selectDeleteCommentSuccess = (state: RootState) => state.comment.deleteCommentSuccess

export default commentSlice.reducer