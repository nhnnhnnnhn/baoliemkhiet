import axiosClient from "./axiosClient";

export interface Like {
  id: number;
  articleId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullname: string;
    email: string;
    avatar?: string;
  };
}

export interface GetLikesResponse {
  likes: Like[];
  totalLikes: number;
}

const likeApi = {
  // Get likes for an article
  getLikes: async (articleId: number): Promise<GetLikesResponse> => {
    try {
      console.log(`Fetching likes for article ${articleId}`);

      const response = await axiosClient.get(`/likes/${articleId}`);
      console.log("Get likes response:", response);

      return response.data || response;
    } catch (error: any) {
      console.error("Like API error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        error,
      });

      if (error.response?.status === 404) {
        console.log("No likes found, returning empty response");
        return {
          likes: [],
          totalLikes: 0,
        };
      }

      throw error;
    }
  },

  // Create like for an article
  createLike: async (articleId: number): Promise<Like> => {
    try {
      console.log(`Creating like for article ${articleId}`);

      const response = await axiosClient.post(`/likes/${articleId}`);
      console.log("Create like response:", response);

      return response.data || response;
    } catch (error) {
      console.error("Create like error:", error);
      throw error;
    }
  },

  // Delete like for an article
  deleteLike: async (articleId: number): Promise<void> => {
    try {
      console.log(`Deleting like for article ${articleId}`);

      const response = await axiosClient.delete(`/likes/${articleId}`);
      console.log("Delete like response:", response);

      return;
    } catch (error) {
      console.error("Delete like error:", error);
      throw error;
    }
  },
};

export default likeApi;
