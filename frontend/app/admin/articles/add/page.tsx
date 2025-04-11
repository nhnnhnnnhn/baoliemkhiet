import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import styles from "../../admin.module.css"

export default function AddArticlePage() {
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
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Lưu bài viết
        </Button>
      </div>

      {/* Add Article Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Nội dung bài viết</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" placeholder="Nhập tiêu đề bài viết" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="excerpt">Tóm tắt</Label>
                  <Textarea id="excerpt" placeholder="Nhập tóm tắt bài viết" className="mt-1" rows={3} />
                </div>
                <div>
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea id="content" placeholder="Nhập nội dung bài viết" className="mt-1 font-mono" rows={20} />
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
                  <Select>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Chuyên mục</Label>
                  <Select>
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
                  <Input id="tags" placeholder="Nhập các thẻ, phân cách bằng dấu phẩy" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="featuredImage">Ảnh đ��i diện</Label>
                  <Input id="featuredImage" type="file" className="mt-1" />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full">
                    Xem trước
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
