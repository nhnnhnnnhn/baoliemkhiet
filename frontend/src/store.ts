import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import authReducer from "./thunks/auth/authSlice"
import userReducer from "./thunks/user/userSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export { store }
