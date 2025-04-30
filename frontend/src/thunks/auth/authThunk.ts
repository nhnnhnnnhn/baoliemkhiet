import { createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../apis/auth';

interface LoginPayload {
  email: string;
  password: string;
}

export const handleLogin = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userRole', response.user.role); // Thêm lưu role
      return response;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return rejectWithValue('Email hoặc mật khẩu không chính xác');
      } else if (error.response?.status === 429) {
        return rejectWithValue('Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.');
      } else if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    }
  }
);

export const handleLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      // Clear tokens and role from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      
      // Navigate to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      return;
    } catch (error: any) {
      // Still clear storage and redirect even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const handleGetProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get profile');
    }
  }
);