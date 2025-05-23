import axiosClient from './axiosClient';

export interface Follow {
  id: number;
  followerId: number;
  journalistId: number;
  createdAt: string;
  follower?: {
    id: number;
    fullname: string;
    email: string;
    avatar?: string;
  };
  journalist?: {
    id: number;
    fullname: string;
    email: string;
    avatar?: string;
  };
}

export interface FollowResponse {
  id: number;
  followerId: number;
  journalistId: number;
  createdAt: string;
}

export interface FollowCheckResponse {
  isFollowing: boolean;
}

const followApi = {
  // Follow a journalist
  followJournalist: async (journalistId: number): Promise<FollowResponse> => {
    try {
      console.log(`[API] Following journalist ${journalistId}`);
      const response = await axiosClient.post<FollowResponse>('/follows', { journalistId });
      console.log('[API] Follow response:', response);
      return response as unknown as FollowResponse;
    } catch (error) {
      console.error('[API] Error following journalist:', error);
      throw error;
    }
  },

  // Unfollow a journalist
  unfollowJournalist: async (journalistId: number): Promise<void> => {
    try {
      console.log(`[API] Unfollowing journalist ${journalistId}`);
      await axiosClient.delete(`/follows/${journalistId}`);
      console.log('[API] Unfollow successful');
    } catch (error) {
      console.error('[API] Error unfollowing journalist:', error);
      throw error;
    }
  },

  // Delete a follower (by journalist)
  deleteFollowerByJournalist: async (followerId: number): Promise<void> => {
    try {
      console.log(`[API] Deleting follower ${followerId}`);
      await axiosClient.delete(`/follows/by-journalist/${followerId}`);
      console.log('[API] Delete follower successful');
    } catch (error) {
      console.error('[API] Error deleting follower:', error);
      throw error;
    }
  },

  // Get list of followers
  getFollowers: async (userId: number): Promise<Follow[]> => {
    try {
      console.log('[API] Fetching followers for user:', userId);
      const response = await axiosClient.get<Follow[]>(`/follows/followers/${userId}`);
      console.log('[API] Followers fetched:', response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('[API] Error fetching followers:', error);
      throw error;
    }
  },

  // Get list of journalists being followed
  getFollowing: async (userId: number): Promise<Follow[]> => {
    try {
      console.log('[API] Fetching following for user:', userId);
      const response = await axiosClient.get<Follow[]>(`/follows/following/${userId}`);
      console.log('[API] Following fetched:', response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('[API] Error fetching following:', error);
      throw error;
    }
  },

  // Check if following a journalist
  checkFollowing: async (journalistId: number): Promise<boolean> => {
    try {
      console.log(`[API] Checking if following journalist ${journalistId}`);
      const response = await axiosClient.get<FollowCheckResponse>(`/follows/${journalistId}/check`);
      console.log('[API] Check following response:', response);
      if (response && typeof response === 'object' && 'isFollowing' in response) {
        return Boolean(response.isFollowing);
      }
      return false;
    } catch (error) {
      console.error('[API] Error checking follow status:', error);
      throw error;
    }
  }
};

export default followApi; 