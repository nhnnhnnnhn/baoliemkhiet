"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import dynamic from "next/dynamic"
import { useAppDispatch, useAppSelector } from "@/src/store"
import axiosClient from '@/src/apis/axiosClient'

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-md" />
})
import { handleGetArticleById, handleUpdateArticle, handleApproveArticle } from "@/src/thunks/article/articleThunk"
import { 
  selectSelectedArticle, 
  selectIsUpdatingArticle, 
  selectUpdateArticleSuccess, 
  selectUpdateArticleError,
  clearUpdateArticleState, 
  setSelectedArticle
} from "@/src/thunks/article/articleSlice"
import { handleGetCategories } from "@/src/thunks/category/categoryThunk"
import { selectCategories } from "@/src/thunks/category/categorySlice"
import { handleGetTags } from "@/src/thunks/tag/tagThunk"
import { selectTags } from "@/src/thunks/tag/tagSlice"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "../../../../../components/ui/multi-select"
import { Spinner } from "../../../../../components/ui/spinner"
import styles from "../../../admin.module.css"

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const articleId = parseInt(params.id)
  
  // Redux selectors
  const article = useAppSelector(selectSelectedArticle)
  const categories = useAppSelector(selectCategories)
  const tags = useAppSelector(selectTags)
  const isUpdatingArticle = useAppSelector(selectIsUpdatingArticle)
  const updateArticleSuccess = useAppSelector(selectUpdateArticleSuccess)
  const updateArticleError = useAppSelector(selectUpdateArticleError)
  
  // State for form fields
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  type ArticleStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED'
  const [status, setStatus] = useState<ArticleStatus>('DRAFT')
  const [categoryId, setCategoryId] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [publishDate, setPublishDate] = useState<string>('')
  const [useCurrentDate, setUseCurrentDate] = useState(false)
  
  // Fetch article, categories and tags on component mount
  useEffect(() => {
    dispatch(handleGetArticleById(articleId))
    dispatch(handleGetCategories({}))
    dispatch(handleGetTags({}))
  }, [dispatch, articleId])
  
  // Load article data into form when it's available
  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setContent(article.content)
      setThumbnailUrl(article.thumbnail || '')
      
      // Set category ID - check for both formats
      if (article.category_id) {
        setCategoryId(article.category_id.toString())
      } else if (article.category && article.category.id) {
        setCategoryId(article.category.id.toString())
      }
      
      // Set excerpt if available
      if (article.excerpt) {
        setExcerpt(article.excerpt)
      }
      
      // Set status
      setStatus(article.status as 'APPROVED' | 'DRAFT' | 'PENDING' | 'REJECTED')
      
      // If article has tags, set them
      if (article.tags && article.tags.length > 0) {
        setSelectedTags(article.tags.map(tag => tag.id.toString()))
      }
      
      if (article.publishedAt) {
        setPublishDate(new Date(article.publishedAt).toISOString().slice(0, 16))
      }
      
      console.log('Loaded article data:', article)
    }
  }, [article])
  
  // Handle success/error
  useEffect(() => {
    if (updateArticleSuccess) {
      // Nếu cập nhật thành công
      const updatedArticle = updateArticleSuccess as any;
      // Nếu có selectedTags, cập nhật tags cho bài viết
      if (selectedTags.length > 0) {
        axiosClient.put(`/articles/${articleId}/tags`, { tagIds: selectedTags.map(Number) })
          .then(() => {
            toast({
              title: "Thành công",
              description: "Đã cập nhật bài viết và thẻ thành công",
              variant: "success"
            });
            dispatch(clearUpdateArticleState())
            router.push('/admin/articles')
          })
          .catch(() => {
            toast({
              title: "Cảnh báo",
              description: "Bài viết đã cập nhật nhưng cập nhật thẻ thất bại!",
              variant: "destructive"
            });
            dispatch(clearUpdateArticleState())
            router.push('/admin/articles')
          });
        return;
      }
      toast({
        title: "Thành công",
        description: "Đã cập nhật bài viết thành công",
        variant: "success"
      })
      dispatch(clearUpdateArticleState())
      router.push('/admin/articles')
    }
    
    if (updateArticleError) {
      toast({
        title: "Lỗi",
        description: updateArticleError,
        variant: "destructive"
      })
      dispatch(clearUpdateArticleState())
    }
  }, [updateArticleSuccess, updateArticleError, dispatch, router])
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const authorId = article?.author_id || article?.author?.id;
    const categoryId = article?.category_id || article?.category?.id;
    console.log('submit', {
      title,
      content,
      status,
      authorId,
      categoryId,
      isUpdatingArticle
    })
    if (!title || !content || !status || !authorId || !categoryId) {
      toast({
        title: "Lỗi",
        description: "Thiếu thông tin bắt buộc (tác giả, chuyên mục, tiêu đề, nội dung, trạng thái)",
        variant: "destructive"
      });
      return;
    }

    let publishDateValue = undefined
    if (status === 'APPROVED') {
      if (useCurrentDate) {
        const now = new Date();
        publishDateValue = now.toISOString();
      } else if (publishDate) {
        try {
          const dateObj = new Date(publishDate)
          if (!isNaN(dateObj.getTime())) {
            publishDateValue = dateObj.toISOString()
          } else {
            publishDateValue = new Date().toISOString()
          }
        } catch (error) {
          publishDateValue = new Date().toISOString()
        }
      } else if (article?.publishedAt) {
        try {
          const dateObj = new Date(article.publishedAt)
          if (!isNaN(dateObj.getTime())) {
            publishDateValue = article.publishedAt
          } else {
            publishDateValue = new Date().toISOString()
          }
        } catch (error) {
          publishDateValue = new Date().toISOString()
        }
      } else {
        publishDateValue = new Date().toISOString()
      }
    }

    const updateData = {
      id: articleId,
      data: {
        title,
        content,
        excerpt,
        thumbnail: thumbnailUrl || undefined,
        status,
        publishedAt: publishDateValue,
      }
    }
    dispatch(handleUpdateArticle(updateData))
  }
  
  if (!article) {
    return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /> Đang tải...</div>
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <Link href="/admin/articles">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Chỉnh sửa bài viết</h1>
            <div className={styles.pageBreadcrumb}>
              <div className={styles.breadcrumbItem}>Trang chủ</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Bài viết</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Chỉnh sửa</div>
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isUpdatingArticle}>
          {isUpdatingArticle ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>

      {/* Edit Article Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Nội dung bài viết</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
              
                <div>
                  <Label htmlFor="title">Tiêu đề <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="mt-1" 
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnail">Ảnh đại diện (URL)</Label>
                  <Input 
                    id="thumbnail" 
                    value={thumbnailUrl}  
                    onChange={(e) => setThumbnailUrl(e.target.value)} 
                    className="mt-1" 
                    placeholder="Nhập URL ảnh đại diện" 
                  />
                  {thumbnailUrl && (
                    <div className="mt-2 mb-2 max-h-40 overflow-hidden rounded">
                      <img 
                        src={thumbnailUrl} 
                        alt="Thumbnail preview" 
                        className="object-cover w-full" 
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="content">Nội dung <span className="text-red-500">*</span></Label>
                  <div className="mt-1">
                    <RichTextEditor
                      value={content}
                      onChange={(newContent) => setContent(newContent)}
                    />
                    <input
                      type="hidden"
                      name="content"
                      value={content}
                      required
                    />
                  </div>
                </div>
              </div>
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
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={status} onValueChange={(value: 'APPROVED' | 'DRAFT' | 'PENDING' | 'REJECTED') => setStatus(value)}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVED">Đã xuất bản</SelectItem>
                      <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                      <SelectItem value="REJECTED">Từ chối</SelectItem>
                      <SelectItem value="DRAFT">Bản nháp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Chuyên mục <span className="text-red-500">*</span></Label>
                  <Select value={categoryId} onValueChange={(value) => setCategoryId(value)}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Chọn chuyên mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          <Spinner size="sm" /> Đang tải...
                        </SelectItem>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {status === 'APPROVED' && (
                  <div className="space-y-2">
                    <Label htmlFor="published_at">Thời gian đăng bài</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="datetime-local"
                        id="published_at"
                        value={publishDate}
                        onChange={(e) => {
                          setPublishDate(e.target.value);
                          setUseCurrentDate(false);
                        }}
                        disabled={useCurrentDate}
                        className="mt-0"
                      />
                      <Button
                        type="button"
                        variant={useCurrentDate ? "default" : "outline"}
                        className="ml-2 whitespace-nowrap"
                        onClick={() => setUseCurrentDate(!useCurrentDate)}
                      >
                        {useCurrentDate ? 'Đã chọn: Bây giờ' : 'Bây giờ'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {useCurrentDate 
                        ? 'Bài viết sẽ được đăng ngay khi lưu' 
                        : publishDate 
                          ? `Bài viết sẽ được đăng vào: ${new Date(publishDate).toLocaleString('vi-VN')}`
                          : 'Chọn thời gian đăng hoặc có thể dùng thời gian ban đầu'}
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="tags">Thẻ</Label>
                  <MultiSelect
                    options={tags.map(tag => ({
                      label: tag.name,
                      value: tag.id.toString()
                    }))}
                    selected={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Chọn thẻ"
                    className="mt-1"
                  />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button type="submit" className="w-full" disabled={isUpdatingArticle}>
                    {isUpdatingArticle ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu bài viết'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
