"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowDownIcon, ArrowUpIcon, Eye, MessageSquare, PenSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetStatistics, handleGetWeeklyViews, handleGetMostViewedArticles } from "@/src/thunks/dashboard/dashboardThunk"
import categoryApi from "@/src/apis/category"
import { selectDashboardStatistics, selectDashboardLoading, selectWeeklyViews } from "@/src/thunks/dashboard/dashboardSlice"

import { Button } from "@/components/ui/button"
import styles from "./admin.module.css"

export default function AdminDashboard() {
  const dispatch = useAppDispatch()
  const statistics = useAppSelector(selectDashboardStatistics)
  const weeklyViews = useAppSelector(selectWeeklyViews)
  const mostViewedArticles = useAppSelector((state) => state.dashboard.mostViewedArticles)
  const isLoading = useAppSelector(selectDashboardLoading)
  const [categories, setCategories] = useState<{[key: string]: string}>({})

  useEffect(() => {
    dispatch(handleGetStatistics())
    dispatch(handleGetWeeklyViews())
    dispatch(handleGetMostViewedArticles())
  }, [dispatch])

  useEffect(() => {
    if (mostViewedArticles && mostViewedArticles.length > 0) {
      // Lấy unique categoryIds
      const uniqueCategoryIds = [...new Set(mostViewedArticles
        .map(article => article.categoryId)
        .filter(id => id != null))] as number[]

      // Fetch thông tin của tất cả categories
      Promise.all(
        uniqueCategoryIds.map(id =>
          categoryApi.getCategoryById(id)
            .then(category => [id.toString(), category.name])
        )
      ).then(results => {
        const categoryMap = Object.fromEntries(results)
        setCategories(categoryMap)
      }).catch(error => {
        console.error('Error fetching categories:', error)
      })
    }
  }, [mostViewedArticles])

  // Calculate percentage changes
  const viewsChange = statistics ? parseFloat(statistics.viewPercentage) : 0
  const articlesChange = statistics ? parseFloat(statistics.articlePercentage) : 0
  const commentsChange = statistics ? parseFloat(statistics.commentPercentage) : 0

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Vừa xong'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  }

  // Đảm bảo đường dẫn hình ảnh không rỗng
  const chartImagePath = "/business-growth-chart.png"

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
          <div className={styles.statValue}>
            {isLoading ? "Loading..." : statistics?.viewsInThisMonth?.toLocaleString() || "0"}
          </div>
          <div className={styles.statChange}>
            <span>{Math.abs(viewsChange).toFixed(1)}%</span>
            {viewsChange >= 0 ? (
              <span className={styles.statChangePositive}>
                <ArrowUpIcon className={styles.statChangeIcon} /> tăng so với tháng trước
              </span>
            ) : (
              <span className={styles.statChangeNegative}>
                <ArrowDownIcon className={styles.statChangeIcon} /> giảm so với tháng trước
              </span>
            )}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Bài viết trong tháng</div>
            <div className={`${styles.statIconContainer} ${styles.statIconGreen}`}>
              <PenSquare className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>
            {isLoading ? "Loading..." : statistics?.countArticlesInThisMonth || "0"}
          </div>
          <div className={styles.statChange}>
            <span>{Math.abs(articlesChange).toFixed(1)}%</span>
            {articlesChange >= 0 ? (
              <span className={styles.statChangePositive}>
                <ArrowUpIcon className={styles.statChangeIcon} /> tăng so với tháng trước
              </span>
            ) : (
              <span className={styles.statChangeNegative}>
                <ArrowDownIcon className={styles.statChangeIcon} /> giảm so với tháng trước
              </span>
            )}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statTitle}>Bình luận trong tháng</div>
            <div className={`${styles.statIconContainer} ${styles.statIconYellow}`}>
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className={styles.statValue}>
            {isLoading ? "Loading..." : statistics?.commentsInThisMonth || "0"}
          </div>
          <div className={styles.statChange}>
            <span>{Math.abs(commentsChange).toFixed(1)}%</span>
            {commentsChange >= 0 ? (
              <span className={styles.statChangePositive}>
                <ArrowUpIcon className={styles.statChangeIcon} /> tăng so với tuần trước
              </span>
            ) : (
              <span className={styles.statChangeNegative}>
                <ArrowDownIcon className={styles.statChangeIcon} /> giảm so với tuần trước
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Lượt xem theo tuần</h3>
          </div>
          <div className={styles.chartContent}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : weeklyViews ? (
              <div className="h-full w-full p-6">
                <div className="grid grid-cols-4 gap-4 h-full">
                  <div className="flex flex-col items-center justify-end">
                    <div className="text-sm text-gray-500 mb-2">Tuần 1</div>
                    <div className="w-full bg-blue-100 rounded-t-lg" style={{ height: `${(weeklyViews.week1 / Math.max(weeklyViews.week1, weeklyViews.week2, weeklyViews.week3, weeklyViews.week4)) * 100}%` }}></div>
                    <div className="text-sm font-medium mt-2">{weeklyViews.week1.toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-center justify-end">
                    <div className="text-sm text-gray-500 mb-2">Tuần 2</div>
                    <div className="w-full bg-blue-200 rounded-t-lg" style={{ height: `${(weeklyViews.week2 / Math.max(weeklyViews.week1, weeklyViews.week2, weeklyViews.week3, weeklyViews.week4)) * 100}%` }}></div>
                    <div className="text-sm font-medium mt-2">{weeklyViews.week2.toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-center justify-end">
                    <div className="text-sm text-gray-500 mb-2">Tuần 3</div>
                    <div className="w-full bg-blue-300 rounded-t-lg" style={{ height: `${(weeklyViews.week3 / Math.max(weeklyViews.week1, weeklyViews.week2, weeklyViews.week3, weeklyViews.week4)) * 100}%` }}></div>
                    <div className="text-sm font-medium mt-2">{weeklyViews.week3.toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-center justify-end">
                    <div className="text-sm text-gray-500 mb-2">Tuần 4</div>
                    <div className="w-full bg-blue-400 rounded-t-lg" style={{ height: `${(weeklyViews.week4 / Math.max(weeklyViews.week1, weeklyViews.week2, weeklyViews.week3, weeklyViews.week4)) * 100}%` }}></div>
                    <div className="text-sm font-medium mt-2">{weeklyViews.week4.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Articles Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Bài viết nổi bật trong tháng</h3>
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className={styles.tableCell}>
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  </td>
                </tr>
              ) : mostViewedArticles && mostViewedArticles.length > 0 ? (
                mostViewedArticles.map((article) => {
                  console.log('Article data:', {
                    id: article.id,
                    title: article.title,
                    category: article.category,
                    categoryName: article.category?.name
                  });
                  return (
                  <tr key={article.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.categoryId ? categories[article.categoryId] || 'Đang tải...' : 'Chưa phân loại'}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        {article.view?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className={styles.tableCell}>{formatRelativeTime(article.publishedAt)}</td>
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
                )})
              ) : (
                <tr>
                  <td colSpan={5} className={styles.tableCell}>
                    <div className="text-center py-4 text-gray-500">
                      Không có bài viết nào
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
