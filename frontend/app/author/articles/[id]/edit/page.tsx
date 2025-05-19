"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Check, Clock, Edit, Eye, ImageIcon, Link2, ListChecks, Save, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { 
  handleGetArticleById, 
  handleUpdateArticle
} from "@/src/thunks/article/articleThunk"
import {
  selectSelectedArticle,
  selectIsUpdatingArticle,
  selectUpdateArticleSuccess,
  selectUpdateArticleError,
  clearUpdateArticleState
} from "@/src/thunks/article/articleSlice"
import { Article, EditArticlePayload } from "@/src/apis/article"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import styles from "../../../../admin/admin.module.css"

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const articleId = parseInt(params.id)

  // Redux selectors
  const article = useAppSelector(selectSelectedArticle)
  const isUpdatingArticle = useAppSelector(selectIsUpdatingArticle)
  const updateArticleSuccess = useAppSelector(selectUpdateArticleSuccess)
  const updateArticleError = useAppSelector(selectUpdateArticleError)

  // Local state
  const [formData, setFormData] = useState<EditArticlePayload>({
    title: "",
    content: "",
    excerpt: "",
    status: "DRAFT",
    categoryId: 0,
    tags: [],
    thumbnail: "",
  })

  // Fetch article data on component mount
  useEffect(() => {
    dispatch(handleGetArticleById(articleId))
  }, [dispatch, articleId])

  // Update local state when article data is loaded
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        content: article.content || "",
        excerpt: article.excerpt || "",
        status: article.status || "DRAFT",
        categoryId: article.category_id || 0,
        tags: article.tags?.map(tag => tag.id) || [],
        thumbnail: article.thumbnail || "",
      })
    }
  }, [article])

  // Handle update success/error
  useEffect(() => {
    if (updateArticleSuccess) {
      toast.success("Cập nhật bài viết thành công!")
      dispatch(clearUpdateArticleState())
      router.push(`/author/articles/${articleId}`)
    }
    if (updateArticleError) {
      toast.error(updateArticleError)
      dispatch(clearUpdateArticleState())
    }
  }, [updateArticleSuccess, updateArticleError, dispatch, router, articleId])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(handleUpdateArticle({
      id: articleId,
      data: formData
    }))
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId: parseInt(value)
    }))
  }

  // Handle status change
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as "DRAFT" | "APPROVED" | "PENDING" | "REJECTED" | "PUBLISHED"
    }))
  }

  // Handle tags
  const [tagInput, setTagInput] = useState("")
  const handleAddTag = () => {
    if (tagInput.trim()) {
      const tagId = parseInt(tagInput.trim())
      if (!isNaN(tagId) && !formData.tags?.includes(tagId)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagId]
        }))
        setTagInput("")
      }
    }
  }

  const handleRemoveTag = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(id => id !== tagId) || []
    }))
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "default"
      case "PENDING":
        return "secondary"
      case "DRAFT":
        return "outline"
      case "REJECTED":
        return "destructive"
      default:
        return "default"
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Đã xuất bản"
      case "PENDING":
        return "Chờ duyệt"
      case "DRAFT":
        return "Bản nháp"
      case "REJECTED":
        return "Đã từ chối"
      default:
        return status
    }
  }

  if (!article) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href={`/author/articles/${articleId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
            <p className="text-muted-foreground">Cập nhật thông tin bài viết của bạn</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusBadgeVariant(article.status)}>
            {getStatusText(article.status)}
          </Badge>
          <Button onClick={handleSubmit} disabled={isUpdatingArticle}>
            {isUpdatingArticle ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Nội dung bài viết</CardTitle>
                <CardDescription>
                  Nhập tiêu đề và nội dung bài viết của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Nhập tiêu đề bài viết"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="mt-1 min-h-[200px]"
                    placeholder="Nhập nội dung bài viết"
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Tóm tắt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Nhập tóm tắt bài viết"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân loại</CardTitle>
                <CardDescription>
                  Chọn chuyên mục và thêm tags cho bài viết
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Chuyên mục</Label>
                  <Select 
                    value={formData.categoryId?.toString()} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Chọn chuyên mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Thời sự</SelectItem>
                      <SelectItem value="2">Thế giới</SelectItem>
                      <SelectItem value="3">Kinh doanh</SelectItem>
                      <SelectItem value="4">Thể thao</SelectItem>
                      <SelectItem value="5">Công nghệ</SelectItem>
                      <SelectItem value="6">Du lịch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map(tagId => (
                      <Badge key={tagId} variant="secondary">
                        {tagId}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tagId)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Nhập ID tag"
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Thêm
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
                <CardDescription>
                  Chọn trạng thái cho bài viết
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select 
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Bản nháp</SelectItem>
                    <SelectItem value="PENDING">Gửi phê duyệt</SelectItem>
                    <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
                <CardDescription>
                  Thêm ảnh đại diện cho bài viết
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <img
                    src={formData.thumbnail || "/placeholder.svg"}
                    alt="Ảnh đại diện"
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" type="button">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Chọn ảnh
                    </Button>
                    <Button variant="outline" type="button" className="text-destructive">
                      <X className="mr-2 h-4 w-4" />
                      Xóa ảnh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
