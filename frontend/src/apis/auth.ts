import axiosClient from './axiosClient';

interface OtpPayload {
  email: string;
  action: string;
}

interface OtpVerifyPayload extends OtpPayload {
  code: string;
}

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
  role: string;
  otp: string;
  action: string;
  bio: string | null;
  avatar: string | null;
}

const authApi = {
  async sendOtp(payload: OtpPayload) {
    return await axiosClient.post('/otp/send', payload);
  },

  async verifyOtp(payload: OtpVerifyPayload) {
    return await axiosClient.post('/otp/verify', payload);
  },
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return await axiosClient.post('/auth/login', payload);
  },

  async register(payload: RegisterPayload) {
    console.log('Sending register request with payload:', payload);
    const response = await axiosClient.post('/auth/register', payload);
    console.log('Register response:', response);
    return response;
  },

  async logout() {
    return await axiosClient.post('/auth/logout');
  },

  async forgotPassword(email: string) {
    return await axiosClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    return await axiosClient.post('/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
  },

  async getProfile() {
    return await axiosClient.get('/auth/profile');
  },

  async changePassword(email: string, oldPassword: string, newPassword: string) {
    return await axiosClient.post('/auth/change-password', {
      email,
      oldPassword,
      newPassword
    });
  },

  async updateProfile(data: {
    fullname?: string;
    email?: string;
    phone?: string;
    address?: string;
    bio?: string;
    avatar?: string;
  }) {
    return await axiosClient.put('/auth/profile', data);
  },
};

export default authApi;