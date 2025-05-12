import axiosClient from './axiosClient'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  created_at: string
  updated_at: string
  count?: number // Số lượng bài viết theo category
}

export interface CreateCategoryPayload {
  name: string
  slug?: string // Có thể tự động tạo từ backend
  description?: string
  image?: string
}

export interface EditCategoryPayload {
  name?: string
  slug?: string
  description?: string
  image?: string
}

export interface GetCategoriesResponse {
  categories: Category[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  // Thêm các trường dự phòng trong trường hợp API trả về khác
  data?: Category[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface GetCategoriesParams {
  search?: string
  page?: number
  limit?: number
}

export interface DeleteMultipleCategoriesPayload {
  ids: number[]
}

export interface ArticlesCountResponse {
  [categoryId: string]: number
}

const categoryApi = {
  // Lấy danh sách category
  getCategories: async (params?: GetCategoriesParams): Promise<GetCategoriesResponse> => {
    return axiosClient.get('/categories/get', { params })
  },

  // Lấy thông tin category theo ID
  getCategoryById: async (id: number): Promise<Category> => {
    return axiosClient.get(`/categories/get/${id}`)
  },

  // Tạo category mới
  createCategory: async (data: CreateCategoryPayload): Promise<Category> => {
    return axiosClient.post('/categories/create', data)
  },

  // Cập nhật category
  updateCategory: async (id: number, data: EditCategoryPayload): Promise<Category> => {
    return axiosClient.patch(`/categories/edit/${id}`, data)
  },

  // Xóa category
  deleteCategory: async (id: number): Promise<void> => {
    return axiosClient.delete(`/categories/delete/${id}`)
  },

  // Xóa nhiều category
  deleteMultipleCategories: async (data: DeleteMultipleCategoriesPayload): Promise<void> => {
    return axiosClient.delete('/categories/delete-multiple', { data })
  },

  // Lấy số lượng bài viết theo category
  getArticlesCount: async (): Promise<ArticlesCountResponse> => {
    return axiosClient.get('/categories/articles-count')
  }
}

export default categoryApi
