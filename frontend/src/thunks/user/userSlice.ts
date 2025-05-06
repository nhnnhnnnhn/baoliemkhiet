import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchUsers, createUser, updateUser, deleteUser, getUserById } from './userThunk';
import type { RootState } from '../../store';

interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  articles?: any[];
}

interface UsersState {
  users: User[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  updating: boolean;
  updateError: string | null;
  deleting: boolean;
  deleteError: string | null;
  selectedUser: User | null;
  loadingUserDetails: boolean;
  userDetailsError: string | null;
}

const initialState: UsersState = {
  users: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
  selectedUser: null,
  loadingUserDetails: false,
  userDetailsError: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.creating = false;
        state.users.push(action.payload);
        state.total += 1;
        state.createError = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.updateError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleting = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.total -= 1;
        state.deleteError = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload as string;
      })
      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.loadingUserDetails = true;
        state.userDetailsError = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loadingUserDetails = false;
        state.selectedUser = action.payload;
        state.userDetailsError = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loadingUserDetails = false;
        state.selectedUser = null;
        state.userDetailsError = action.payload as string;
      });
  }
});

export const { setPage, setLimit } = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUsers = (state: RootState) => state.user.users;
export const selectTotal = (state: RootState) => state.user.total;
export const selectPage = (state: RootState) => state.user.page;
export const selectLimit = (state: RootState) => state.user.limit;
export const selectLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;
export const selectCreating = (state: RootState) => state.user.creating;
export const selectCreateError = (state: RootState) => state.user.createError;
export const selectUpdating = (state: RootState) => state.user.updating;
export const selectUpdateError = (state: RootState) => state.user.updateError;
export const selectDeleting = (state: RootState) => state.user.deleting;
export const selectDeleteError = (state: RootState) => state.user.deleteError;
export const selectSelectedUser = (state: RootState) => state.user.selectedUser;
export const selectLoadingUserDetails = (state: RootState) => state.user.loadingUserDetails;
export const selectUserDetailsError = (state: RootState) => state.user.userDetailsError;