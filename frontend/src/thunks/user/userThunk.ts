import { createAsyncThunk } from "@reduxjs/toolkit"
import userApi from "../../apis/user"

interface CreateUserPayload {
  email: string
  password: string
  fullname: string
  role?: string
  avatar?: string | null
  bio?: string | null
  phone?: string | null
  address?: string | null
  status?: string
}

export const handleCreateUser = createAsyncThunk(
  "user/create",
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(payload)
      return response
    } catch (error: any) {
      if (error.response?.status === 400) {
        return rejectWithValue("Thông tin không hợp lệ")
      } else if (error.response?.status === 409) {
        return rejectWithValue("Email đã tồn tại trong hệ thống")
      } else if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue("Có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại.")
    }
  },
)
