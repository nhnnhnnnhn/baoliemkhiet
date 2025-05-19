"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import dynamic from "next/dynamic"
import { use } from "react"
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
import styles from "../../../author.module.css"

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const resolvedParams = use(params)
  const articleId = parseInt(resolvedParams.id)
  
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
  
  // Validation states
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    thumbnail?: string;
    publishedAt?: string;
  }>({});

  // Validation rules
  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'title':
        if (!value) return 'Tiêu đề là bắt buộc';
        if (value.length < 10) return 'Tiêu đề phải có ít nhất 10 ký tự';
        if (value.length > 200) return 'Tiêu đề không được vượt quá 200 ký tự';
        return '';
      case 'content':
        if (!value) return 'Nội dung là bắt buộc';
        if (value.length < 100) return 'Nội dung phải có ít nhất 100 ký tự';
        return '';
      case 'thumbnail':
        if (!value) return 'Vui lòng cung cấp ảnh đại diện';
        return '';
      case 'publishedAt':
        if (status === 'APPROVED' && !useCurrentDate && !value) {
          return 'Vui lòng chọn thời gian xuất bản';
        }
        return '';
      default:
        return '';
    }
  };

  // Handle field change with validation
  const handleFieldChange = (name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'content':
        setContent(value);
        break;
      case 'categoryId':
        setCategoryId(value);
        break;
      case 'thumbnail':
        setThumbnailUrl(value);
        break;
      case 'publishedAt':
        setPublishDate(value);
        setUseCurrentDate(false);
        break;
    }
  };

  // Fetch article, categories and tags on component mount
  useEffect(() => {
    dispatch(handleGetArticleById(articleId))
    dispatch(handleGetCategories({}))
    dispatch(handleGetTags({}))
  }, [dispatch, articleId])
  
  // Load article data into form when it's available
  useEffect(() => {
    if (article) {
      console.log('Article data received:', article);
      
      // Set title
      if (article.title) {
        console.log('Setting title:', article.title);
        setTitle(article.title);
      }
      
      // Set content
      if (article.content) {
        console.log('Setting content:', article.content.substring(0, 100) + '...');
        setContent(article.content);
      }
      
      // Set thumbnail
      if (article.thumbnail) {
        console.log('Setting thumbnail:', article.thumbnail);
        setThumbnailUrl(article.thumbnail);
      }
      
      // Set category ID
      if (article.category_id) {
        console.log('Setting category_id:', article.category_id);
        setCategoryId(article.category_id.toString());
      } else if (article.category && article.category.id) {
        console.log('Setting category.id:', article.category.id);
        setCategoryId(article.category.id.toString());
      }
      
      // Set excerpt
      if (article.excerpt) {
        console.log('Setting excerpt:', article.excerpt);
        setExcerpt(article.excerpt);
      }
      
      // Set status
      if (article.status) {
        console.log('Setting status:', article.status);
        setStatus(article.status as ArticleStatus);
      }
      
      // Set tags
      if (article.tags && article.tags.length > 0) {
        console.log('Setting tags:', article.tags);
        setSelectedTags(article.tags.map(tag => tag.id.toString()));
      }
      
      // Set publish date from publishedAt
      if (article.publishedAt) {
        console.log('Setting publishedAt:', article.publishedAt);
        const date = new Date(article.publishedAt);
        if (!isNaN(date.getTime())) {
          const formattedDate = date.toISOString().slice(0, 16);
          console.log('Formatted publish date:', formattedDate);
          setPublishDate(formattedDate);
        }
      }
    }
  }, [article])
  
  // Handle success/error
  useEffect(() => {
    if (updateArticleSuccess) {
      toast({
        title: "Thành công",
        description: "Đã cập nhật bài viết thành công",
        variant: "success"
      });
      
      // Nếu có selectedTags, cập nhật tags cho bài viết
      if (selectedTags.length > 0) {
        axiosClient.put(`/articles/${articleId}/tags`, { tagIds: selectedTags.map(Number) })
          .then(() => {
            toast({
              title: "Thành công",
              description: "Đã cập nhật thẻ thành công",
              variant: "success"
            });
            dispatch(clearUpdateArticleState());
            router.push('/author/articles');
          })
          .catch(() => {
            toast({
              title: "Cảnh báo",
              description: "Bài viết đã cập nhật nhưng cập nhật thẻ thất bại!",
              variant: "destructive"
            });
            dispatch(clearUpdateArticleState());
            router.push('/author/articles');
          });
        return;
      }
      
      dispatch(clearUpdateArticleState());
      router.push('/author/articles');
    }
    
    if (updateArticleError) {
      toast({
        title: "Lỗi",
        description: updateArticleError,
        variant: "destructive"
      });
      dispatch(clearUpdateArticleState());
    }
  }, [updateArticleSuccess, updateArticleError, dispatch, router, selectedTags, articleId]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {
      title: validateField('title', title),
      content: validateField('content', content),
      thumbnail: validateField('thumbnail', thumbnailUrl),
      publishedAt: validateField('publishedAt', publishDate)
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại các trường thông tin",
        variant: "destructive"
      });
      return;
    }

    const authorId = article?.author_id || article?.author?.id;
    const categoryId = article?.category_id || article?.category?.id;
    
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
          <Link href="/author/articles">
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
                    onChange={(e) => handleFieldChange('title', e.target.value)} 
                    className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="thumbnail">Ảnh đại diện <span className="text-red-500">*</span></Label>
                  <Input 
                    id="thumbnail" 
                    value={thumbnailUrl}  
                    onChange={(e) => handleFieldChange('thumbnail', e.target.value)} 
                    className={`mt-1 ${errors.thumbnail ? 'border-red-500' : ''}`}
                    placeholder="Nhập URL ảnh đại diện" 
                  />
                  {errors.thumbnail && (
                    <p className="text-sm text-red-500 mt-1">{errors.thumbnail}</p>
                  )}
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
                      onChange={(newContent) => handleFieldChange('content', newContent)}
                    />
                    <input
                      type="hidden"
                      name="content"
                      value={content}
                      required
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                    )}
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
                  <Select value={status} onValueChange={(value: 'DRAFT' | 'PENDING') => setStatus(value)}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                      <SelectItem value="DRAFT">Bản nháp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Chuyên mục <span className="text-red-500">*</span></Label>
                  <Select 
                    value={categoryId} 
                    onValueChange={(value) => setCategoryId(value)}
                  >
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
                  <Label htmlFor="published_at">Ngày xuất bản</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="datetime-local"
                      id="published_at"
                      value={publishDate}
                      onChange={(e) => {
                        setPublishDate(e.target.value);
                        setUseCurrentDate(false);
                      }}
                      disabled={useCurrentDate}
                      className="mt-1 flex-1"
                    />
                    <Button
                      type="button"
                      variant={useCurrentDate ? "default" : "outline"}
                      onClick={() => setUseCurrentDate(!useCurrentDate)}
                      className="shrink-0"
                    >
                      {useCurrentDate ? 'Bây giờ' : 'Bây giờ'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {useCurrentDate 
                      ? 'Bài viết sẽ được đăng ngay khi lưu' 
                      : publishDate 
                        ? `Bài viết sẽ được đăng vào: ${new Date(publishDate).toLocaleString('vi-VN')}`
                        : 'Chọn thời gian đăng hoặc có thể dùng thời gian ban đầu'}
                  </p>
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