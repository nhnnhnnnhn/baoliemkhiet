'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from './api';

// Định nghĩa kiểu dữ liệu User
export interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
  avatar?: string;
}

// Định nghĩa kiểu dữ liệu AuthContextType
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: { email: string; password: string; fullname: string; role?: string }) => Promise<void>;
  logout: () => void;
  resetError: () => void;
}

// Helper function để truy cập localStorage hoặc sessionStorage an toàn (client-side only)
const getStorageValue = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }
  return null;
};

const setStorageValue = (key: string, value: string, useLocalStorage: boolean = true): void => {
  if (typeof window !== 'undefined') {
    if (useLocalStorage) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  }
};

const removeStorageValue = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
};

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook để sử dụng auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra nếu người dùng đã đăng nhập
  useEffect(() => {
    const checkUserAuthentication = async () => {
      setIsLoading(true);
      try {
        // Kiểm tra token từ localStorage hoặc sessionStorage
        const token = getStorageValue('accessToken');
        if (token) {
          // TODO: Gọi API để lấy thông tin user từ token
          // Tạm thời giả định có user với token hợp lệ
          const userData = { id: 1, email: 'user@example.com', fullname: 'Người dùng', role: 'USER' };
          setUser(userData);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuthentication();
  }, []);

  // Xử lý đăng nhập
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password, rememberMe);
      
      // Lưu token
      setStorageValue('accessToken', response.accessToken, rememberMe);
      setStorageValue('refreshToken', response.refreshToken, rememberMe);
      
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng ký
  const register = async (userData: { email: string; password: string; fullname: string; role?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register({
        email: userData.email,
        password: userData.password,
        fullname: userData.fullname,
        role: userData.role || 'USER'
      });
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng xuất
  const logout = () => {
    removeStorageValue('accessToken');
    removeStorageValue('refreshToken');
    setUser(null);
  };

  // Reset error
  const resetError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    resetError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 