"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Edit, User, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetArticleById } from "@/src/thunks/article/articleThunk"
import { selectSelectedArticle } from "@/src/thunks/article/articleSlice"

// Tiện ích và constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Định nghĩa các kiểu dữ liệu
type ArticleStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED'

const ARTICLE_STATUS_DISPLAY: Record<ArticleStatus, string> = {
  'DRAFT': 'Bản nháp',
  'PENDING': 'Chờ duyệt',
  'APPROVED': 'Đã xuất bản',
  'REJECTED': 'Bị từ chối',
  'PUBLISHED': 'Đã xuất bản'
}

/**
 * Định dạng ngày tháng (DD/MM/YYYY HH:MM)
 * Cải thiện để xử lý tốt hơn các trường hợp ngày không hợp lệ
 */
function formatDate(dateInput: string | Date | null | undefined): string {
  // Trường hợp không có ngày nhập vào
  if (!dateInput) {
    return 'Chưa có ngày'
  }
  
  try {
    let date: Date
    
    // Chuyển đổi chuỗi thành Date
    if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else {
      date = dateInput as Date
    }
    
    // Kiểm tra ngày có hợp lệ không
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.log('Ngày không hợp lệ:', dateInput)
      return 'Ngày không hợp lệ'
    }
  
    // Lấy các thành phần của ngày
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
  
    return `${day}/${month}/${year} ${hours}:${minutes}`
  } catch (error) {
    console.error('Lỗi xử lý ngày tháng:', error)
    return 'Ngày không hợp lệ'
  }
}

import { Button } from "@/components/ui/button"
import { Spinner } from "../../../../components/ui/spinner"
import styles from "@/app/author/author.module.css"

// Thêm interface cho Article
interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  status: string;
  publishedAt?: string;
  updated_at?: string;
  author?: {
    fullname?: string;
    name?: string;
  };
  category?: {
    name: string;
  };
  tags?: Array<{
    name: string;
  }>;
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const dispatch = useAppDispatch()
  const article = useAppSelector(selectSelectedArticle)
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)
  
  useEffect(() => {
    // Fetch bài viết theo ID và set loading state
    const fetchArticle = async () => {
      try {
        await dispatch(handleGetArticleById(parseInt(resolvedParams.id)))
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchArticle()
  }, [dispatch, resolvedParams.id])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <span className="ml-2">Đang tải bài viết...</span>
      </div>
    )
  }
  
  if (!article) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
        <p className="mb-6">Bài viết này không tồn tại hoặc đã bị xóa.</p>
        <Link href="/author/articles">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách bài viết
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <Link href="/author/articles">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Chi tiết bài viết</h1>
            <div className={styles.pageBreadcrumb}>
              <div className={styles.breadcrumbItem}>Trang chủ</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Bài viết</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Chi tiết</div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/author/articles/${article.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className="text-sm font-medium text-gray-500 mb-1">Trạng thái</div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${article.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : article.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : article.status === "DRAFT"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {ARTICLE_STATUS_DISPLAY[article.status as ArticleStatus] || article.status}
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
              <div className="overflow-hidden rounded-lg">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail.startsWith('http') ? article.thumbnail : `${API_URL}${article.thumbnail}`}
                    alt={article.title}
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-[300px] flex items-center justify-center rounded-lg">
                    <span className="text-gray-500">Không có ảnh thumbnail</span>
                  </div>
                )}
              </div>
              <div
                className="prose max-w-none prose-img:rounded-lg prose-img:my-4 prose-headings:mt-6 prose-p:my-4"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Thông tin bài viết</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">ID</div>
                  <div>{article.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Danh mục</div>
                  {article.category ? (
                    <div className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                      {article.category.name}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Chưa phân loại</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Thẻ</div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags && article.tags.length > 0 ? article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag.name}
                      </span>
                    )) : <span className="text-gray-400 text-sm">Chưa có thẻ</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Tác giả</div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    {article.author ? (article.author.fullname || article.author.name || 'Không xác định') : 'Không xác định'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Ngày xuất bản</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Cập nhật lần cuối</div>
                  <div>{formatDate(article.updated_at)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
