import { createAsyncThunk } from '@reduxjs/toolkit';
import followApi, { Follow, FollowResponse } from '../../apis/follow';

export const handleFollowJournalist = createAsyncThunk(
  'follow/followJournalist',
  async (journalistId: number, { rejectWithValue }) => {
    try {
      const response = await followApi.followJournalist(journalistId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow journalist');
    }
  }
);

export const handleUnfollowJournalist = createAsyncThunk(
  'follow/unfollowJournalist',
  async (journalistId: number, { rejectWithValue }) => {
    try {
      await followApi.unfollowJournalist(journalistId);
      return journalistId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow journalist');
    }
  }
);

export const handleGetFollowers = createAsyncThunk(
  'follow/getFollowers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await followApi.getFollowers();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

export const handleGetFollowing = createAsyncThunk(
  'follow/getFollowing',
  async (_, { rejectWithValue }) => {
    try {
      const response = await followApi.getFollowing();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

export const handleCheckFollowing = createAsyncThunk(
  'follow/checkFollowing',
  async (journalistId: number, { rejectWithValue }) => {
    try {
      const isFollowing = await followApi.checkFollowing(journalistId);
      return { journalistId, isFollowing };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check follow status');
    }
  }
); 