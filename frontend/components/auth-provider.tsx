"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/src/store"
import { handleGetProfile } from "@/src/thunks/auth/authThunk"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        try {
          await dispatch(handleGetProfile()).unwrap()
        } catch (error) {
          // If getting profile fails, clear tokens
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          router.push('/auth/login')
        }
      }
    }

    initAuth()
  }, [dispatch, router])

  return <>{children}</>
}