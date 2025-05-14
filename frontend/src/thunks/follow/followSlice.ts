import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Follow } from '../../apis/follow';
import { RootState } from '../../store';
import {
  handleFollowJournalist,
  handleUnfollowJournalist,
  handleGetFollowers,
  handleGetFollowing,
  handleCheckFollowing
} from './followThunk';

interface FollowState {
  // Followers and following lists
  followers: Follow[];
  following: Follow[];
  
  // Follow status for specific journalists
  followStatus: Record<number, boolean>;
  
  // Loading states
  isFollowing: boolean;
  isUnfollowing: boolean;
  isLoadingFollowers: boolean;
  isLoadingFollowing: boolean;
  isCheckingFollow: boolean;
  
  // Error states
  followError: string | null;
  unfollowError: string | null;
  followersError: string | null;
  followingError: string | null;
  checkFollowError: string | null;
}

const initialState: FollowState = {
  followers: [],
  following: [],
  followStatus: {},
  
  isFollowing: false,
  isUnfollowing: false,
  isLoadingFollowers: false,
  isLoadingFollowing: false,
  isCheckingFollow: false,
  
  followError: null,
  unfollowError: null,
  followersError: null,
  followingError: null,
  checkFollowError: null,
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    clearFollowErrors: (state) => {
      state.followError = null;
      state.unfollowError = null;
      state.followersError = null;
      state.followingError = null;
      state.checkFollowError = null;
    },
    setFollowStatus: (state, action: PayloadAction<{ journalistId: number, isFollowing: boolean }>) => {
      const { journalistId, isFollowing } = action.payload;
      state.followStatus[journalistId] = isFollowing;
    }
  },
  extraReducers: (builder) => {
    // Handle follow journalist
    builder
      .addCase(handleFollowJournalist.pending, (state) => {
        state.isFollowing = true;
        state.followError = null;
      })
      .addCase(handleFollowJournalist.fulfilled, (state, action) => {
        state.isFollowing = false;
        if (action.payload) {
          state.followStatus[action.payload.journalistId] = true;
          // Add to following list if not already there
          if (!state.following.some(f => f.journalistId === action.payload.journalistId)) {
            state.following.push(action.payload as Follow);
          }
        }
      })
      .addCase(handleFollowJournalist.rejected, (state, action) => {
        state.isFollowing = false;
        state.followError = action.payload as string || 'Failed to follow journalist';
      })
      
    // Handle unfollow journalist
      .addCase(handleUnfollowJournalist.pending, (state) => {
        state.isUnfollowing = true;
        state.unfollowError = null;
      })
      .addCase(handleUnfollowJournalist.fulfilled, (state, action) => {
        state.isUnfollowing = false;
        const journalistId = action.payload as number;
        state.followStatus[journalistId] = false;
        // Remove from following list
        state.following = state.following.filter(f => f.journalistId !== journalistId);
      })
      .addCase(handleUnfollowJournalist.rejected, (state, action) => {
        state.isUnfollowing = false;
        state.unfollowError = action.payload as string || 'Failed to unfollow journalist';
      })
      
    // Handle get followers
      .addCase(handleGetFollowers.pending, (state) => {
        state.isLoadingFollowers = true;
        state.followersError = null;
      })
      .addCase(handleGetFollowers.fulfilled, (state, action) => {
        state.isLoadingFollowers = false;
        state.followers = action.payload as Follow[];
      })
      .addCase(handleGetFollowers.rejected, (state, action) => {
        state.isLoadingFollowers = false;
        state.followersError = action.payload as string || 'Failed to fetch followers';
      })
      
    // Handle get following
      .addCase(handleGetFollowing.pending, (state) => {
        state.isLoadingFollowing = true;
        state.followingError = null;
      })
      .addCase(handleGetFollowing.fulfilled, (state, action) => {
        state.isLoadingFollowing = false;
        state.following = action.payload as Follow[];
        // Update follow status for each journalist being followed
        action.payload.forEach((follow: Follow) => {
          state.followStatus[follow.journalistId] = true;
        });
      })
      .addCase(handleGetFollowing.rejected, (state, action) => {
        state.isLoadingFollowing = false;
        state.followingError = action.payload as string || 'Failed to fetch following';
      })
      
    // Handle check following
      .addCase(handleCheckFollowing.pending, (state) => {
        state.isCheckingFollow = true;
        state.checkFollowError = null;
      })
      .addCase(handleCheckFollowing.fulfilled, (state, action) => {
        state.isCheckingFollow = false;
        const { journalistId, isFollowing } = action.payload as { journalistId: number, isFollowing: boolean };
        state.followStatus[journalistId] = isFollowing;
      })
      .addCase(handleCheckFollowing.rejected, (state, action) => {
        state.isCheckingFollow = false;
        state.checkFollowError = action.payload as string || 'Failed to check follow status';
      });
  },
});

// Export actions
export const { clearFollowErrors, setFollowStatus } = followSlice.actions;

// Export selectors
export const selectFollowers = (state: RootState) => state.follow.followers;
export const selectFollowing = (state: RootState) => state.follow.following;
export const selectFollowStatus = (state: RootState, journalistId: number) => 
  state.follow.followStatus[journalistId] || false;
export const selectIsFollowing = (state: RootState) => state.follow.isFollowing;
export const selectIsUnfollowing = (state: RootState) => state.follow.isUnfollowing;
export const selectIsLoadingFollowers = (state: RootState) => state.follow.isLoadingFollowers;
export const selectIsLoadingFollowing = (state: RootState) => state.follow.isLoadingFollowing;
export const selectFollowError = (state: RootState) => state.follow.followError;
export const selectUnfollowError = (state: RootState) => state.follow.unfollowError;

// Export reducer
export default followSlice.reducer; 