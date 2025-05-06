import Link from "next/link"
import { ArrowRight, Eye, FileText, MessageSquare, ThumbsUp } from "lucide-react"

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

      {/* Recent Articles */}
      <div className={styles.chartCard}>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
