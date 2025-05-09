import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../apis/user';
import authApi from '../../apis/auth';

export interface UpdateProfilePayload {
  id: number;
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
}

interface CreateUserPayload {
  email: string;
  password: string;
  fullname: string;
  role?: string;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  status?: string;
}

export interface ChangePasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const handleCreateUser = createAsyncThunk(
  'user/create',
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(payload);
      return response;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return rejectWithValue('Thông tin không hợp lệ');
      } else if (error.response?.status === 409) {
        return rejectWithValue('Email đã tồn tại trong hệ thống');
      } else if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại.');
    }
  }
);

export const handleUpdateProfile = createAsyncThunk(
  'user/updateProfile',
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUser(payload.id, payload);
      return response;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return rejectWithValue('Thông tin không hợp lệ');
      } else if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
    }
  }
);

export const handleChangePasswordAdmin = createAsyncThunk(
  'user/changePasswordAdmin',
  async (payload: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(
        payload.email,
        payload.oldPassword,
        payload.newPassword
      );
      return response;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return rejectWithValue('Mật khẩu cũ không chính xác');
      }
      return rejectWithValue(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  }
);

export const handleGetUsers = createAsyncThunk(
  'user/getUsers',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await userApi.getUsers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách người dùng');
    }
  }
);

export const handleGetUserById = createAsyncThunk(
  'user/getUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  }
);

export const handleDeleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa người dùng');
    }
  }
);