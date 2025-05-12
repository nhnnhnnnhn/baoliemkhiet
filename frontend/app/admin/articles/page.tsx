"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Edit, Eye, Filter, Plus, RefreshCw, Search, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import {
  handleGetArticles,
  handleDeleteArticle,
  handleDeleteMultipleArticles
} from "@/src/thunks/article/articleThunk"
import {
  selectArticles,
  selectTotalArticles,
  selectCurrentPage,
  selectTotalPages,
  selectIsLoading,
  selectError,
  selectDeleteArticleSuccess,
  selectDeleteArticleError,
  selectIsDeletingArticle,
  clearDeleteArticleState
} from "@/src/thunks/article/articleSlice"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { format, isValid, parseISO } from "date-fns"
import styles from "../admin.module.css"

export default function ArticlesPage() {
  const dispatch = useAppDispatch()
  
  // Redux selectors
  const articles = useAppSelector(selectArticles)
  const totalArticles = useAppSelector(selectTotalArticles)
  const currentPage = useAppSelector(selectCurrentPage)
  const totalPages = useAppSelector(selectTotalPages)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const isDeletingArticle = useAppSelector(selectIsDeletingArticle)
  const deleteArticleSuccess = useAppSelector(selectDeleteArticleSuccess)
  const deleteArticleError = useAppSelector(selectDeleteArticleError)
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemsPerPage] = useState(10)
  
  // Fetch articles on component mount
  useEffect(() => {
    dispatch(handleGetArticles({}))
  }, [dispatch])
  
  // Handle search
  const handleSearch = () => {
    dispatch(handleGetArticles({ search: searchQuery }))
  }
  
  // Handle keypress for search
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  // Handle delete success/error
  useEffect(() => {
    if (deleteArticleSuccess) {
      toast({
        title: "Thành công",
        description: "Đã xóa bài viết thành công",
        variant: "success"
      })
      dispatch(clearDeleteArticleState())
      setIsDeleteDialogOpen(false)
    }
    
    if (deleteArticleError) {
      toast({
        title: "Lỗi",
        description: deleteArticleError,
        variant: "destructive"
      })
      dispatch(clearDeleteArticleState())
    }
  }, [deleteArticleSuccess, deleteArticleError, dispatch])
  
  // Pagination handlers
  const handlePageChange = (page: number) => {
    dispatch(handleGetArticles({ page, limit: itemsPerPage }))
  }
  
  // Open delete confirmation dialog
  const openDeleteDialog = (id: number) => {
    setSelectedArticleId(id)
    setIsDeleteDialogOpen(true)
  }
  
  // Confirm delete article
  const confirmDeleteArticle = () => {
    if (!selectedArticleId) return
    
    // API yêu cầu ID là số nguyên
    const articleId = Number(selectedArticleId)
    const action = handleDeleteArticle(articleId)
    dispatch(action)
  }
  
  // Handle refresh
  const handleRefresh = () => {
    dispatch(handleGetArticles({}))
  }
  
  // Mapping status values to Vietnamese display text
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Đã xuất bản'
      case 'APPROVED': 
        return 'Đã duyệt'  
      case 'DRAFT':
        return 'Bản nháp'
      case 'PENDING':
        return 'Chờ duyệt'
      case 'REJECTED':
        return 'Đã từ chối'
      default:
        console.log('Trạng thái không xác định:', status);
        return 'Không xác định'
    }
  }
  
  // Get CSS class for status badges
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'APPROVED': 
        return 'bg-green-100 text-green-800'  // Thêm trường hợp APPROVED
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
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
                <th className={styles.tableHeaderCell}>Bình luận</th>
                <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                <th className={styles.tableHeaderCell}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-10" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-full" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-10" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-10" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">Không có dữ liệu</td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{article.id}</td>
                    <td className={styles.tableCell}>
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className={styles.tableCell}>
                      {article.category?.name || 'Chưa phân loại'}
                    </td>
                    <td className={styles.tableCell}>
                      {article.author?.fullname || article.author?.name || 'Không xác định'}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(article.status)}`}>
                        {getStatusDisplay(article.status)}
                      </span>
                    </td>
                    <td className={styles.tableCell}>{article.view ? article.view.toLocaleString() : '0'}</td>
                    <td className={styles.tableCell}>0</td>
                    <td className={styles.tableCell}>
                      {article.published_at 
                        ? (() => {
                            try {
                              // Kiểm tra xem chuỗi ngày có hợp lệ không
                              const date = new Date(article.published_at);
                              return !isNaN(date.getTime()) 
                                ? format(date, 'dd/MM/yyyy') 
                                : 'Ngày không hợp lệ';
                            } catch (error) {
                              console.error('Lỗi xử lý ngày:', article.published_at, error);
                              return 'Ngày không hợp lệ';
                            }
                          })() 
                        : (article.status as string) === 'APPROVED' || (article.status as string) === 'PUBLISHED' 
                          ? format(new Date(), 'dd/MM/yyyy') // Nếu đã duyệt nhưng không có ngày, hiển thị ngày hiện tại
                          : '-'}
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex items-center space-x-1">
                        <Link href={article.slug ? `/article/${article.slug}` : '#'} target="_blank" onClick={e => {
                          if (!article.slug) {
                            e.preventDefault();
                            toast({
                              title: "Lỗi",
                              description: "Bài viết không có slug hoặc chưa được xuất bản",
                              variant: "destructive"
                            });
                          }
                        }}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Xem bài viết">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Chỉnh sửa bài viết">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(article.id)}
                          disabled={isDeletingArticle}
                          aria-label="Xóa bài viết"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.tableFooter}>
          <div className={styles.paginationInfo}>
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              `Hiển thị ${(currentPage - 1) * itemsPerPage + 1} đến ${Math.min(currentPage * itemsPerPage, totalArticles)} trong tổng số ${totalArticles} bài viết`
            )}
          </div>
          <div className={styles.paginationControls}>
            <button 
              className={`${styles.paginationButton} ${currentPage <= 1 ? styles.paginationButtonDisabled : ''}`} 
              disabled={currentPage <= 1 || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Trang trước"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button 
                  key={page}
                  className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonActive : ''}`}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  aria-label={`Trang ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
            
            <button 
              className={`${styles.paginationButton} ${currentPage >= totalPages ? styles.paginationButtonDisabled : ''}`} 
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Trang tiếp theo"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeletingArticle}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={confirmDeleteArticle} disabled={isDeletingArticle}>
                {isDeletingArticle ? 'Đang xóa...' : 'Xóa bài viết'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
