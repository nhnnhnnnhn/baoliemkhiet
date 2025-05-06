import axiosClient from "./axiosClient"

export interface User {
  id: number
  email: string
  fullname: string
  role: "ADMIN" | "JOURNALIST" | "USER" | "EDITOR"
  avatar: string | null
  bio: string | null
  is_online: boolean
  created_at: string
  updated_at: string
  articles?: Array<{
    id: number
    title: string
    status: string
    publishedAt?: string
    createdAt?: string
  }>
  followers?: Array<{
    id: number
    follower: {
      id: number
      fullname: string
      avatar: string | null
    }
  }>
  Follow?: Array<{
    id: number
    journalist: {
      id: number
      fullname: string
      avatar: string | null
    }
  }>
}

export interface GetUsersResponse {
  users: User[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
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
    return axiosClient.get("/users", { params })
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
    return axiosClient.post("/users/admin", {
      ...data,
      role: "ADMIN",
    })
  },

  createUser: async (data: {
    email: string
    password: string
    fullname: string
    role?: string
    avatar?: string | null
    bio?: string | null
    phone?: string | null
    address?: string | null
    status?: string
  }): Promise<User> => {
    return axiosClient.post("/users", data)
  },
}

export default userApi
