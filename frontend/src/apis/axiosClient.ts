import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Tạo biến để theo dõi trạng thái đang refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Get the backend URL from environment variables
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // Set timeout to 10 seconds
});

// Add a request interceptor to handle errors
axiosClient.interceptors.request.use(
  (config) => {
    // Reset error message on new request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a request interceptor for authentication
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only try to get token if we're in a browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 error and token refresh
    if (typeof window !== 'undefined' && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Queue the request if refresh is in progress
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('Phiên đăng nhập đã hết hạn');
        }

        const response = await axios.post(
          `${BACKEND_URL}/api/auth/refresh-token`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );

        const { accessToken } = response.data;

        // Update localStorage and notify waiting requests
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return axiosClient(originalRequest);
      } catch (error) {
        // Clear auth data and notify waiting requests
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        processQueue(error, null);

        // Redirect to login if not already on auth page
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
          window.location.href = '/auth/login';
        }

        return Promise.reject(new Error('Phiên đăng nhập đã hết hạn'));
      } finally {
        isRefreshing = false;
      }
    }
    
    let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại';
    
    if (!error.response) {
      errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
    } else if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('API Error:', errorMessage);
    return Promise.reject(errorMessage);
  }
);

export default axiosClient;