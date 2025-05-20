"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAppSelector } from "@/src/store"
import { selectIsLoggedIn } from "@/src/thunks/auth/authSlice"
import {
  SearchIcon,
  TrendingUpIcon,
  GlobeIcon,
  DollarSignIcon,
  MonitorIcon,
  ActivityIcon,
  NewspaperIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { SafeLink } from "@/components/safe-link"

// Thêm import cho UserNav component
import { UserNav } from "@/components/user-nav"

export interface SiteHeaderProps {
  variant?: 'transparent' | 'solid'
}

export function SiteHeader({ variant = 'transparent' }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Đảm bảo nội dung hiển thị với màu phù hợp dựa trên variant hoặc việc cuộn trang
  const shouldUseVisibleStyle = isScrolled || variant === 'solid'
  // Chỉ hiển thị shadow khi đã cuộn trang, không quan tâm variant
  const shouldShowShadow = isScrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseVisibleStyle ? "bg-white" : "bg-transparent"
      } ${shouldShowShadow ? "shadow-md" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Nửa bên trái: Logo và Danh mục */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className={`flex items-center font-bold text-xl ${shouldUseVisibleStyle ? "text-gray-800" : "text-white"}`}>
                <NewspaperIcon className="h-6 w-6 mr-2" />
                <span className="hidden sm:inline">BÁO LIÊM KHIẾT</span>
              </div>
            </Link>

            {/* Danh mục */}
            <nav className="hidden md:flex items-center space-x-1">
              <SafeLink
                href="/thoi-su"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  shouldUseVisibleStyle ? "text-gray-800 hover:text-red-600" : "text-white hover:text-red-200"
                } rounded-md transition-colors whitespace-nowrap`}
              >
                <TrendingUpIcon className="h-4 w-4 mr-1.5" />
                Thời sự
              </SafeLink>
              <SafeLink
                href="/the-gioi"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  shouldUseVisibleStyle ? "text-gray-800 hover:text-red-600" : "text-white hover:text-red-200"
                } rounded-md transition-colors whitespace-nowrap`}
              >
                <GlobeIcon className="h-4 w-4 mr-1.5" />
                Thế giới
              </SafeLink>
              <SafeLink
                href="/kinh-doanh"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  shouldUseVisibleStyle ? "text-gray-800 hover:text-red-600" : "text-white hover:text-red-200"
                } rounded-md transition-colors whitespace-nowrap`}
              >
                <DollarSignIcon className="h-4 w-4 mr-1.5" />
                Kinh doanh
              </SafeLink>
              <SafeLink
                href="/cong-nghe"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  shouldUseVisibleStyle ? "text-gray-800 hover:text-red-600" : "text-white hover:text-red-200"
                } rounded-md transition-colors whitespace-nowrap`}
              >
                <MonitorIcon className="h-4 w-4 mr-1.5" />
                Công nghệ
              </SafeLink>
              <SafeLink
                href="/the-thao"
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  shouldUseVisibleStyle ? "text-gray-800 hover:text-red-600" : "text-white hover:text-red-200"
                } rounded-md transition-colors whitespace-nowrap`}
              >
                <ActivityIcon className="h-4 w-4 mr-1.5" />
                Thể thao
              </SafeLink>
            </nav>
          </div>

          {/* Nửa bên phải: Tìm kiếm, Đăng nhập, Đăng ký */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <SafeLink href="/search">
              <Button
                variant="ghost"
                size="sm"
                className={`px-2 ${shouldUseVisibleStyle ? "text-gray-800 hover:text-red-600" : "text-white hover:text-red-200"}`}
              >
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Tìm kiếm</span>
              </Button>
            </SafeLink>

            {/* Thay thế phần login/profile button với UserNav component */}
            {isLoggedIn ? (
              <UserNav />
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${shouldUseVisibleStyle ? "text-gray-800 hover:text-red-600" : "text-white hover:text-red-200"}`}
                >
                  ĐĂNG NHẬP
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
