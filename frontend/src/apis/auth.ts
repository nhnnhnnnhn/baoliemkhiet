import axiosClient from './axiosClient';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullname: string;
    role: string;
    avatar?: string;
  };
}

interface RegisterPayload {
  email: string;
  password: string;
  fullname: string;
  role?: string;
  otp: string;
}

const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return await axiosClient.post('/auth/login', payload);
  },

  async register(payload: RegisterPayload) {
    return await axiosClient.post('/auth/register', payload);
  },

  async logout() {
    return await axiosClient.post('/auth/logout');
  },

  async forgotPassword(email: string) {
    return await axiosClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string) {
    return await axiosClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  async getProfile() {
    return await axiosClient.get('/auth/profile');
  },
};

export default authApi;