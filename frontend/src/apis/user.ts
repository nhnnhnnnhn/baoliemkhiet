import axiosClient from './axiosClient'

export interface User {
  id: number
  email: string
  fullname: string
  role: "ADMIN" | "JOURNALIST" | "USER"
  avatar: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface GetUsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

export interface GetUsersParams {
  role?: string
  search?: string
  page?: number
  limit?: number
}

export interface CreateAdminPayload {
  email: string
  password: string
  fullname: string
  bio?: string | null
  avatar?: string | null
}

const userApi = {
  getUsers: async (params: GetUsersParams): Promise<GetUsersResponse> => {
    return axiosClient.get('/users', { params })
  },

  getUserById: async (id: number): Promise<User> => {
    return axiosClient.get(`/users/${id}`)
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    return axiosClient.put(`/users/${id}`, data)
  },

  deleteUser: async (id: number): Promise<void> => {
    return axiosClient.delete(`/users/${id}`)
  },

  createAdmin: async (data: CreateAdminPayload): Promise<User> => {
    return axiosClient.post('/users/admin', {
      ...data,
      role: "ADMIN"
    })
  }
}

export default userApi