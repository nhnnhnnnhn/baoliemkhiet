import { createSlice } from "@reduxjs/toolkit"
import { handleCreateUser } from "./userThunk"

interface UserState {
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Handle create user
    builder
      .addCase(handleCreateUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(handleCreateUser.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(handleCreateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer
