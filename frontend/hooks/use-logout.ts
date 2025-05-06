"use client"

import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/src/store"
import { handleLogout } from "@/src/thunks/auth/authThunk"

export function useLogout() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const logout = async () => {
    try {
      await dispatch(handleLogout()).unwrap()
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
      // Still clear storage and redirect on error
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userRole")
      router.push("/auth/login")
    }
  }

  return logout
}
