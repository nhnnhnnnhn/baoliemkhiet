import axiosClient from './axiosClient'

// Cập nhật interface để khớp với response từ backend
export interface Article {
  id: number
  title: string
  slug: string
  content: string
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED"
  author: {
    id: number
    fullname: string
    avatar: string | null
  }
  category: {
    id: number
    name: string
    slug: string
  }
  tags?: Array<{
    id: number
    name: string
    slug: string
  }>
  thumbnail: string | null
  views: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface GetArticlesResponse {
  data: Article[]             // Backend có thể trả về data thay vì articles
  pagination: {
    total: number
    current_page: number      // Backend có thể dùng snake_case
    per_page: number         // Backend có thể dùng per_page thay vì limit
    total_pages: number      // Backend có thể dùng snake_case
  }
}

export interface GetArticlesParams {
  status?: string
  search?: string
  page?: number
  per_page?: number          // Đổi limit thành per_page để khớp với backend
  category_id?: number       // Đổi thành snake_case
  author_id?: number         // Đổi thành snake_case
}

const articleApi = {
  getArticles: async (params: GetArticlesParams): Promise<GetArticlesResponse> => {
    try {
      // Log params trước khi gọi API
      console.log('Request params:', params);

      const response = await axiosClient.get('/articles/get', { params });
      
      // Log response để debug
      console.log('Raw API response:', response);

      // Xử lý response từ axios
      const articles = response.data;
      if (Array.isArray(articles)) {
        return {
          data: articles,
          pagination: {
            total: articles.length,
            current_page: params.page || 1,
            per_page: params.per_page || 10,
            total_pages: Math.ceil(articles.length / (params.per_page || 10))
          }
        };
      }

      throw new Error('Invalid response format');
      
      throw new Error('Invalid response format');

    } catch (error: any) {
      console.error('Articles API error:', error);
      throw error;
    }
  },

  getArticleById: async (id: number): Promise<Article> => {
    try {
      const response = await axiosClient.get(`/articles/${id}`);
      console.log('Article by ID response:', response);
      
      const article = response.data;
      if (article && typeof article === 'object' && 'id' in article) {
        return article;
      }
      
      throw new Error('Invalid article response format');
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  updateArticle: async (id: number, data: Partial<Article>): Promise<Article> => {
    try {
      const response = await axiosClient.put(`/articles/${id}`, data);
      console.log('Update response:', response);
      
      const article = response.data;
      if (article && typeof article === 'object' && 'id' in article) {
        return article;
      }
      
      throw new Error('Invalid article response format');
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  deleteArticle: async (id: number): Promise<void> => {
    try {
      await axiosClient.delete(`/articles/${id}`);
      console.log('Article deleted successfully');
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }
}

export default articleApi