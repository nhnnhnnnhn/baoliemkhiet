import { createAsyncThunk } from "@reduxjs/toolkit";
import likeApi, { Like } from "@/src/apis/like";

// Get likes for an article
export const handleGetLikes = createAsyncThunk(
  "like/getLikes",
  async (articleId: number) => {
    const response = await likeApi.getLikes(articleId);
    return response;
  }
);

// Create like for an article
export const handleCreateLike = createAsyncThunk(
  "like/createLike",
  async (articleId: number) => {
    const response = await likeApi.createLike(articleId);
    return response;
  }
);

// Delete like for an article
export const handleDeleteLike = createAsyncThunk(
  "like/deleteLike",
  async ({ articleId, userId }: { articleId: number; userId: number }) => {
    await likeApi.deleteLike(articleId);
    return userId; // Return userId to remove from state
  }
);
