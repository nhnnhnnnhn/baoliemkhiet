import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../apis/user';

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
  status?: string;
  avatar?: string;
  bio?: string;
  articles?: any[];
}

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
  } | undefined, thunkAPI) => {
    try {
      const response = await userApi.getUsers(params);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (data: {
    email: string;
    password: string;
    fullname: string;
    role: string;
    bio?: string;
    avatar?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: {
    id: number;
    data: {
      fullname?: string;
      email?: string;
      role?: string;
      status?: string;
      bio?: string;
      avatar?: string;
    }
  }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUser(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);