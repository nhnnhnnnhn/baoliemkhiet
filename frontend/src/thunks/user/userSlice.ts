import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/src/store';
import { handleCreateUser, handleUpdateProfile, handleChangePasswordAdmin, handleGetUsers, handleGetUserById, handleDeleteUser } from './userThunk';

export interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

interface UserState {
  users: User[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  isUpdatingProfile: boolean;
  updateProfileError: string | null;
  updateProfileSuccess: boolean;
  selectedUser: User | null;
  isChangingPassword: boolean;
  changePasswordError: string | null;
  changePasswordSuccess: boolean;
}

const initialState: UserState = {
  users: [],
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  isUpdatingProfile: false,
  updateProfileError: null,
  updateProfileSuccess: false,
  selectedUser: null,
  isChangingPassword: false,
  changePasswordError: null,
  changePasswordSuccess: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateProfileState: (state) => {
      state.updateProfileError = null;
      state.updateProfileSuccess = false;
    },
    clearChangePasswordState: (state) => {
      state.changePasswordError = null;
      state.changePasswordSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle get all users
      .addCase(handleGetUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users.map((user: any) => ({
          ...user,
          phone: user.phone || null,
          address: user.address || null
        })) as User[];
        state.totalUsers = action.payload.pagination.total;
        state.currentPage = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(handleGetUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle create user
      .addCase(handleCreateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleCreateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const newUser = {
          ...action.payload,
          phone: (action.payload as any).phone || null,
          address: (action.payload as any).address || null
        } as User;
        state.users = [...state.users, newUser];
      })
      .addCase(handleCreateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle get user by id
      .addCase(handleGetUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = {
          ...action.payload,
          phone: (action.payload as any).phone || null,
          address: (action.payload as any).address || null
        } as User;
      })
      .addCase(handleGetUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle delete user
      .addCase(handleDeleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleDeleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(handleDeleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle update profile
      .addCase(handleUpdateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = false;
      })
      .addCase(handleUpdateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.updateProfileError = null;
        state.updateProfileSuccess = true;
        // Update user in list if exists
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = {
            ...action.payload,
            phone: (action.payload as any).phone || null,
            address: (action.payload as any).address || null
          } as User;
        }
      })
      .addCase(handleUpdateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.updateProfileError = action.payload as string;
        state.updateProfileSuccess = false;
      })

      // Handle change password
      .addCase(handleChangePasswordAdmin.pending, (state) => {
        state.isChangingPassword = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = false;
      })
      .addCase(handleChangePasswordAdmin.fulfilled, (state) => {
        state.isChangingPassword = false;
        state.changePasswordSuccess = true;
      })
      .addCase(handleChangePasswordAdmin.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.changePasswordError = action.payload as string;
        state.changePasswordSuccess = false;
      });
  }
});

// Export actions
export const { clearError, clearUpdateProfileState, clearChangePasswordState } = userSlice.actions;

// Export selectors
export const selectUsers = (state: RootState) => state.user.users;
export const selectTotalUsers = (state: RootState) => state.user.totalUsers;
export const selectCurrentPage = (state: RootState) => state.user.currentPage;
export const selectTotalPages = (state: RootState) => state.user.totalPages;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;
export const selectIsUpdatingProfile = (state: RootState) => state.user.isUpdatingProfile;
export const selectUpdateProfileError = (state: RootState) => state.user.updateProfileError;
export const selectUpdateProfileSuccess = (state: RootState) => state.user.updateProfileSuccess;
export const selectSelectedUser = (state: RootState) => state.user.selectedUser;
export const selectIsChangingPassword = (state: RootState) => state.user.isChangingPassword;
export const selectChangePasswordError = (state: RootState) => state.user.changePasswordError;
export const selectChangePasswordSuccess = (state: RootState) => state.user.changePasswordSuccess;

// Export reducer
export default userSlice.reducer;