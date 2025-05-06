"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useAppDispatch } from "@/src/store"
import { handleLogin } from "@/src/thunks/auth/authThunk"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError('Vui lòng nhập email và mật khẩu')
        return
      }

      const response = await dispatch(handleLogin({
        email: formData.email,
        password: formData.password
      })).unwrap()

      // Validate response
      if (!response?.accessToken || !response?.user?.role) {
        throw new Error('Phản hồi không hợp lệ từ máy chủ')
      }

      // Store auth data in localStorage
      try {
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('userRole', response.user.role)

        // Small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100))

        // Redirect based on role
        switch(response.user.role) {
          case 'ADMIN':
            await router.push('/admin')
            break
          case 'JOURNALIST':
            await router.push('/author')
            break
          default:
            await router.push('/')
        }
      } catch (storageError) {
        console.error('Storage error:', storageError)
        throw new Error('Lỗi lưu trữ phiên đăng nhập')
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      if (error.response) {
        console.error('Error response:', error.response)
        setError(error.response.data?.message || 'Đăng nhập thất bại')
      } else if (error.request) {
        console.error('No response:', error.request)
        setError('Không thể kết nối đến máy chủ')
      } else {
        console.error('Error:', error)
        setError(error.message || 'Đăng nhập thất bại')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <svg
              width="48"
              height="48"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-blue-600"
            >
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path
                d="M22 12.5C22 10.567 20.433 9 18.5 9C16.567 9 15 10.567 15 12.5C15 14.433 16.567 16 18.5 16C20.433 16 22 14.433 22 12.5Z"
                fill="white"
              />
              <path
                d="M17 19.5C17 17.567 15.433 16 13.5 16C11.567 16 10 17.567 10 19.5C10 21.433 11.567 23 13.5 23C15.433 23 17 21.433 17 19.5Z"
                fill="white"
              />
            </svg>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                checked={formData.rememberMe}
                onCheckedChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ghi nhớ đăng nhập
              </Label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
