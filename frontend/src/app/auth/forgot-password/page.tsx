"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Giả lập gửi yêu cầu đặt lại mật khẩu
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-6">
            <Image src="/logo.svg" alt="Báo Liêm Khiết" width={150} height={40} />
          </Link>

          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold">Quên mật khẩu</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold">Kiểm tra email của bạn</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Chúng tôi đã gửi email đến <strong>{email}</strong> với hướng dẫn để đặt lại mật khẩu của bạn.
              </p>
            </>
          )}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Địa chỉ email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang đăng nhập
            </Link>
          </div>
        )}

        {!isSubmitted && (
          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Quay lại trang đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
