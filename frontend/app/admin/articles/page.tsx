"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import styles from "../admin.module.css"
import { handleGetArticles } from "@/src/thunks/article/articleThunk"
import { AppDispatch } from "@/src/store"
import { selectArticles, selectCurrentPage, selectIsLoading, selectTotalArticles, selectTotalPages } from "@/src/thunks/article/articleSlice"
import userApi from "@/src/apis/user"
import { User } from "@/src/apis/user"

export default function ArticlesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const articles = useSelector(selectArticles)
  const currentPage = useSelector(selectCurrentPage)
  const totalPages = useSelector(selectTotalPages)
  const totalArticles = useSelector(selectTotalArticles)
  const isLoading = useSelector(selectIsLoading)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    console.log('Fetching articles with page:', currentPage);
    dispatch(handleGetArticles({ page: currentPage, per_page: 10 }))
  }, [dispatch, currentPage])

  useEffect(() => {
    console.log('Current articles state:', { articles, totalArticles, currentPage, totalPages });
  }, [articles, totalArticles, currentPage, totalPages])

  const handleSearch = () => {
    dispatch(handleGetArticles({ page: 1, per_page: 10, search: searchQuery }))
  }

  const handlePageChange = (page: number) => {
    dispatch(handleGetArticles({ page, per_page: 10, search: searchQuery }))
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý bài viết</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Bài viết</div>
        </div>
      </div>

      {/* Articles Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Tất cả bài viết</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm bài viết..."
                className="pl-8 h-9 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
            <Link href="/admin/articles/add">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm bài viết
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles.tableContent}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>ID</th>
                <th className={styles.tableHeaderCell}>Tiêu đề</th>
                <th className={styles.tableHeaderCell}>Chuyên mục</th>
                <th className={styles.tableHeaderCell}>Tác giả</th>
                <th className={styles.tableHeaderCell}>Trạng thái</th>
                <th className={styles.tableHeaderCell}>Lượt xem</th>
                <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                <th className={styles.tableHeaderCell}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                console.log('Rendering table:', { isLoading, articlesCount: articles.length });
                if (isLoading) {
                  return (
                    <tr>
                      <td colSpan={8} className="text-center py-4">Đang tải...</td>
                    </tr>
                  );
                }
                return articles.map((article) => (
                <tr key={article.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{article.id}</td>
                  <td className={styles.tableCell}>
                    <div className="font-medium">{article.title || 'Không có tiêu đề'}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category?.name || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {article.author?.fullname || 'Không có tác giả'}
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : article.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {article.status === "PUBLISHED" ? "Đã xuất bản" : 
                       article.status === "PENDING" ? "Chờ duyệt" :
                       article.status === "DRAFT" ? "Bản nháp" : "Từ chối"}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{article.views?.toLocaleString() || '0'}</td>
                  <td className={styles.tableCell}>
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleString('vi-VN') : "-"}
                  </td>
                  <td className={styles.tableCell}>
                    <div className="flex space-x-2">
                      <Link href={`/admin/articles/${article.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
        <div className={styles.tableFooter}>
          <div className={styles.paginationInfo}>
            Hiển thị {articles.length > 0 ? (currentPage - 1) * 10 + 1 : 0} đến {Math.min(currentPage * 10, totalArticles)} trong tổng số {totalArticles} bài viết
          </div>
          <div className={styles.paginationControls}>
            <button 
              className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return [
                    <button key={`ellipsis-${page}`} className={styles.paginationButton} disabled>...</button>,
                    <button
                      key={page}
                      className={`${styles.paginationButton} ${currentPage === page ? styles.paginationButtonActive : ''}`}
                      onClick={() => handlePageChange(page)}
                      disabled={isLoading}
                    >
                      {page}
                    </button>
                  ]
                }
                return (
                  <button
                    key={page}
                    className={`${styles.paginationButton} ${currentPage === page ? styles.paginationButtonActive : ''}`}
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                  >
                    {page}
                  </button>
                )
              })}
            <button 
              className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
