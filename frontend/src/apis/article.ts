import axiosClient from './axiosClient'

export interface Article {
  id: number
  title: string
  content: string
  thumbnail?: string
  author_id: number
  category_id: number
  status: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'PENDING'
  view?: number
  published_at?: string
  created_at: string
  updated_at: string
  excerpt?: string
  slug?: string
  author?: {
    id: number
    name?: string
    fullname?: string
    email: string
    avatar?: string
  }
  category?: {
    id: number
    name: string
    slug: string
  }
  tags?: Array<{
    id: number
    name: string
    slug: string
  }>
}

export interface GetArticlesResponse {
  articles: Article[]
  totalArticles: number
  currentPage: number
  totalPages: number
}

export interface GetArticlesParams {
  search?: string
  page?: number
  limit?: number
  status?: string
  category_id?: number
  author_id?: number
  tag_id?: number
  startDate?: string
  endDate?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface CreateArticlePayload {
  title: string
  content: string
  thumbnail?: string
  authorId: number
  categoryId: number
  status?: 'DRAFT' | 'PUBLISHED' | 'PENDING' | 'APPROVED' | 'APPROVED'
  publishedAt?: string
  tags?: number[]
  excerpt?: string
}

export interface EditArticlePayload {
  title?: string
  content?: string
  thumbnail?: string
  authorId?: number
  categoryId?: number
  status?: 'DRAFT' | 'APPROVED' | 'PENDING' | 'REJECTED' | 'PUBLISHED'
  publishedAt?: string
  tags?: number[]
  excerpt?: string
}

export interface DeleteMultipleArticlesPayload {
  ids: number[]
}

export interface ArticleStatistics {
  totalArticles: number
  totalViews: number
  mostViewedArticles: Article[]
  mostLikedArticles: Article[]
  articlesByCategory: {
    categoryId: number
    categoryName: string
    count: number
  }[]
  articlesByStatus: {
    status: string
    count: number
  }[]
  publishedOverTime: {
    date: string
    count: number
  }[]
}

const articleApi = {
  // Lấy danh sách bài viết
  getArticles: async (params?: GetArticlesParams): Promise<GetArticlesResponse> => {
    return axiosClient.get('/articles/get', { params })
  },

  // Lấy danh sách bài viết đã đăng
  getPostedArticles: async (): Promise<Article[]> => {
    return axiosClient.get('/articles/get-posted')
  },

  // Lấy thông tin bài viết theo ID
  getArticleById: async (id: number): Promise<Article> => {
    return axiosClient.get(`/articles/get/${id}`)
  },

  // Lấy bài viết được xem nhiều nhất
  getMostViewedArticles: async (timePeriod: string): Promise<Article[]> => {
    return axiosClient.get('/articles/most-viewed', { params: { timePeriod } })
  },

  // Lấy bài viết theo danh mục
  getArticlesByCategory: async (categoryId: number): Promise<Article[]> => {
    return axiosClient.get(`/articles/get-category/${categoryId}`)
  },

  // Lấy bài viết theo tác giả
  getArticlesByAuthor: async (authorId: number): Promise<Article[]> => {
    return axiosClient.get(`/articles/get-author/${authorId}`)
  },

  // Lấy bài viết được thích nhiều nhất
  getMostLikedArticles: async (): Promise<Article[]> => {
    return axiosClient.get('/articles/most-liked')
  },

  // Lấy bài viết theo trạng thái
  getArticlesByStatus: async (status: string): Promise<Article[]> => {
    return axiosClient.get(`/articles/get-status/${status}`)
  },

  // Lấy bài viết theo tag
  getArticlesByTag: async (tagId: number): Promise<Article[]> => {
    return axiosClient.get(`/articles/get-tag/${tagId}`)
  },

  // Lấy bài viết theo khoảng thời gian
  getArticlesByDateRange: async (startDate: string, endDate: string): Promise<Article[]> => {
    return axiosClient.get('/articles/get-date-range', { params: { startDate, endDate } })
  },

  // Lấy bài viết liên quan
  getRelatedArticles: async (id: number): Promise<Article[]> => {
    return axiosClient.get(`/articles/related/${id}`)
  },

  // Lấy thống kê bài viết
  getStatistics: async (startDate: string, endDate: string): Promise<ArticleStatistics> => {
    return axiosClient.get('/articles/statistics', { params: { startDate, endDate } })
  },

  // Tìm kiếm bài viết
  searchArticles: async (keyword: string): Promise<Article[]> => {
    return axiosClient.get('/articles/search', { params: { keyword } })
  },

  // Tạo bài viết mới
  createArticle: async (data: CreateArticlePayload): Promise<Article> => {
    return axiosClient.post('/articles/create', data)
  },

  // Cập nhật bài viết
  updateArticle: async (id: number, data: EditArticlePayload): Promise<Article> => {
    return axiosClient.patch(`/articles/edit/${id}`, data)
  },

  // Duyệt bài viết
  approveArticle: async (id: number): Promise<Article> => {
    return axiosClient.patch(`/articles/approve/${id}`)
  },

  // Từ chối bài viết
  rejectArticle: async (id: number): Promise<Article> => {
    return axiosClient.patch(`/articles/reject/${id}`)
  },

  // Xóa bài viết
  deleteArticle: async (id: number): Promise<void> => {
    return axiosClient.delete(`/articles/delete/${id}`)
  },

  // Xóa nhiều bài viết
  deleteMultipleArticles: async (data: DeleteMultipleArticlesPayload): Promise<void> => {
    return axiosClient.delete('/articles/delete-multiple', { data })
  }
}

export default articleApi
