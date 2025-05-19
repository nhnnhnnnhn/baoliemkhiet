"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Save, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import { useAppDispatch, useAppSelector } from "@/src/store"

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-md" />
})
import { handleCreateArticle, handleApproveArticle } from "@/src/thunks/article/articleThunk"
import {
  selectIsCreatingArticle,
  selectCreateArticleSuccess,
  selectCreateArticleError,
  clearCreateArticleState
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
import { MultiSelect } from "../../../../components/ui/multi-select"
import { Spinner } from "../../../../components/ui/spinner"
import styles from "../../admin.module.css"

export default function AddArticlePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Redux selectors
  const categories = useAppSelector(selectCategories)
  const tags = useAppSelector(selectTags)
  const isCreatingArticle = useAppSelector(selectIsCreatingArticle)
  const createArticleSuccess = useAppSelector(selectCreateArticleSuccess)
  const createArticleError = useAppSelector(selectCreateArticleError)
  
  // State for form fields
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'APPROVED' | 'DRAFT' | 'PENDING'>('DRAFT')
  const [categoryId, setCategoryId] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [publishDate, setPublishDate] = useState<string>('')
  const [useCurrentDate, setUseCurrentDate] = useState(false)
  
  // Fetch categories and tags on component mount
  useEffect(() => {
    dispatch(handleGetCategories({}))
    dispatch(handleGetTags({}))
  }, [dispatch])
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content || !categoryId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      })
      return
    }
    
    // Xử lý ngày xuất bản
    let publishDateValue: string | undefined = undefined;
    if (status === 'APPROVED') {
      // Nếu chọn "Bây giờ", lấy thời gian hiện tại và đảm bảo định dạng chuẩn ISO
      if (useCurrentDate) {
        const now = new Date();
        // Đảm bảo rằng ngày được tạo đúng định dạng ISO8601 đầy đủ
        publishDateValue = now.toISOString();
        console.log('Sử dụng thời gian hiện tại:', publishDateValue);
      } 
      // Nếu chọn một ngày cụ thể, sử dụng ngày đó
      else if (publishDate) {
        try {
          const dateObj = new Date(publishDate)
          if (!isNaN(dateObj.getTime())) {
            publishDateValue = dateObj.toISOString()
          }
        } catch (error) {
          console.error("Lỗi xử lý ngày xuất bản:", error)
          publishDateValue = new Date().toISOString() // Mặc định là ngày hiện tại
        }
      }
      // Mặc định là thời gian hiện tại
      else {
        publishDateValue = new Date().toISOString()
      }
    }
    
    const tagIds = selectedTags.map(id => parseInt(id))
    dispatch(handleCreateArticle({
      title,
      content,
      thumbnail: thumbnailUrl || undefined,
      authorId: 1, // Hiện tại gán cứng ID người dùng, sau này lấy từ auth state
      categoryId: parseInt(categoryId),
      status: status,
      publishedAt: publishDateValue,
      tags: tagIds
    }))
  }
  
  // Handle success/error
  useEffect(() => {
    if (createArticleSuccess) {
      // Nếu tạo bài viết thành công và có id
      const article = createArticleSuccess as any;
      if (article && typeof article === 'object' && article.id) {
        // Không cần gọi handleApproveArticle nữa vì khi tạo bài viết
        // với status=APPROVED, backend đã tự động đặt isPublish=true
        
        toast({
          title: "Thành công",
          description: "Đã tạo bài viết mới thành công" + (status === 'APPROVED' ? ' và đã xuất bản' : ''),
          variant: "success"
        })
      } else {
        toast({
          title: "Thành công",
          description: "Đã tạo bài viết mới thành công",
          variant: "success"
        })
      }
      
      dispatch(clearCreateArticleState())
      router.push('/admin/articles')
    }
    
    if (createArticleError) {
      toast({
        title: "Lỗi",
        description: createArticleError,
        variant: "destructive"
      })
      dispatch(clearCreateArticleState())
    }
  }, [createArticleSuccess, createArticleError, dispatch, router])
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
            <h1 className={styles.pageTitle}>Thêm bài viết mới</h1>
            <div className={styles.pageBreadcrumb}>
              <div className={styles.breadcrumbItem}>Trang chủ</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Bài viết</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Thêm mới</div>
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isCreatingArticle}>
          {isCreatingArticle ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu bài viết
            </>
          )}
        </Button>
      </div>

      {/* Add Article Form */}
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
                    placeholder="Nhập tiêu đề bài viết" 
                    className="mt-1" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Tóm tắt</Label>
                  <Textarea 
                    id="excerpt" 
                    placeholder="Nhập tóm tắt bài viết" 
                    className="mt-1" 
                    rows={3} 
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
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
                  <Select value={status} onValueChange={(value: 'APPROVED' | 'DRAFT' | 'PENDING') => setStatus(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Bản nháp</SelectItem>
                      <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                      <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Ngày xuất bản</Label>
                  <div className="flex flex-wrap items-center gap-3 mt-1 w-full">
                    <Input
                      type="datetime-local"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      disabled={useCurrentDate}
                      className="w-[220px] min-w-0 flex-shrink"
                    />
                    <Button
                      type="button"
                      variant={useCurrentDate ? "default" : "outline"}
                      className="flex items-center gap-2 rounded-full shadow-sm border border-gray-200 min-w-[180px] mt-2 sm:mt-0"
                      onClick={() => setUseCurrentDate(!useCurrentDate)}
                    >
                      <Clock className="h-4 w-4" />
                      {useCurrentDate ? 'Đã chọn: Bây giờ' : 'Sử dụng thời gian hiện tại'}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 min-h-[20px]">
                    {useCurrentDate
                      ? 'Bài viết sẽ được xuất bản ngay khi lưu.'
                      : publishDate
                        ? `Bài viết sẽ được xuất bản vào: ${new Date(publishDate).toLocaleString('vi-VN')}`
                        : 'Chọn thời gian xuất bản hoặc sử dụng thời gian hiện tại.'}
                  </div>
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
                <div>
                  <Label htmlFor="thumbnailUrl">Ảnh đại diện (URL)</Label>
                  <Input 
                    id="thumbnailUrl" 
                    placeholder="Nhập URL ảnh đại diện" 
                    className="mt-1" 
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                  />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button type="submit" className="w-full" disabled={isCreatingArticle}>
                    {isCreatingArticle ? (
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
