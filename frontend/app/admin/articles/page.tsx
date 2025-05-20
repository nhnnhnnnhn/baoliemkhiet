"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Edit, Eye, Filter, MoreHorizontal, Plus, RefreshCw, Search, Trash2, CheckCircle, XCircle, ArrowUp, ArrowDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import {
  handleGetArticles,
  handleDeleteArticle,
  handleDeleteMultipleArticles,
  handleApproveArticle,
  handleRejectArticle,
  handleSearchArticles
} from "@/src/thunks/article/articleThunk"
import {
  selectArticles,
  selectFilteredArticles,
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
import { useSearchParams } from "next/navigation"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ArticlesPage() {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const highlightedArticleId = searchParams.get('highlight')
  const highlightedRowRef = useRef<HTMLTableRowElement>(null)
  
  // Redux selectors
  const articles = useAppSelector(selectArticles)
  const filteredArticles = useAppSelector(selectFilteredArticles)
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
  const [isSearching, setIsSearching] = useState(false)
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<string>('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // Add highlight styles to the document
  useEffect(() => {
    const highlightStyles = `
      @keyframes highlightAnimation {
        0% { background-color: rgba(255, 82, 82, 0.4); }
        50% { background-color: rgba(255, 82, 82, 0.7); }
        100% { background-color: rgba(255, 82, 82, 0.3); }
      }
      
      .highlight-row {
        background-color: rgba(255, 82, 82, 0.3);
      }
      
      .highlight-animation {
        animation: highlightAnimation 2s ease-in-out;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = highlightStyles;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  // Fetch articles on component mount or when page changes
  useEffect(() => {
    dispatch(handleGetArticles({
      page: currentPage,
      limit: 10,
      sort: sortField,
      order: sortOrder
    }))
  }, [dispatch, currentPage, sortField, sortOrder])
  
  // Không cần phải sắp xếp thủ công nữa, vì backend đã xử lý
  const displayArticles = isSearching ? filteredArticles : articles;
  
  // Handle search input change with debounce
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Set new timeout to debounce the search (300ms)
    const timeout = setTimeout(() => {
      if (value.trim() === '') {
        // If search query is empty, get all articles
        setIsSearching(false)
        dispatch(handleGetArticles({
          page: currentPage,
          limit: 10,
          sort: sortField,
          order: sortOrder
        }))
      } else {
        // Otherwise use the search API
        setIsSearching(true)
        dispatch(handleSearchArticles(value))
      }
    }, 300)
    
    setSearchTimeout(timeout)
  }
  
  // Handle keypress for search
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() === '') {
        setIsSearching(false)
        dispatch(handleGetArticles({
          page: currentPage, 
          limit: 10, 
          sort: sortField, 
          order: sortOrder
        }))
      } else {
        setIsSearching(true)
        dispatch(handleSearchArticles(searchQuery))
      }
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
    dispatch(handleGetArticles({
      page,
      limit: 10,
      sort: sortField,
      order: sortOrder
    }))
  }
  
  // Handle sort
  const handleSort = (field: string) => {
    // If clicking on the same field, toggle the sort order
    const newOrder = field === sortField ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    
    // Update state
    setSortField(field);
    setSortOrder(newOrder);
    
    // Reset to first page when sorting
    dispatch(handleGetArticles({
      page: 1,
      limit: 10,
      sort: field,
      order: newOrder
    }));
  }
  
  // Open delete confirmation dialog
  const openDeleteDialog = (id: number) => {
    setSelectedArticleId(id)
    setIsDeleteDialogOpen(true)
  }
  
  // Confirm delete article
  const confirmDeleteArticle = () => {
    if (!selectedArticleId) return
    onDeleteArticle(selectedArticleId)
  }
  
  // Handle refresh
  const handleRefresh = () => {
    dispatch(handleGetArticles({
      page: 1,
      limit: 10,
      sort: sortField,
      order: sortOrder
    }))
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

  // Tìm trang chứa bài viết được highlight
  useEffect(() => {
    if (highlightedArticleId && !isLoading) {
      // Tìm bài viết trong danh sách hiện tại
      const found = articles.some(article => article.id.toString() === highlightedArticleId);
      
      if (!found && totalPages > 1) {
        // Nếu không tìm thấy và có nhiều trang, thì tìm kiếm qua các trang
        
        // Hàm kiểm tra từng trang
        const checkPage = async (page: number): Promise<number | false> => {
          if (page > totalPages) return false;
          
          try {
            const result = await dispatch(handleGetArticles({
              page, 
              limit: 10,
              sort: sortField,
              order: sortOrder
            })).unwrap();
            
            // Kiểm tra xem bài viết có trong kết quả không
            const foundInPage = result.articles.some(article => article.id.toString() === highlightedArticleId);
            
            if (foundInPage) {
              return page;
            } else {
              return checkPage(page + 1);
            }
          } catch (error) {
            console.error("Lỗi khi tìm bài viết:", error);
            return false;
          }
        };
        
        // Bắt đầu kiểm tra từ trang 1
        checkPage(1).then(foundPage => {
          if (foundPage && foundPage !== currentPage) {
            handlePageChange(foundPage);
          }
        });
      }
    }
  }, [highlightedArticleId, isLoading, articles, currentPage, totalPages, dispatch, sortField, sortOrder, handlePageChange]);

  // Handle highlighting the reported article
  useEffect(() => {
    if (highlightedArticleId && !isLoading) {
      // Tìm bài viết trong danh sách hiện tại
      const articleToHighlight = articles.find(
        article => article.id.toString() === highlightedArticleId
      );
      
      // Nếu tìm thấy và có ref
      if (articleToHighlight && highlightedRowRef.current) {
        // Scroll đến bài viết
        highlightedRowRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
        
        // Thêm animation
        highlightedRowRef.current.classList.add('highlight-animation');
        
        // Giữ highlight và loại bỏ animation sau khi hoàn tất
        const timer = setTimeout(() => {
          if (highlightedRowRef.current) {
            highlightedRowRef.current.classList.remove('highlight-animation');
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [highlightedArticleId, articles, isLoading]);

  // Add these functions after getStatusClass
  const onApproveArticle = async (id: number) => {
    try {
      const result = await dispatch(handleApproveArticle(id)).unwrap()
      if (result) {
        toast({
          title: "Thành công",
          description: "Đã duyệt bài viết thành công",
          variant: "success"
        })
        dispatch(handleGetArticles({
          page: currentPage,
          limit: 10,
          sort: sortField,
          order: sortOrder
        }))
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể duyệt bài viết",
        variant: "destructive"
      })
    }
  }

  const onRejectArticle = async (id: number) => {
    try {
      const result = await dispatch(handleRejectArticle(id)).unwrap()
      if (result) {
        toast({
          title: "Thành công",
          description: "Đã từ chối bài viết thành công",
          variant: "success"
        })
        dispatch(handleGetArticles({
          page: currentPage,
          limit: 10,
          sort: sortField,
          order: sortOrder
        }))
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể từ chối bài viết",
        variant: "destructive"
      })
    }
  }

  const onDeleteArticle = async (id: number) => {
    try {
      await dispatch(handleDeleteArticle(id)).unwrap()
      toast({
        title: "Thành công",
        description: "Đã xóa bài viết thành công",
        variant: "success"
      })
      dispatch(handleGetArticles({
        page: currentPage,
        limit: 10,
        sort: sortField,
        order: sortOrder
      }))
      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa bài viết",
        variant: "destructive"
      })
    }
  }

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (field !== sortField) return null;
    
    return sortOrder === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
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
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
              />
            </div>
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
                <th 
                  className={`${styles.tableHeaderCell} cursor-pointer`} 
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID {renderSortIndicator('id')}
                  </div>
                </th>
                <th className={styles.tableHeaderCell}>Tiêu đề</th>
                <th className={styles.tableHeaderCell}>Chuyên mục</th>
                <th className={styles.tableHeaderCell}>Tác giả</th>
                <th className={styles.tableHeaderCell}>Trạng thái</th>
                <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                <th className={styles.tableHeaderCell}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array(10).fill(0).map((_, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-10" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-full" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                    <td className={styles.tableCell}><Skeleton className="h-4 w-20" /></td>
                  </tr>
                ))
              ) : articles.length === 0 && !isSearching ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">Không có dữ liệu</td>
                </tr>
              ) : isSearching && filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">Không tìm thấy kết quả phù hợp</td>
                </tr>
              ) : (
                displayArticles.map((article) => (
                  <tr 
                    key={article.id} 
                    className={`${styles.tableRow} ${highlightedArticleId && article.id.toString() === highlightedArticleId ? 'highlight-row' : ''}`}
                    ref={highlightedArticleId && article.id.toString() === highlightedArticleId ? highlightedRowRef : null}
                  >
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
                    <td className={styles.tableCell + " whitespace-nowrap"}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(article.status)}`}
                        style={{whiteSpace: 'nowrap'}}>
                        {getStatusDisplay(article.status)}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {article.publishedAt ? (
                        format(new Date(article.publishedAt), 'dd/MM/yyyy HH:mm')
                      ) : article.status === 'APPROVED' && (article.created_at) ? (
                        format(new Date(article.created_at), 'dd/MM/yyyy HH:mm')
                      ) : (
                        <span className="text-gray-500">Chưa xuất bản</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/articles/${article.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            {article.status === 'PENDING' && (
                              <>
                                <DropdownMenuItem onClick={() => onApproveArticle(article.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Duyệt bài viết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onRejectArticle(article.id)}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Từ chối bài viết
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem asChild>
                              <Link href={`/article/${article.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(article.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa bài viết
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              `Hiển thị ${articles.length > 0 ? (currentPage - 1) * 10 + 1 : 0} đến ${Math.min(currentPage * 10, totalArticles)} trong tổng số ${totalArticles} bài viết`
            )}
          </div>
          <div className={styles.paginationControls}>
            {/* First page */}
            <button
              className={`${styles.paginationButton} ${currentPage <= 1 ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1 || isLoading}
              aria-label="Trang đầu tiên"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-[-0.5rem]" />
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* Previous page */}
            <button
              className={`${styles.paginationButton} ${currentPage <= 1 ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              aria-label="Trang trước"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonActive : ''}`}
                    disabled={isLoading}
                    aria-label={`Trang ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 3 || page === currentPage + 3) {
                return <span key={page} className={styles.paginationEllipsis}>...</span>;
              }
              return null;
            })}

            {/* Next page */}
            <button
              className={`${styles.paginationButton} ${currentPage >= totalPages ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              aria-label="Trang sau"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            {/* Last page */}
            <button
              className={`${styles.paginationButton} ${currentPage >= totalPages ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages || isLoading}
              aria-label="Trang cuối cùng"
            >
              <ChevronRightIcon className="h-4 w-4 ml-[-0.5rem]" />
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
