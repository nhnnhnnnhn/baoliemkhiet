import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold">BÁO LIÊM KHIẾT</div>
            </Link>
            <p className="text-gray-400 text-sm">
              Báo Liêm Khiết là trang tin tức uy tín, cung cấp thông tin chính xác và khách quan về các sự kiện trong
              nước và quốc tế.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chuyên mục</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/thoi-su" className="text-gray-400 hover:text-white">
                  Thời sự
                </Link>
              </li>
              <li>
                <Link href="/the-gioi" className="text-gray-400 hover:text-white">
                  Thế giới
                </Link>
              </li>
              <li>
                <Link href="/kinh-doanh" className="text-gray-400 hover:text-white">
                  Kinh doanh
                </Link>
              </li>
              <li>
                <Link href="/cong-nghe" className="text-gray-400 hover:text-white">
                  Công nghệ
                </Link>
              </li>
              <li>
                <Link href="/the-thao" className="text-gray-400 hover:text-white">
                  Thể thao
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-gray-400 hover:text-white flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Chủ đề
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="text-gray-400 hover:text-white">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-400 hover:text-white">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-gray-400 hover:text-white">
                  Đăng ký gói
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white">
                  Tìm kiếm
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-gray-400 hover:text-white">
                  Báo cáo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">(+84) 28 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">info@baolicmkhiet.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Báo Liêm Khiết. Tất cả các quyền được bảo lưu.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm">
                Chính sách bảo mật
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-white text-sm">
                Điều khoản sử dụng
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white text-sm">
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
