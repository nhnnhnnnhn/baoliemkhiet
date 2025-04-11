import Link from "next/link"
import { CalendarIcon, SearchIcon } from "lucide-react"

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
      {/* Top Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              CHUYÊN MỤC
            </Button>
          </div>
          <div className="hidden md:block">
            <Link href="/subscribe">
              <Button variant="ghost" size="sm">
                ĐĂNG KÝ CHỈ 25K/TUẦN
              </Button>
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

      {/* Masthead */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex items-center text-sm text-gray-500 mb-4 md:mb-0">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {currentDate}
          </div>
          <div className="text-center">
            <Link href="/" className="text-3xl font-serif font-bold">
              Báo Liêm Khiết
            </Link>
          </div>
          <div className="text-xs hidden md:block">Bản in hôm nay</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto py-3 space-x-6">
            <Link href="/thoi-su" className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Thời sự
            </Link>
            <Link href="/the-gioi" className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Thế giới
            </Link>
            <Link
              href="/kinh-doanh"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap"
            >
              Kinh doanh
            </Link>
            <Link href="/cong-nghe" className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Công nghệ
            </Link>
            <Link href="/the-thao" className="text-sm font-medium text-gray-600 hover:text-blue-600 whitespace-nowrap">
              Thể thao
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
