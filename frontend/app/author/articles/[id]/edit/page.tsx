"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Check, Clock, Edit, Eye, ImageIcon, Link2, ListChecks, Save, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import styles from "../../../../admin/admin.module.css"

export default function EditArticlePage({ params }: { params: { id: string } }) {
  // Mock article data
  const [article, setArticle] = useState({
    id: params.id,
    title: "Đội tuyển Việt Nam giành chiến thắng ấn tượng tại vòng loại World Cup",
    status: "Đã xuất bản",
    category: "Thể thao",
    tags: ["Bóng đá", "Đội tuyển Việt Nam", "World Cup", "Vòng loại"],
    publishedAt: "04/04/2025 15:30",
    updatedAt: "04/04/2025 16:45",
    author: {
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    editor: {
      name: "Nguyễn Văn C",
    },
    views: 10876,
    likes: 543,
    comments: 78,
    readTime: "5 phút",
    content: `<p>Đội tuyển Việt Nam đã có một trận đấu xuất sắc khi đánh bại đối thủ mạnh với tỷ số 2-0 trong trận đấu thuộc vòng loại World Cup diễn ra vào tối qua.</p>
      
<p>Hai bàn thắng được ghi do công của tiền đạo Nguyễn Tiến Linh ở phút thứ 30 và tiền vệ Nguyễn Quang Hải ở phút 75. Đây là chiến thắng quan trọng giúp đội tuyển Việt Nam cải thiện vị trí trên bảng xếp hạng và nuôi hy vọng tiến xa hơn trong hành trình chinh phục tấm vé dự World Cup.</p>

<h2>Diễn biến trận đấu</h2>

<p>Ngay từ đầu trận, đội tuyển Việt Nam đã thể hiện lối chơi tấn công mạnh mẽ. Các cầu thủ liên tục tạo ra những tình huống nguy hiểm về phía khung thành đối phương.</p>

<p>Phút thứ 30, từ đường chuyền của Quang Hải, Tiến Linh đã thoát xuống và dứt điểm chính xác, mở tỷ số cho đội tuyển Việt Nam.</p>`,
    excerpt:
      "Đội tuyển Việt Nam đã có một trận đấu xuất sắc khi đánh bại đối thủ mạnh với tỷ số 2-0 trong trận đấu thuộc vòng loại World Cup diễn ra vào tối qua.",
    featuredImage: "/placeholder.svg?height=400&width=600",
    seo: {
      title: "Đội tuyển Việt Nam giành chiến thắng ấn tượng tại vòng loại World Cup",
      description:
        "Đội tuyển Việt Nam đã có một trận đấu xuất sắc khi đánh bại đối thủ mạnh với tỷ số 2-0 trong trận đấu thuộc vòng loại World Cup.",
      keywords: "Đội tuyển Việt Nam, World Cup, vòng loại, chiến thắng, bóng đá",
    },
  })

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the updated article to the server
    alert("Bài viết đã được cập nhật!")
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArticle((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle SEO input changes
  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArticle((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]: value,
      },
    }))
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setArticle((prev) => ({
      ...prev,
      category: value,
    }))
  }

  // Handle tag input
  const [tagInput, setTagInput] = useState("")
  const handleAddTag = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setArticle((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <Link href={`/author/articles/${article.id}`}>
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <h1 className={styles.pageTitle}>Chỉnh sửa bài viết</h1>
        </div>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Tác giả</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Bài viết</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>{article.id}</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Chỉnh sửa</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Article Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <Input
                  name="title"
                  value={article.title}
                  onChange={handleChange}
                  className="text-xl font-semibold mb-2"
                  placeholder="Tiêu đề bài viết"
                />
                <CardDescription className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      article.status === "Đã xuất bản"
                        ? "success"
                        : article.status === "Chờ duyệt"
                          ? "warning"
                          : "outline"
                    }
                  >
                    {article.status}
                  </Badge>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {article.publishedAt}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {article.readTime}
                  </span>
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
                <Link href={`/author/articles/${article.id}`}>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem trước
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Editor and Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="md:col-span-2">
            <Tabs defaultValue="content">
              <TabsList className="mb-4">
                <TabsTrigger value="content">Nội dung</TabsTrigger>
                <TabsTrigger value="excerpt">Tóm tắt</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nội dung bài viết</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Button type="button" variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Văn bản
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <Image className="h-4 w-4 mr-1" />
                        Hình ảnh
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <Link2 className="h-4 w-4 mr-1" />
                        Liên kết
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <ListChecks className="h-4 w-4 mr-1" />
                        Danh sách
                      </Button>
                    </div>
                    <Textarea
                      name="content"
                      value={article.content}
                      onChange={handleChange}
                      className="min-h-[400px] font-mono"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="excerpt">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tóm tắt bài viết</CardTitle>
                    <CardDescription>
                      Tóm tắt ngắn gọn về bài viết, sẽ được hiển thị ở trang danh sách bài viết và kết quả tìm kiếm.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="excerpt"
                      value={article.excerpt}
                      onChange={handleChange}
                      className="min-h-[150px]"
                      placeholder="Nhập tóm tắt bài viết..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tối ưu hóa SEO</CardTitle>
                    <CardDescription>
                      Cài đặt SEO giúp bài viết của bạn dễ dàng được tìm thấy trên các công cụ tìm kiếm.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="seo-title">Tiêu đề SEO</Label>
                      <Input
                        id="seo-title"
                        name="title"
                        value={article.seo.title}
                        onChange={handleSeoChange}
                        className="mt-1"
                        placeholder="Tiêu đề SEO"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo-description">Mô tả SEO</Label>
                      <Textarea
                        id="seo-description"
                        name="description"
                        value={article.seo.description}
                        onChange={handleSeoChange}
                        className="mt-1"
                        placeholder="Mô tả SEO"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo-keywords">Từ khóa SEO</Label>
                      <Input
                        id="seo-keywords"
                        name="keywords"
                        value={article.seo.keywords}
                        onChange={handleSeoChange}
                        className="mt-1"
                        placeholder="Từ khóa SEO (phân cách bằng dấu phẩy)"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Metadata */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <img
                    src={article.featuredImage || "/placeholder.svg"}
                    alt="Ảnh đại diện"
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <Button variant="outline" className="w-full">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Thay đổi ảnh đại diện
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Category and Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phân loại</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Chuyên mục</Label>
                  <Select value={article.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Chọn chuyên mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thời sự">Thời sự</SelectItem>
                      <SelectItem value="Thế giới">Thế giới</SelectItem>
                      <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                      <SelectItem value="Thể thao">Thể thao</SelectItem>
                      <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                      <SelectItem value="Du lịch">Du lịch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Thẻ</Label>
                  <div className="flex mt-1">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Nhập thẻ và nhấn Thêm"
                      className="flex-1 rounded-r-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} className="rounded-l-none" variant="secondary">
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Xóa thẻ {tag}</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin tác giả</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={article.author.avatar} alt={article.author.name} />
                    <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{article.author.name}</div>
                    <div className="text-sm text-muted-foreground">Tác giả</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tùy chọn xuất bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select defaultValue={article.status}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bản nháp">Bản nháp</SelectItem>
                      <SelectItem value="Ch��� duyệt">Gửi phê duyệt</SelectItem>
                      <SelectItem value="Đã xuất bản">Đã xuất bản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
