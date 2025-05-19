import { createSlice } from "@reduxjs/toolkit";
import {
  handleGetLikes,
  handleCreateLike,
  handleDeleteLike,
} from "./likeThunk";
import type { RootState } from "@/src/store";

interface LikeState {
  likes: number[];
  totalLikes: number;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;
}

const initialState: LikeState = {
  likes: [],
  totalLikes: 0,
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    clearActionState: (state) => {
      state.actionLoading = false;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Likes
      .addCase(handleGetLikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGetLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.likes = action.payload.likes.map((like) => like.userId);
        state.totalLikes = action.payload.totalLikes;
      })
      .addCase(handleGetLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch likes";
      })
      // Create Like
      .addCase(handleCreateLike.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(handleCreateLike.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.likes.push(action.payload.userId);
        state.totalLikes += 1;
      })
      .addCase(handleCreateLike.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.error.message || "Failed to create like";
      })
      // Delete Like
      .addCase(handleDeleteLike.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(handleDeleteLike.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.likes = state.likes.filter((userId) => userId !== action.payload);
        state.totalLikes -= 1;
      })
      .addCase(handleDeleteLike.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.error.message || "Failed to delete like";
      });
  },
});

export const { clearActionState } = likeSlice.actions;

export const selectLikes = (state: RootState) => state.like.likes;
export const selectTotalLikes = (state: RootState) => state.like.totalLikes;
export const selectLikesLoading = (state: RootState) => state.like.loading;
export const selectLikesError = (state: RootState) => state.like.error;
export const selectLikeActionLoading = (state: RootState) =>
  state.like.actionLoading;
export const selectLikeActionError = (state: RootState) =>
  state.like.actionError;

export default likeSlice.reducer;
