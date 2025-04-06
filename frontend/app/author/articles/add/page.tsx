"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Bold,
  Code,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Save,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import styles from "../../../admin/admin.module.css"

export default function AddArticlePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("edit")
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    featuredImage: null,
    status: "draft",
  })

  // Preview content
  const [previewContent, setPreviewContent] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Update preview when content changes
    if (name === "content") {
      setPreviewContent(value)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the image to a server
    // For now, we'll just set it in the state
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        featuredImage: URL.createObjectURL(e.target.files[0]),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send the data to an API
    console.log("Article data:", formData)

    // Simulate saving and redirect
    alert(`Bài viết đã được lưu với trạng thái: ${formData.status}`)
    router.push("/author/articles")
  }

  // Format toolbar buttons
  const formatButtons = [
    { icon: Bold, title: "Đậm" },
    { icon: Italic, title: "Nghiêng" },
    { icon: Heading1, title: "Tiêu đề 1" },
    { icon: Heading2, title: "Tiêu đề 2" },
    { icon: List, title: "Danh sách" },
    { icon: ListOrdered, title: "Danh sách có thứ tự" },
    { icon: LinkIcon, title: "Liên kết" },
    { icon: ImageIcon, title: "Hình ảnh" },
    { icon: Code, title: "Mã" },
  ]

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
            <h1 className={styles.pageTitle}>Viết bài mới</h1>
            <div className={styles.pageBreadcrumb}>
              <div className={styles.breadcrumbItem}>Tác giả</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Bài viết</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Viết bài mới</div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="pending">Gửi duyệt</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Lưu bài viết
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className={styles.chartCard}>
            <div className="p-6">
              <div className="mb-4">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề bài viết"
                  className="text-xl font-semibold mt-1"
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="excerpt">Tóm tắt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Nhập tóm tắt bài viết"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Tabs defaultValue="edit" onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Soạn thảo</TabsTrigger>
                  <TabsTrigger value="preview">Xem trước</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="mt-4">
                  {/* Editor Toolbar */}
                  <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-md border">
                    {formatButtons.map((button, index) => (
                      <Button key={index} variant="ghost" size="sm" className="h-8 w-8 p-0" title={button.title}>
                        <button.icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>

                  {/* Editor */}
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Viết nội dung bài viết của bạn ở đây..."
                    className="min-h-[400px] font-mono"
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="min-h-[400px] p-4 border rounded-md prose max-w-none">
                    {previewContent ? (
                      <div dangerouslySetInnerHTML={{ __html: previewContent.replace(/\n/g, "<br/>") }} />
                    ) : (
                      <div className="text-gray-400 italic">Xem trước nội dung bài viết sẽ hiển thị ở đây</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Thông tin bài viết</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Chuyên mục</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Chọn chuyên mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thoi-su">Thời sự</SelectItem>
                      <SelectItem value="the-gioi">Thế giới</SelectItem>
                      <SelectItem value="kinh-doanh">Kinh doanh</SelectItem>
                      <SelectItem value="cong-nghe">Công nghệ</SelectItem>
                      <SelectItem value="the-thao">Thể thao</SelectItem>
                      <SelectItem value="du-lich">Du lịch</SelectItem>
                      <SelectItem value="suc-khoe">Sức khỏe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Thẻ</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Nhập các thẻ, phân cách bằng dấu phẩy"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ví dụ: kinh tế, tài chính, đầu tư</p>
                </div>

                <div>
                  <Label htmlFor="featuredImage">Ảnh đại diện</Label>
                  {formData.featuredImage ? (
                    <div className="mt-2 mb-2 relative">
                      <img
                        src={formData.featuredImage || "/placeholder.svg"}
                        alt="Featured"
                        className="w-full h-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData((prev) => ({ ...prev, featuredImage: null }))}
                      >
                        Xóa
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Kéo thả hoặc nhấp để tải lên</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF tối đa 5MB</p>
                      <Input
                        id="featuredImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => document.getElementById("featuredImage")?.click()}
                      >
                        Chọn ảnh
                      </Button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("preview")}>
                    Xem trước
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chartCard + " mt-6"}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Hướng dẫn</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Tiêu đề:</strong> Nên ngắn gọn, hấp dẫn và mô tả chính xác nội dung bài viết.
                </p>
                <p>
                  <strong>Tóm tắt:</strong> Tóm tắt ngắn gọn nội dung chính của bài viết trong 2-3 câu.
                </p>
                <p>
                  <strong>Nội dung:</strong> Viết rõ ràng, mạch lạc, phân đoạn hợp lý và có dẫn chứng cụ thể.
                </p>
                <p>
                  <strong>Ảnh đại diện:</strong> Chọn ảnh chất lượng cao, liên quan đến nội dung bài viết.
                </p>
                <p>
                  <strong>Thẻ:</strong> Thêm 3-5 thẻ liên quan để giúp độc giả tìm kiếm bài viết dễ dàng hơn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

