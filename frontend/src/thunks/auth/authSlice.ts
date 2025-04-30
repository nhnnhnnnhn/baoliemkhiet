import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { handleLogin, handleLogout, handleGetProfile } from './authThunk';
import type { RootState } from '../../store';

export interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  logging: boolean;
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  logging: false,
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
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