"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Save, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import { useAppDispatch, useAppSelector } from "@/src/store"
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
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "../../../../components/ui/multi-select"
import { Spinner } from "../../../../components/ui/spinner"
import styles from "../../author.module.css"
import { cn } from "@/lib/utils"

// Validation rules
type ValidationRule = {
  required: boolean;
  minLength?: number;
  maxLength?: number;
}

const VALIDATION_RULES: Record<string, ValidationRule> = {
  title: {
    required: true,
    minLength: 10,
    maxLength: 200
  },
  content: {
    required: true,
    minLength: 100,
    maxLength: 10000
  },
  categoryId: {
    required: true
  },
  thumbnail: {
    required: true
  }
}

// Error messages
const ERROR_MESSAGES = {
  title: {
    required: "Tiêu đề là bắt buộc",
    minLength: "Tiêu đề phải có ít nhất 10 ký tự",
    maxLength: "Tiêu đề không được vượt quá 200 ký tự"
  },
  content: {
    required: "Nội dung là bắt buộc",
    minLength: "Nội dung phải có ít nhất 100 ký tự",
    maxLength: "Nội dung không được vượt quá 10000 ký tự"
  },
  categoryId: {
    required: "Vui lòng chọn danh mục"
  },
  thumbnail: {
    required: "Vui lòng chọn ảnh đại diện"
  }
}

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-md" />
})

// Thêm style cho error message
const errorMessageStyle = "text-sm text-red-500 mt-1 flex items-center gap-1.5"

export default function AddArticlePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Redux selectors
  const categories = useAppSelector(selectCategories)
  const tags = useAppSelector(selectTags)
  const isCreatingArticle = useAppSelector(selectIsCreatingArticle)
  const createArticleSuccess = useAppSelector(selectCreateArticleSuccess)
  const createArticleError = useAppSelector(selectCreateArticleError)
  const currentUser = useAppSelector(selectCurrentUser)
  
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
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Fetch categories and tags on component mount
  useEffect(() => {
    dispatch(handleGetCategories({}))
    dispatch(handleGetTags({}))
  }, [dispatch])
  
  // Validation function
  const validateField = (name: string, value: any): string | null => {
    const rules = VALIDATION_RULES[name]
    if (!rules) return null

    if (rules.required && !value) {
      return ERROR_MESSAGES[name as keyof typeof ERROR_MESSAGES].required
    }

    if (name === 'title' && rules.minLength && rules.maxLength) {
      if (value.length < rules.minLength) {
        return ERROR_MESSAGES.title.minLength
      }
      if (value.length > rules.maxLength) {
        return ERROR_MESSAGES.title.maxLength
      }
    }

    if (name === 'content' && rules.minLength && rules.maxLength) {
      if (value.length < rules.minLength) {
        return ERROR_MESSAGES.content.minLength
      }
      if (value.length > rules.maxLength) {
        return ERROR_MESSAGES.content.maxLength
      }
    }

    return null
  }

  // Handle field change with validation
  const handleFieldChange = (name: string, value: any) => {
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }))

    // Update state based on field name
    switch (name) {
      case 'title':
        setTitle(value || '')
        break
      case 'content':
        setContent(value || '')
        break
      case 'categoryId':
        setCategoryId(value || '')
        break
      case 'thumbnail':
        setThumbnailUrl(value || '')
        break
      case 'status':
        setStatus(value)
        break
      case 'tags':
        setSelectedTags(value || [])
        break
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields (không validate publishedAt)
    const newErrors: Record<string, string> = {}
    Object.keys(VALIDATION_RULES).forEach(field => {
      const value = field === 'categoryId' ? categoryId :
                   field === 'thumbnail' ? thumbnailUrl :
                   field === 'content' ? content :
                   field === 'title' ? title : null
      const error = validateField(field, value)
      if (error) {
        newErrors[field] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại các trường thông tin",
        variant: "destructive"
      })
      return
    }
    
    if (!currentUser?.id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để tạo bài viết",
        variant: "destructive"
      })
      return
    }
    
    // Xử lý ngày xuất bản: nếu có giá trị thì gửi, không thì bỏ qua
    let publishDateValue: string | undefined = undefined;
    if (useCurrentDate) {
      publishDateValue = new Date().toISOString();
    } else if (publishDate) {
      publishDateValue = new Date(publishDate).toISOString();
    }
    
    const tagIds = selectedTags.map(id => parseInt(id))
    dispatch(handleCreateArticle({
      title,
      content,
      thumbnail: thumbnailUrl || undefined,
      authorId: currentUser.id,
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
      router.push('/author/articles')
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
                    className={cn("mt-1", errors.title && "border-red-500 focus-visible:ring-red-500")}
                    value={title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    required
                  />
                  {errors.title && (
                    <p className={errorMessageStyle}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {errors.title}
                    </p>
                  )}
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
                      onChange={(newContent) => handleFieldChange('content', newContent)}
                    />
                    <input
                      type="hidden"
                      name="content"
                      value={content}
                      required
                    />
                  </div>
                  {errors.content && (
                    <p className={errorMessageStyle}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {errors.content}
                    </p>
                  )}
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
                  <Select 
                    value={status} 
                    onValueChange={(value: 'APPROVED' | 'DRAFT' | 'PENDING') => {
                      if (value !== 'APPROVED') {
                        handleFieldChange('status', value)
                      }
                    }}
                  >
                    <SelectTrigger className={cn("mt-1", errors.status && "border-red-500 focus-visible:ring-red-500")}>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Bản nháp</SelectItem>
                      <SelectItem value="PENDING">Gửi duyệt</SelectItem>
                      <SelectItem value="APPROVED">Xuất bản ngay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Chuyên mục <span className="text-red-500">*</span></Label>
                  <Select 
                    value={categoryId} 
                    onValueChange={(value) => handleFieldChange('categoryId', value)}
                  >
                    <SelectTrigger 
                      id="category" 
                      className={cn("mt-1", errors.categoryId && "border-red-500 focus-visible:ring-red-500")}
                    >
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
                  {errors.categoryId && (
                    <p className={errorMessageStyle}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tags">Thẻ</Label>
                  <MultiSelect
                    options={tags.map(tag => ({
                      label: tag.name,
                      value: tag.id.toString()
                    }))}
                    selected={selectedTags}
                    onChange={(value) => handleFieldChange('tags', value)}
                    placeholder="Chọn thẻ"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnailUrl">Ảnh đại diện <span className="text-red-500">*</span></Label>
                  <Input 
                    id="thumbnailUrl" 
                    placeholder="Nhập URL ảnh đại diện" 
                    className={cn("mt-1", errors.thumbnail && "border-red-500 focus-visible:ring-red-500")}
                    value={thumbnailUrl}
                    onChange={(e) => handleFieldChange('thumbnail', e.target.value)}
                  />
                  {errors.thumbnail && (
                    <p className={errorMessageStyle}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {errors.thumbnail}
                    </p>
                  )}
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
                      onClick={() => {
                        setUseCurrentDate(!useCurrentDate)
                        if (!useCurrentDate) {
                          setPublishDate('')
                        }
                      }}
                    >
                      <Clock className="h-4 w-4" />
                      {useCurrentDate ? 'Đã chọn: Bây giờ' : 'Sử dụng thời gian hiện tại'}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button type="submit" className="w-full" disabled={isCreatingArticle}>
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
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}