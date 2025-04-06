import Link from "next/link"
import { ArrowRight, BarChart2, Clock, Edit, Eye, FileText, MessageSquare, PenSquare, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "../admin/admin.module.css"

export default function AuthorDashboard() {
  // Mock author data
  const author = {
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "Tác giả",
    memberSince: "03/04/2025",
    totalArticles: 15,
    publishedArticles: 12,
    pendingArticles: 2,
    draftArticles: 1,
    totalViews: 45678,
    totalLikes: 2345,
    totalComments: 567,
  }

  // Mock recent articles
  const recentArticles = [
    {
      id: "ART-001",
      title: "Đội tuyển Việt Nam giành chiến thắng ấn tượng tại vòng loại World Cup",
      status: "Đã xuất bản",
      category: "Thể thao",
      publishedAt: "04/04/2025",
      views: 10876,
      likes: 543,
      comments: 78,
    },
    {
      id: "ART-002",
      title: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
      status: "Đã xuất bản",
      category: "Kinh doanh",
      publishedAt: "03/04/2025",
      views: 8932,
      likes: 421,
      comments: 56,
    },
    {
      id: "ART-003",
      title: "Dự báo tăng trưởng GDP Việt Nam năm 2025",
      status: "Chờ duyệt",
      category: "Kinh tế",
      publishedAt: "-",
      views: 0,
      likes: 0,
      comments: 0,
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Trang chủ</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Tác giả</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className={styles.chartCard + " mb-6"}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Xin chào, {author.name}!</h2>
              <p className="mt-1 text-gray-600">Chào mừng bạn quay trở lại với trang quản lý tác giả.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/author/articles/add">
                <Button>
                  Viết bài mới
                  <PenSquare className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Tổng bài viết</div>
            <div className={`${styles.statIconContainer} ${styles.statIconBlue}`}>
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{author.totalArticles}</div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="text-green-600 font-medium mr-1">{author.publishedArticles}</span> đã xuất bản,
            <span className="text-yellow-600 font-medium mx-1">{author.pendingArticles}</span> chờ duyệt,
            <span className="text-gray-600 font-medium ml-1">{author.draftArticles}</span> bản nháp
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Lượt xem</div>
            <div className={`${styles.statIconContainer} ${styles.statIconGreen}`}>
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{author.totalViews.toLocaleString()}</div>
          <div className={`${styles.statChange} ${styles.statChangePositive}`}>
            <ArrowRight className={styles.statChangeIcon} />
            <span>5.2% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Lượt thích</div>
            <div className={`${styles.statIconContainer} ${styles.statIconYellow}`}>
              <ThumbsUp className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{author.totalLikes.toLocaleString()}</div>
          <div className={`${styles.statChange} ${styles.statChangePositive}`}>
            <ArrowRight className={styles.statChangeIcon} />
            <span>7.8% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Bình luận</div>
            <div className={`${styles.statIconContainer} ${styles.statIconPurple}`}>
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{author.totalComments.toLocaleString()}</div>
          <div className={`${styles.statChange} ${styles.statChangePositive}`}>
            <ArrowRight className={styles.statChangeIcon} />
            <span>3.4% so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Recent Articles & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className={`${styles.chartCard} md:col-span-2`}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Bài viết gần đây</h3>
            <Link href="/author/articles">
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </div>
          <div className={styles.tableContent}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>Tiêu đề</th>
                  <th className={styles.tableHeaderCell}>Trạng thái</th>
                  <th className={styles.tableHeaderCell}>Chuyên mục</th>
                  <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                  <th className={styles.tableHeaderCell}>Lượt xem</th>
                  <th className={styles.tableHeaderCell}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article) => (
                  <tr key={article.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === "Đã xuất bản"
                            ? "bg-green-100 text-green-800"
                            : article.status === "Chờ duyệt"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                    </td>
                    <td className={styles.tableCell}>{article.publishedAt}</td>
                    <td className={styles.tableCell}>{article.views.toLocaleString()}</td>
                    <td className={styles.tableCell}>
                      <div className="flex space-x-2">
                        <Link href={`/author/articles/${article.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/author/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Hiệu suất</h3>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />7 ngày
            </Button>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-48">
              <BarChart2 className="h-32 w-32 text-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Lượt xem trung bình</div>
                <div className="text-xl font-semibold mt-1">3,789</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Tỷ lệ tương tác</div>
                <div className="text-xl font-semibold mt-1">6.2%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Thời gian đọc TB</div>
                <div className="text-xl font-semibold mt-1">4:32</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Tỷ lệ hoàn thành</div>
                <div className="text-xl font-semibold mt-1">72%</div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/author/analytics">
                <Button variant="outline" className="w-full">
                  Xem phân tích chi tiết
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

