import {
  BarChart2,
  Calendar,
  ChevronDown,
  Download,
  TrendingUp,
  Users,
  Eye,
  FileText,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "../admin.module.css"

export default function StatisticsPage() {
  // Mock statistics data
  const monthlyStats = {
    views: 1245678,
    articles: 342,
    comments: 5678,
    users: 1245,
  }

  const categoryStats = [
    { name: "Thời sự", articles: 87, views: 345678, comments: 1245 },
    { name: "Thế giới", articles: 65, views: 234567, comments: 876 },
    { name: "Kinh doanh", articles: 54, views: 198765, comments: 654 },
    { name: "Công nghệ", articles: 43, views: 176543, comments: 543 },
    { name: "Thể thao", articles: 76, views: 287654, comments: 1432 },
    { name: "Du lịch", articles: 32, views: 98765, comments: 321 },
    { name: "Sức khỏe", articles: 28, views: 87654, comments: 298 },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Thống kê</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Thống kê</div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" className="mr-2">
            <Calendar className="h-4 w-4 mr-2" />
            Tháng 4, 2025
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline">
            So sánh với
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Tổng lượt xem</div>
            <div className={`${styles.statIconContainer} ${styles.statIconBlue}`}>
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{monthlyStats.views.toLocaleString()}</div>
          <div className={`${styles.statChange} ${styles.statChangePositive}`}>
            <TrendingUp className={styles.statChangeIcon} />
            <span>8.5% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Bài viết</div>
            <div className={`${styles.statIconContainer} ${styles.statIconGreen}`}>
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{monthlyStats.articles}</div>
          <div className={`${styles.statChange} ${styles.statChangePositive}`}>
            <TrendingUp className={styles.statChangeIcon} />
            <span>5.2% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Bình luận</div>
            <div className={`${styles.statIconContainer} ${styles.statIconYellow}`}>
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{monthlyStats.comments.toLocaleString()}</div>
          <div className={`${styles.statChange} ${styles.statChangePositive}`}>
            <TrendingUp className={styles.statChangeIcon} />
            <span>12.3% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Người dùng</div>
            <div className={`${styles.statIconContainer} ${styles.statIconPurple}`}>
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{monthlyStats.users.toLocaleString()}</div>
          <div className={`${styles.statChange} ${styles.statChangePositive}`}>
            <TrendingUp className={styles.statChangeIcon} />
            <span>3.7% so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className={styles.tableCard + " mt-6"}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Thống kê theo chuyên mục</h3>
          <Button variant="outline" size="sm">
            <BarChart2 className="h-4 w-4 mr-2" />
            Xem biểu đồ
          </Button>
        </div>
        <div className={styles.tableContent}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>Chuyên mục</th>
                <th className={styles.tableHeaderCell}>Số bài viết</th>
                <th className={styles.tableHeaderCell}>Lượt xem</th>
                <th className={styles.tableHeaderCell}>Bình luận</th>
                <th className={styles.tableHeaderCell}>Tỷ lệ tương tác</th>
                <th className={styles.tableHeaderCell}>Xu hướng</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((category, index) => {
                // Calculate engagement rate (comments per view)
                const engagementRate = ((category.comments / category.views) * 100).toFixed(2)

                return (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.name}
                      </span>
                    </td>
                    <td className={styles.tableCell}>{category.articles}</td>
                    <td className={styles.tableCell}>{category.views.toLocaleString()}</td>
                    <td className={styles.tableCell}>{category.comments.toLocaleString()}</td>
                    <td className={styles.tableCell}>{engagementRate}%</td>
                    <td className={styles.tableCell}>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500">+5.3%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Lượt xem theo thời gian</h3>
            <Button variant="outline" size="sm">
              Tuần này
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className={styles.chartContent + " h-80"}>
            <div className="flex items-center justify-center h-full">
              <BarChart2 className="h-32 w-32 text-gray-300" />
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Phân bố người đọc</h3>
            <Button variant="outline" size="sm">
              Tuần này
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className={styles.chartContent + " h-80"}>
            <div className="flex items-center justify-center h-full">
              <BarChart2 className="h-32 w-32 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

