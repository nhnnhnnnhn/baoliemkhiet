"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon, Edit, Eye, Filter, Heart, MessageSquare, PenSquare, Search, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetArticlesByAuthor, handleDeleteArticle } from "@/src/thunks/article/articleThunk"
import { selectArticles, selectIsLoading } from "@/src/thunks/article/articleSlice"
import { handleGetProfile } from "@/src/thunks/auth/authThunk"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import styles from "../author.module.css"

// Định nghĩa các trạng thái và mapping
const ARTICLE_STATUS = {
  APPROVED: {
    value: "APPROVED",
    label: "Đã xuất bản",
    color: "bg-green-100 text-green-800"
  },
  PENDING: {
    value: "PENDING",
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-800"
  },
  DRAFT: {
    value: "DRAFT",
    label: "Bản nháp",
    color: "bg-gray-100 text-gray-800"
  },
  REJECTED: {
    value: "REJECTED",
    label: "Đã từ chối",
    color: "bg-red-100 text-red-800"
  }
} as const

type ArticleStatus = keyof typeof ARTICLE_STATUS

// Định nghĩa các tùy chọn lọc theo thời gian
const TIME_FILTERS = {
  ALL: {
    value: "all",
    label: "Tất cả",
    getDateRange: () => ({ start: null, end: null })
  },
  TODAY: {
    value: "today",
    label: "Hôm nay",
    getDateRange: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return { start: today, end: new Date() }
    }
  },
  YESTERDAY: {
    value: "yesterday",
    label: "Hôm qua",
    getDateRange: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return { start: yesterday, end: today }
    }
  },
  THIS_WEEK: {
    value: "this_week",
    label: "Tuần này",
    getDateRange: () => {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      return { start: startOfWeek, end: new Date() }
    }
  },
  THIS_MONTH: {
    value: "this_month",
    label: "Tháng này",
    getDateRange: () => {
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      return { start: startOfMonth, end: new Date() }
    }
  }
} as const

export default function AuthorArticlesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const articles = useAppSelector(selectArticles)
  const isLoading = useAppSelector(selectIsLoading)
  const currentUser = useAppSelector(selectCurrentUser)
  const authorId = currentUser?.id

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"likes" | "comments" | null>(null)
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null)

  // Filtered and sorted articles
  const filteredArticles = articles?.filter(article => {
    // Tìm kiếm theo nhiều trường
    const searchFields = [
      article.title,
      article.content,
      article.category?.name,
      article.excerpt
    ].filter(Boolean)

    const matchesSearch = searchFields.some(field => 
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Lọc theo trạng thái
    const matchesStatus = statusFilter === "all" || 
      article.status === statusFilter.toUpperCase()

    // Lọc theo thời gian
    const { start, end } = TIME_FILTERS[timeFilter.toUpperCase() as keyof typeof TIME_FILTERS].getDateRange()
    const matchesTime = !start || !end || (
      article.publishedAt && 
      new Date(article.publishedAt) >= start && 
      new Date(article.publishedAt) <= end
    )

    return matchesSearch && matchesStatus && matchesTime
  }).sort((a, b) => {
    if (!sortBy) return 0

    if (sortBy === "likes") {
      const likesA = a._count?.articleLikes || 0
      const likesB = b._count?.articleLikes || 0
      if (likesA !== likesB) return likesB - likesA

      // Nếu số lượt thích bằng nhau, sắp xếp theo số bình luận
      const commentsA = a._count?.articleComments || 0
      const commentsB = b._count?.articleComments || 0
      return commentsB - commentsA
    }

    if (sortBy === "comments") {
      const commentsA = a._count?.articleComments || 0
      const commentsB = b._count?.articleComments || 0
      if (commentsA !== commentsB) return commentsB - commentsA

      // Nếu số bình luận bằng nhau, sắp xếp theo số lượt thích
      const likesA = a._count?.articleLikes || 0
      const likesB = b._count?.articleLikes || 0
      return likesB - likesA
    }

    return 0
  })

  // Debug logs
  console.log("Current user:", currentUser)
  console.log("Author ID:", authorId)
  console.log("Articles from Redux:", articles)
  console.log("Is loading:", isLoading)

  // Load user profile when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await dispatch(handleGetProfile())
        console.log("Profile loaded:", result)
      } catch (error) {
        console.error("Error loading profile:", error)
      }
    }
    loadProfile()
  }, [dispatch])

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      router.push('/login')
      return
    }

    if (authorId) {
      console.log("Fetching articles for author:", authorId)
      const fetchArticles = async () => {
        try {
          const result = await dispatch(handleGetArticlesByAuthor(authorId))
          console.log("Articles API Response:", result)
          console.log("Articles in Redux store:", articles)
        } catch (error) {
          console.error("Error fetching articles:", error)
        }
      }
      fetchArticles()
    }
  }, [dispatch, authorId, currentUser, router])

  // Handle delete article
  const handleDelete = async (articleId: number) => {
    try {
      await dispatch(handleDeleteArticle(articleId))
      toast({
        title: "Thành công",
        description: "Đã xóa bài viết thành công",
        variant: "success"
      })
      // Refresh articles list
      if (authorId) {
        dispatch(handleGetArticlesByAuthor(authorId))
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài viết",
        variant: "destructive"
      })
    }
    setArticleToDelete(null)
  }

  // If not authenticated, don't render the page
  if (!currentUser) {
    return null
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý bài viết</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Báo Liêm Khiết</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Quản lý bài viết</div>
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
                placeholder="Tìm kiếm..." 
                className="pl-8 h-9 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Object.values(ARTICLE_STATUS).map(status => (
                  <SelectItem key={status.value} value={status.value.toLowerCase()}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={timeFilter} 
              onValueChange={setTimeFilter}
            >
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TIME_FILTERS).map(filter => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/author/articles/add">
              <Button size="sm">
                <PenSquare className="h-4 w-4 mr-2" />
                Viết bài mới
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles.tableContent}>
          <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>ID</th>
                <th className={styles.tableHeaderCell}>Tiêu đề</th>
                <th className={styles.tableHeaderCell}>Trạng thái</th>
                <th className={styles.tableHeaderCell}>Chuyên mục</th>
                <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                  <th className={styles.tableHeaderCell}>Lượt thích</th>
                  <th className={styles.tableHeaderCell}>Bình luận</th>
                <th className={styles.tableHeaderCell}>Hành động</th>
              </tr>
            </thead>
            <tbody>
                {filteredArticles && filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                <tr key={article.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{article.id}</td>
                  <td className={styles.tableCell}>
                      <div className="font-medium max-w-[300px] truncate">{article.title}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ARTICLE_STATUS[article.status as ArticleStatus]?.color || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ARTICLE_STATUS[article.status as ArticleStatus]?.label || article.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.category?.name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {article.publishedAt 
                        ? new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric'
                          })
                        : "Chưa xuất bản"}
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Heart className="h-4 w-4" />
                        <span>{article._count?.articleLikes || 0}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MessageSquare className="h-4 w-4" />
                        <span>{article._count?.articleComments || 0}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                      <div className="flex items-center gap-2">
                      <Link href={`/author/articles/${article.id}`}>
                          <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/author/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => setArticleToDelete(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </td>
                </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className={styles.tableCell}>
                      <div className="text-center py-4">Không có bài viết nào</div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => articleToDelete && handleDelete(articleToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

