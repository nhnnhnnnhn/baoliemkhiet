import { createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../apis/auth';
import userApi from '../../apis/user';

interface LoginPayload {
  email: string;
  password: string;
}

interface OtpPayload {
  email: string;
  action: string;
}

interface VerifyOtpPayload {
  email: string;
  code: string;
  action: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  fullname: string;
  role: string;
  otp: string;
  action: string;
  bio: string | null;
  avatar: string | null;
}

interface UpdateProfilePayload {
  id: number;
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
}

export const handleLogin = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userRole', response.user.role);
      return response;
    } catch (error: any) {
      // Return specific messages based on the response from the backend
      if (error.response?.data?.message) {
        // Pass the exact backend error message
        return rejectWithValue(error.response.data.message);
      } else if (error.response?.status === 400) {
        return rejectWithValue('Email hoặc mật khẩu không chính xác');
      } else if (error.response?.status === 401) {
        return rejectWithValue('Không có quyền truy cập');
      } else if (error.response?.status === 404) {
        return rejectWithValue('Không tìm thấy tài khoản');
      } else if (error.response?.status === 429) {
        return rejectWithValue('Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.');
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      return;
    } catch (error: any) {
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
      // Return the error status to allow auth provider to make decisions
      if (error.response) {
        return rejectWithValue({
          message: error.response.data?.message || 'Failed to get profile',
          status: error.response.status
        });
      }
      
      // For network errors or other non-response errors, don't trigger a logout
      return rejectWithValue({
        message: error.message || 'Failed to get profile',
        status: 'NETWORK_ERROR'
      });
    }
  }
);

export const handleUpdateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload: {
    fullname?: string;
    email?: string;
    phone?: string;
    address?: string;
    bio?: string;
    avatar?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const handleSendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (payload: OtpPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.sendOtp(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const handleVerifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

export const handleRegister = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

interface ChangePasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const handleChangePassword = createAsyncThunk(
  'auth/changePassword',
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

export const handleGetUserById = createAsyncThunk(
  'auth/getUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user details');
    }
  }
);

export const handleDeleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userApi.deleteUser(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);