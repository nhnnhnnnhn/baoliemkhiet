import Link from "next/link"
import { ArrowRight, BookOpen, CreditCard, Settings, Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "../admin/admin.module.css"

export default function UserDashboard() {
  // Mock user data
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    accountType: "Premium",
    memberSince: "05/04/2025",
    articlesRead: 127,
    savedArticles: 15,
    subscriptionStatus: "Đang hoạt động",
    subscriptionPlan: "Gói Premium",
    nextBillingDate: "05/05/2025",
    paymentMethod: "Visa **** 1234",
  }

  // Mock recent articles
  const recentArticles = [
    {
      title: "Chính phủ công bố kế hoạch phát triển kinh tế 5 năm tới",
      category: "Thời sự",
      date: "05/04/2025",
      readTime: "5 phút đọc",
    },
    {
      title: "Đội tuyển Việt Nam giành chiến thắng ấn tượng tại vòng loại World Cup",
      category: "Thể thao",
      date: "04/04/2025",
      readTime: "4 phút đọc",
    },
    {
      title: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
      category: "Kinh doanh",
      date: "03/04/2025",
      readTime: "6 phút đọc",
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Trang chủ</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Tài khoản</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className={styles.chartCard + " mb-6"}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Xin chào, {user.name}!</h2>
              <p className="mt-1 text-gray-600">Chào mừng bạn quay trở lại với tài khoản {user.accountType} của bạn.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button>
                Khám phá bài viết mới
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Link href="/user/profile" className={styles.chartCard + " block hover:shadow-md transition-shadow"}>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Hồ sơ cá nhân</h3>
            <p className="mt-2 text-sm text-gray-600">Cập nhật thông tin cá nhân của bạn</p>
          </div>
        </Link>

        <Link href="/user/payments" className={styles.chartCard + " block hover:shadow-md transition-shadow"}>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Thanh toán</h3>
            <p className="mt-2 text-sm text-gray-600">Quản lý gói đăng ký và phương thức thanh toán</p>
          </div>
        </Link>

        <Link href="/user/bookmarks" className={styles.chartCard + " block hover:shadow-md transition-shadow"}>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-medium text-gray-900">Bài viết đã lưu</h3>
            <p className="mt-2 text-sm text-gray-600">Xem danh sách bài viết bạn đã lưu</p>
          </div>
        </Link>

        <Link href="/user/settings" className={styles.chartCard + " block hover:shadow-md transition-shadow"}>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Cài đặt</h3>
            <p className="mt-2 text-sm text-gray-600">Tùy chỉnh cài đặt tài khoản của bạn</p>
          </div>
        </Link>
      </div>

      {/* Account Summary & Recent Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Summary */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Thông tin tài khoản</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Loại tài khoản</span>
                <span className="font-medium flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {user.accountType}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Thành viên từ</span>
                <span className="font-medium">{user.memberSince}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Bài viết đã đọc</span>
                <span className="font-medium">{user.articlesRead}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Bài viết đã lưu</span>
                <span className="font-medium">{user.savedArticles}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Trạng thái đăng ký</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {user.subscriptionStatus}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Gói đăng ký</span>
                <span className="font-medium">{user.subscriptionPlan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thanh toán tiếp theo</span>
                <span className="font-medium">{user.nextBillingDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className={styles.chartCard + " md:col-span-2"}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Bài viết gần đây</h3>
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-full md:w-24 h-16 bg-gray-100 rounded-md flex-shrink-0">
                    <img
                      src={`/placeholder.svg?height=64&width=96&text=Article ${index + 1}`}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{article.title}</h4>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        {article.category}
                      </span>
                      <span>{article.date}</span>
                      <span className="mx-2">•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button variant="ghost" size="sm">
                      Đọc tiếp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

