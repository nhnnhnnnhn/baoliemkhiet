import axiosClient from './axiosClient'

export interface Tag {
  id: number
  name: string
  slug?: string
  createdAt?: string
  updatedAt?: string
  articleCount?: number
  count?: number // Số lượng bài viết theo tag
}

export interface CreateTagPayload {
  name: string
  slug?: string // Có thể tự động tạo từ backend
}

export interface UpdateTagPayload {
  name: string
}

export interface GetTagsResponse {
  tags: Tag[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  // Thêm các trường dự phòng trong trường hợp API trả về khác
  data?: Tag[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface GetTagsParams {
  search?: string
  page?: number
  limit?: number
}

const tagApi = {
  // Lấy danh sách tag
  getTags: async (params?: GetTagsParams): Promise<GetTagsResponse> => {
    return axiosClient.get('/tags', { params })
  },

  // Lấy thông tin tag theo ID
  getTagById: async (id: number): Promise<Tag> => {
    return axiosClient.get(`/tags/${id}`)
  },

  // Lấy danh sách tag của một bài viết
  getTagsByArticleId: async (articleId: number): Promise<Tag[]> => {
    return axiosClient.get(`/tags/article/${articleId}`)
  },

  // Tạo tag mới
  createTag: async (data: CreateTagPayload): Promise<Tag> => {
    return axiosClient.post('/tags', data)
  },

  // Cập nhật tag
  updateTag: async (id: number, data: UpdateTagPayload): Promise<Tag> => {
    return axiosClient.patch(`/tags/${id}`, data)
  },

  // Xóa tag
  deleteTag: async (id: number): Promise<void> => {
    return axiosClient.delete(`/tags/${id}`)
  }
}

export default tagApi
