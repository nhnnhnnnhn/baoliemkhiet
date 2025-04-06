import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Định nghĩa kiểu cho dữ liệu lỗi API
interface ApiErrorResponse {
  message: string;
}

// Tạo axios instance với các cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để thêm token vào header trước mỗi request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Định nghĩa các API service
export const authService = {
  // Đăng nhập
  login: async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Lưu token vào localStorage hoặc sessionStorage tùy theo rememberMe
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        } else {
          sessionStorage.setItem('accessToken', response.data.accessToken);
          sessionStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Đăng nhập thất bại');
    }
  },

  // Đăng ký
  register: async (userData: {
    email: string;
    password: string;
    fullname: string;
    role?: string;
    otp?: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Đăng ký thất bại');
    }
  },

  // Yêu cầu OTP
  requestOtp: async (email: string, action: string) => {
    try {
      const response = await api.post('/otp/send', { email, action });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Gửi OTP thất bại');
    }
  },

  // Đổi mật khẩu
  changePassword: async (email: string, oldPassword: string, newPassword: string, otp: string) => {
    try {
      const response = await api.post('/auth/change-password', {
        email,
        oldPassword,
        newPassword,
        otp,
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  },

  // Đăng xuất
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
  },
};

export default api; 