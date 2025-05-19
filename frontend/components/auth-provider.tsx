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

        // Mark that we're attempting a refresh to prevent logout loops
        localStorage.setItem('refreshAttemptInProgress', 'true');

        // First update the token in Redux
        dispatch(setTokenFromStorage({
          accessToken,
          isLoggedIn: true
        }));

        // Then fetch the user profile
        try {
          const result = await dispatch(handleGetProfile()).unwrap();
          console.log("Profile loaded successfully:", result);
          // Clear the refresh attempt flag on success
          localStorage.removeItem('refreshAttemptInProgress');
        } catch (error: any) {
          console.error("Failed to load profile:", {
            message: error.message,
            status: error.status,
            data: error.data
          });
          
          // Only clear auth if we get a specific auth error (401, 403)
          // This prevents logout due to network issues or server errors
          if (error && typeof error === 'object' && 'status' in error && 
              (error.status === 401 || error.status === 403)) {
            console.log("Authentication error detected, clearing auth state");
            // Clear auth state on authentication error
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
          } else {
            console.log("Non-auth error, maintaining current state");
          }
          
          // Clear the refresh attempt flag
          localStorage.removeItem('refreshAttemptInProgress');
        }
      } catch (error) {
        console.error("Unexpected error in initAuth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

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

  if (!isClient || isLoading) {
    return null;
  }

  return <>{children}</>;
}
