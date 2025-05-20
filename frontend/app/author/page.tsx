"use client"
import Link from "next/link"
import { ArrowRight, Edit, Eye, FileText, MessageSquare, PenSquare, ThumbsUp } from "lucide-react"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { Button } from "@/components/ui/button"
import styles from "../admin/admin.module.css"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/src/store"
import { handleGetProfile } from "@/src/thunks/auth/authThunk"
import articleApi, { AuthorDashboardData } from "@/src/apis/article"

export default function AuthorDashboard() {
  const dispatch = useAppDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const [dashboardData, setDashboardData] = useState<AuthorDashboardData | null>(null)
  
  useEffect(() => {
    dispatch(handleGetProfile() as any)
  }, [dispatch])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser?.id) return
      
      try {
        const response = await articleApi.getAuthorDashboard(currentUser.id)
        console.log('Dashboard Response:', response)
        if (response) {
          setDashboardData(response)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchDashboardData()
  }, [currentUser?.id])

  // Calculate statistics from currentUser articles
  const stats = {
    total: currentUser?.articles?.length || 0,
    published: currentUser?.articles?.filter(a => a.status === "APPROVED")?.length || 0,
    pending: currentUser?.articles?.filter(a => a.status === "PENDING")?.length || 0,
    draft: currentUser?.articles?.filter(a => a.status === "DRAFT")?.length || 0,
    views: currentUser?.articles?.reduce((sum, article) => sum + (article.views || 0), 0) || 0
  }

  // Calculate percentages for likes and comments
  const likePercentage = dashboardData?.likePercentage ?? 0
  const commentPercentage = dashboardData?.commentPercentage ?? 0

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
              <h2 className="text-2xl font-bold text-gray-900">
                Xin chào {currentUser?.fullname || "Tác giả"}!
              </h2>
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
          <div className={styles.statValue}>{stats.total}</div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="text-green-600 font-medium mr-1">{stats.published}</span> đã xuất bản,
            <span className="text-yellow-600 font-medium mx-1">{stats.pending}</span> chờ duyệt,
            <span className="text-gray-600 font-medium ml-1">{stats.draft}</span> bản nháp
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Lượt thích</div>
            <div className={`${styles.statIconContainer} ${styles.statIconYellow}`}>
              <ThumbsUp className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{dashboardData?.monthlyLikes ?? 0}</div>
          <div className={`${styles.statChange} ${likePercentage > 0 ? styles.statChangePositive : styles.statChangeNegative}`}>
            <ArrowRight className={styles.statChangeIcon} />
            <span>{Math.abs(likePercentage)}% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Bình luận</div>
            <div className={`${styles.statIconContainer} ${styles.statIconPurple}`}>
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{dashboardData?.monthlyComments ?? 0}</div>
          <div className={`${styles.statChange} ${commentPercentage > 0 ? styles.statChangePositive : styles.statChangeNegative}`}>
            <ArrowRight className={styles.statChangeIcon} />
            <span>{Math.abs(commentPercentage)}% so với tháng trước</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Số danh mục</div>
            <div className={`${styles.statIconContainer} ${styles.statIconGreen}`}>
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>{dashboardData?.uniqueCategoryCount ?? 0}</div>
          <div className="text-sm text-gray-500">
            Danh mục đã sử dụng
          </div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="grid grid-cols-1">
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
            {dashboardData?.latestArticles && dashboardData.latestArticles.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeaderCell}>Tiêu đề</th>
                    <th className={styles.tableHeaderCell}>Trạng thái</th>
                    <th className={styles.tableHeaderCell}>Chuyên mục</th>
                    <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                    <th className={styles.tableHeaderCell}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.latestArticles.map((article) => (
                    <tr key={article.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div className="font-medium">{article.title}</div>
                      </td>
                      <td className={styles.tableCell}>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : article.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {article.status === "APPROVED" ? "Đã xuất bản" :
                           article.status === "PENDING" ? "Chờ duyệt" :
                           "Bản nháp"}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {article.category?.name || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : '-'}
                      </td>
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
            ) : (
              <div className="text-center py-4 text-gray-500">Không có bài viết nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
