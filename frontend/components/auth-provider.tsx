"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetProfile } from "@/src/thunks/auth/authThunk"
import { selectIsLoggedIn, setTokenFromStorage } from "@/src/thunks/auth/authSlice"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  // Xác định chắc chắn đang ở phía client
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const initAuth = async () => {
      if (!isClient) return;
      
      setIsLoading(true);
      
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!accessToken || !refreshToken) {
          dispatch(setTokenFromStorage({ accessToken: null, isLoggedIn: false }));
          setIsLoading(false);
          return;
        }

        // First update the token in Redux
        dispatch(setTokenFromStorage({
          accessToken,
          isLoggedIn: true
        }));

        // Then fetch the user profile
        try {
          await dispatch(handleGetProfile()).unwrap();
        } catch (error) {
          console.error("Failed to load profile:", error);
          
          // Clear auth state on any error
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userRole");
          
          dispatch(setTokenFromStorage({
            accessToken: null,
            isLoggedIn: false
          }));
          
          if (!window.location.pathname.includes('/auth/')) {
            router.push("/auth/login");
          }
        }
      } catch (error) {
        console.error("Lỗi khởi tạo xác thực:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Lắng nghe sự kiện storage để đồng bộ trạng thái đăng nhập giữa các tab
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "accessToken" && !event.newValue) {
        // Token đã bị xóa trong tab khác
        dispatch(
          setTokenFromStorage({
            accessToken: null,
            isLoggedIn: false,
          }),
        )
        router.push("/auth/login")
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener("storage", handleStorageChange)
      return () => window.removeEventListener("storage", handleStorageChange)
    }
  }, [isClient, dispatch, router])

  if (isLoading && isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return <>{children}</>
}
