import axiosClient from './axiosClient';

interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  articles?: any[];
}

interface UserResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

const userApi = {
  async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<UserResponse> {
    return await axiosClient.get('/users', { params });
  },

  async getUserById(id: number): Promise<User> {
    return await axiosClient.get(`/users/${id}`);
  },

  async createUser(data: {
    email: string;
    password: string;
    fullname: string;
    role: string;
    bio?: string;
    avatar?: string;
  }): Promise<User> {
    return await axiosClient.post('/users', data);
  },

  async updateUser(id: number, data: {
    fullname?: string;
    email?: string;
    role?: string;
    status?: string;
    bio?: string;
    avatar?: string;
  }): Promise<User> {
    return await axiosClient.put(`/users/${id}`, data);
  },

  async deleteUser(id: number): Promise<void> {
    return await axiosClient.delete(`/users/${id}`);
  }
};

export default userApi;