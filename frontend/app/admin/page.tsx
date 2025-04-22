import Link from "next/link"
import { ArrowDownIcon, ArrowUpIcon, Eye, MessageSquare, PenSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "./admin.module.css"

export default function AdminDashboard() {
  // Mock data for dashboard
  const stats = {
    monthlyViews: {
      current: 256789,
      previous: 234567,
      change: 9.5,
    },
    monthlyArticles: {
      current: 342,
      previous: 315,
      change: 8.6,
    },
    dailyComments: {
      current: 178,
      previous: 195,
      change: -8.7,
    },
  }

  // Calculate percentage changes
  const viewsChange = ((stats.monthlyViews.current - stats.monthlyViews.previous) / stats.monthlyViews.previous) * 100
  const articlesChange =
    ((stats.monthlyArticles.current - stats.monthlyArticles.previous) / stats.monthlyArticles.previous) * 100
  const commentsChange =
    ((stats.dailyComments.current - stats.dailyComments.previous) / stats.dailyComments.previous) * 100

  // Mock data for top articles
  const topArticles = [
    {
      id: 1,
      title: "Chính phủ công bố kế hoạch phát triển kinh tế 5 năm tới",
      category: "Thời sự",
      views: 12543,
      publishedAt: "2 giờ trước",
    },
    {
      id: 2,
      title: "Đội tuyển Việt Nam giành chiến thắng ấn tượng tại vòng loại World Cup",
      category: "Thể thao",
      views: 10876,
      publishedAt: "5 giờ trước",
    },
    {
      id: 3,
      title: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
      category: "Kinh doanh",
      views: 8932,
      publishedAt: "8 giờ trước",
    },
    {
      id: 4,
      title: "Công nghệ AI đang thay đổi ngành y tế như thế nào",
      category: "Công nghệ",
      views: 7654,
      publishedAt: "10 giờ trước",
    },
    {
      id: 5,
      title: "10 điểm du lịch hấp dẫn nhất Việt Nam trong mùa hè này",
      category: "Du lịch",
      views: 6789,
      publishedAt: "12 giờ trước",
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Bảng điều khiển</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Bảng điều khiển</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Lượt xem trong tháng</div>
            <div className={`${styles.statIconContainer} ${styles.statIconBlue}`}>
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{stats.monthlyViews.current.toLocaleString()}</div>
          <div
            className={`${styles.statChange} ${viewsChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}`}
          >
            {viewsChange >= 0 ? (
              <ArrowUpIcon className={styles.statChangeIcon} />
            ) : (
              <ArrowDownIcon className={styles.statChangeIcon} />
            )}
            <span>{Math.abs(viewsChange).toFixed(1)}% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Bài viết trong tháng</div>
            <div className={`${styles.statIconContainer} ${styles.statIconGreen}`}>
              <PenSquare className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{stats.monthlyArticles.current}</div>
          <div
            className={`${styles.statChange} ${articlesChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}`}
          >
            {articlesChange >= 0 ? (
              <ArrowUpIcon className={styles.statChangeIcon} />
            ) : (
              <ArrowDownIcon className={styles.statChangeIcon} />
            )}
            <span>{Math.abs(articlesChange).toFixed(1)}% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Bình luận trong ngày</div>
            <div className={`${styles.statIconContainer} ${styles.statIconYellow}`}>
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{stats.dailyComments.current}</div>
          <div
            className={`${styles.statChange} ${commentsChange >= 0 ? styles.statChangePositive : styles.statChangeNegative}`}
          >
            {commentsChange >= 0 ? (
              <ArrowUpIcon className={styles.statChangeIcon} />
            ) : (
              <ArrowDownIcon className={styles.statChangeIcon} />
            )}
            <span>{Math.abs(commentsChange).toFixed(1)}% so với hôm qua</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Lượt xem theo ngày</h3>
            <div className={styles.chartActions}>
              <Button variant="outline" size="sm">
                Tháng này
              </Button>
            </div>
          </div>
          <div className={styles.chartContent}>
            {/* Placeholder for daily views chart */}
            <div className="flex items-center justify-center h-full">
              <img src="/business-growth-chart.png" alt="Chart Placeholder" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Articles Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Bài viết nổi bật trong ngày</h3>
          <Button variant="outline" size="sm">
            Xem tất cả
          </Button>
        </div>
        <div className={styles.tableContent}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>Tiêu đề</th>
                <th className={styles.tableHeaderCell}>Chuyên mục</th>
                <th className={styles.tableHeaderCell}>Lượt xem</th>
                <th className={styles.tableHeaderCell}>Thời gian</th>
                <th className={styles.tableHeaderCell}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {topArticles.map((article) => (
                <tr key={article.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className="font-medium">{article.title}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-gray-400 mr-1" />
                      {article.views.toLocaleString()}
                    </div>
                  </td>
                  <td className={styles.tableCell}>{article.publishedAt}</td>
                  <td className={styles.tableCell}>
                    <div className="flex space-x-2">
                      <Link href={`/admin/articles/${article.id}`}>
                        <Button variant="ghost" size="sm">
                          Xem
                        </Button>
                      </Link>
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Sửa
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
