import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  handleLogin,
  handleLogout,
  handleGetProfile,
  handleSendOtp,
  handleVerifyOtp,
  handleChangePassword,
  handleUpdateProfile,
  handleGetUserById,
  handleDeleteUser
} from './authThunk';
import type { RootState } from '../../store';

export interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
  avatar?: string | null;
  bio?: string | null;
  is_online?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  phone?: string;
  address?: string;
  status?: string;
  articles?: Array<{
    id: number;
    title: string;
    status: string;
    publishedAt?: string;
    createdAt?: string;
    views?: number;
  }>;
  followers?: Array<any>;
  Follow?: Array<any>;
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
  updatingProfile: boolean;
  updateProfileError: string | null;
  updateProfileSuccess: boolean;
  selectedUser: User | null;
  loadingUserDetails: boolean;
  userDetailsError: string | null;
  deletingUser: boolean;
  deleteUserError: string | null;
  deleteUserSuccess: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  logging: false,
  user: null,
  accessToken: null,
  otpSending: false,
  otpVerifying: false,
  otpSent: false,
  otpVerified: false,
  otpError: null,
  changingPassword: false,
  changePasswordError: null,
  updatingProfile: false,
  updateProfileError: null,
  updateProfileSuccess: false,
  selectedUser: null,
  loadingUserDetails: false,
  userDetailsError: null,
  deletingUser: false,
  deleteUserError: null,
  deleteUserSuccess: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setTokenFromStorage: (state, action: PayloadAction<{accessToken: string | null, isLoggedIn: boolean}>) => {
      state.accessToken = action.payload.accessToken;
      state.isLoggedIn = action.payload.isLoggedIn;
    }
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
        if (action.payload.user) {
          state.user = action.payload.user;
        }
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
      .addCase(handleGetProfile.pending, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(handleGetProfile.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (data) {
          state.user = data;
          state.isLoggedIn = true;
        } else {
          state.isLoggedIn = false;
          state.user = null;
          state.accessToken = null;
        }
      })
      .addCase(handleGetProfile.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.accessToken = null;
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
      })
      // Update Profile
      .addCase(handleUpdateProfile.pending, (state) => {
        state.updatingProfile = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = false;
      })
      .addCase(handleUpdateProfile.fulfilled, (state, action) => {
        state.updatingProfile = false;
        state.updateProfileSuccess = true;
        state.updateProfileError = null;
        if (state.user && action.payload) {
          state.user = {
            ...state.user,
            fullname: action.payload.fullname || state.user.fullname,
            email: action.payload.email || state.user.email,
            phone: action.payload.phone ?? state.user.phone ?? undefined,
            address: action.payload.address || state.user.address,
            bio: action.payload.bio || state.user.bio
          };
        }
      })
      .addCase(handleUpdateProfile.rejected, (state, action: any) => {
        state.updatingProfile = false;
        state.updateProfileError = action.payload;
        state.updateProfileSuccess = false;
      })
      // Get User By ID
      .addCase(handleGetUserById.pending, (state) => {
        state.loadingUserDetails = true;
        state.userDetailsError = null;
        state.selectedUser = null;
      })
      .addCase(handleGetUserById.fulfilled, (state, action) => {
        state.loadingUserDetails = false;
        state.selectedUser = action.payload;
        state.userDetailsError = null;
      })
      .addCase(handleGetUserById.rejected, (state, action: any) => {
        state.loadingUserDetails = false;
        state.userDetailsError = action.payload;
        state.selectedUser = null;
      })
      // Delete User
      .addCase(handleDeleteUser.pending, (state) => {
        state.deletingUser = true;
        state.deleteUserError = null;
        state.deleteUserSuccess = false;
      })
      .addCase(handleDeleteUser.fulfilled, (state) => {
        state.deletingUser = false;
        state.deleteUserError = null;
        state.deleteUserSuccess = true;
      })
      .addCase(handleDeleteUser.rejected, (state, action: any) => {
        state.deletingUser = false;
        state.deleteUserError = action.payload;
        state.deleteUserSuccess = false;
      });
  },
});

// Export actions
export const { updateUser, setTokenFromStorage } = authSlice.actions;

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
export const selectUpdatingProfile = (state: RootState) => state.auth.updatingProfile;
export const selectUpdateProfileError = (state: RootState) => state.auth.updateProfileError;
export const selectUpdateProfileSuccess = (state: RootState) => state.auth.updateProfileSuccess;
export const selectSelectedUser = (state: RootState) => state.auth.selectedUser;
export const selectLoadingUserDetails = (state: RootState) => state.auth.loadingUserDetails;
export const selectUserDetailsError = (state: RootState) => state.auth.userDetailsError;
export const selectDeletingUser = (state: RootState) => state.auth.deletingUser;
export const selectDeleteUserError = (state: RootState) => state.auth.deleteUserError;
export const selectDeleteUserSuccess = (state: RootState) => state.auth.deleteUserSuccess;