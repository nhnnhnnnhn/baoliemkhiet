import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend server running on port 3000
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies & CORS
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    return response.data; // Return the data directly
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axiosClient.post('/auth/refresh-token', {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Return error message from response if available
    // Format error message based on response
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra, vui lòng thử lại';
    
    // If network error
    if (!error.response) {
      return Promise.reject('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
    }
    
    return Promise.reject(errorMessage);
  }
);

export default axiosClient;