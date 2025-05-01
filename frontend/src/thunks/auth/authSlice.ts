import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  handleLogin,
  handleLogout,
  handleGetProfile,
  handleSendOtp,
  handleVerifyOtp,
  handleChangePassword
} from './authThunk';
import type { RootState } from '../../store';

export interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
  avatar?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  logging: boolean;
  user: User | null;
  accessToken: string | null;
  otpSending: boolean;
  otpVerifying: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  otpError: string | null;
  changingPassword: boolean;
  changePasswordError: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  logging: false,
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  otpSending: false,
  otpVerifying: false,
  otpSent: false,
  otpVerified: false,
  otpError: null,
  changingPassword: false,
  changePasswordError: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(handleSendOtp.pending, (state) => {
        state.otpSending = true;
        state.otpError = null;
      })
      .addCase(handleSendOtp.fulfilled, (state) => {
        state.otpSending = false;
        state.otpSent = true;
        state.otpError = null;
      })
      .addCase(handleSendOtp.rejected, (state, action: any) => {
        state.otpSending = false;
        state.otpSent = false;
        state.otpError = action.payload || 'Failed to send OTP';
      })
      // Verify OTP
      .addCase(handleVerifyOtp.pending, (state) => {
        state.otpVerifying = true;
        state.otpError = null;
      })
      .addCase(handleVerifyOtp.fulfilled, (state) => {
        state.otpVerifying = false;
        state.otpVerified = true;
        state.otpError = null;
      })
      .addCase(handleVerifyOtp.rejected, (state, action: any) => {
        state.otpVerifying = false;
        state.otpVerified = false;
        state.otpError = action.payload || 'Failed to verify OTP';
      })
      // Login
      .addCase(handleLogin.pending, (state) => {
        state.logging = true;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.logging = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(handleLogin.rejected, (state) => {
        state.logging = false;
        state.isLoggedIn = false;
        state.user = null;
        state.accessToken = null;
      })
      // Logout
      .addCase(handleLogout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.accessToken = null;
      })
      // Get Profile
      .addCase(handleGetProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      
      // Change Password
      .addCase(handleChangePassword.pending, (state) => {
        state.changingPassword = true;
        state.changePasswordError = null;
      })
      .addCase(handleChangePassword.fulfilled, (state) => {
        state.changingPassword = false;
        state.changePasswordError = null;
      })
      .addCase(handleChangePassword.rejected, (state, action: any) => {
        state.changingPassword = false;
        state.changePasswordError = action.payload;
      });
  },
});

// Export actions
export const { updateUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Export selectors
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsLogging = (state: RootState) => state.auth.logging;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectOtpSending = (state: RootState) => state.auth.otpSending;
export const selectOtpVerifying = (state: RootState) => state.auth.otpVerifying;
export const selectOtpSent = (state: RootState) => state.auth.otpSent;
export const selectOtpVerified = (state: RootState) => state.auth.otpVerified;
export const selectOtpError = (state: RootState) => state.auth.otpError;
export const selectChangingPassword = (state: RootState) => state.auth.changingPassword;
export const selectChangePasswordError = (state: RootState) => state.auth.changePasswordError;