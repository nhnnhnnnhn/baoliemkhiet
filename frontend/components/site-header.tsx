import Link from "next/link"
import Image from "next/image"
import {
  SearchIcon,
  MenuIcon,
  ChevronDownIcon,
  TrendingUpIcon,
  GlobeIcon,
  DollarSignIcon,
  MonitorIcon,
  ActivityIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <>
      {/* Top Navigation - Đã cập nhật với logo thay thế cho "Đăng ký chỉ 25K/tuần" */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chuyen-muc">
              <Button variant="ghost" size="sm" className="flex items-center">
                <MenuIcon className="h-4 w-4 mr-1" />
                CHUYÊN MỤC
              </Button>
            </Link>
          </div>

          {/* Logo thay thế cho "Đăng ký chỉ 25K/tuần" */}
          <div className="hidden md:block">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="Báo Liêm Khiết" width={120} height={40} priority />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                ĐĂNG NHẬP
              </Button>
            </Link>
            <Link href="/subscribe">
              <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                ĐĂNG KÝ
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation - Đã thay đổi màu sang trắng */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-1 md:space-x-4 overflow-x-auto scrollbar-hide">
              <Link
                href="/thoi-su"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 hover:text-red-600 rounded-md transition-colors whitespace-nowrap"
              >
                <TrendingUpIcon className="h-4 w-4 mr-1.5" />
                Thời sự
              </Link>
              <Link
                href="/the-gioi"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 hover:text-red-600 rounded-md transition-colors whitespace-nowrap"
              >
                <GlobeIcon className="h-4 w-4 mr-1.5" />
                Thế giới
              </Link>
              <Link
                href="/kinh-doanh"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 hover:text-red-600 rounded-md transition-colors whitespace-nowrap"
              >
                <DollarSignIcon className="h-4 w-4 mr-1.5" />
                Kinh doanh
              </Link>
              <Link
                href="/cong-nghe"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 hover:text-red-600 rounded-md transition-colors whitespace-nowrap"
              >
                <MonitorIcon className="h-4 w-4 mr-1.5" />
                Công nghệ
              </Link>
              <Link
                href="/the-thao"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 hover:text-red-600 rounded-md transition-colors whitespace-nowrap"
              >
                <ActivityIcon className="h-4 w-4 mr-1.5" />
                Thể thao
              </Link>
            </div>

            <div className="hidden md:flex items-center">
              <Button variant="ghost" className="text-gray-800 hover:text-red-600 flex items-center">
                Xem thêm <ChevronDownIcon className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
