import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import styles from "../../../admin.module.css"

export default function EditArticlePage({ params }: { params: { id: string } }) {
  // Mock article data - in a real app, you would fetch this from an API
  const article = {
    id: params.id,
    title: "Chính phủ công bố kế hoạch phát triển kinh tế 5 năm tới",
    content: `Hôm nay, Chính phủ đã chính thức công bố kế hoạch phát triển kinh tế cho 5 năm tới, với mục tiêu tăng trưởng GDP bình quân 6,5-7% mỗi năm.

Theo ông Nguyễn Văn X, Bộ trưởng Bộ Kế hoạch và Đầu tư, kế hoạch này tập trung vào 5 trụ cột chính:

- Phát triển kinh tế số và chuyển đổi số toàn diện
- Đẩy mạnh cải cách hành chính và cải thiện môi trường đầu tư
- Phát triển cơ sở hạ tầng đồng bộ và hiện đại
- Nâng cao chất lượng nguồn nhân lực
- Phát triển bền vững và bảo vệ môi trường

"Đây là kế hoạch toàn diện nhất từ trước đến nay, với sự tham gia đóng góp ý kiến của nhiều chuyên gia kinh tế hàng đầu trong và ngoài nước", ông X cho biết.

Kế hoạch cũng đề ra mục tiêu đưa Việt Nam trở thành nước có thu nhập trung bình cao vào năm 2030 và thu nhập cao vào năm 2045.

Các chuyên gia kinh tế đánh giá cao tính khả thi của kế hoạch này, đặc biệt là việc tập trung vào chuyển đổi số và phát triển bền vững.

Tuy nhiên, cũng có những ý kiến cho rằng để đạt được các mục tiêu đề ra, Việt Nam cần có những giải pháp mạnh mẽ hơn nữa trong việc cải cách thể chế và nâng cao năng lực cạnh tranh.`,
    excerpt:
      "Chính phủ đã chính thức công bố kế hoạch phát triển kinh tế cho 5 năm tới, với mục tiêu tăng trưởng GDP bình quân 6,5-7% mỗi năm.",
    category: "Thời sự",
    tags: "Kinh tế, Chính phủ, Phát triển",
    status: "Đã xuất bản",
    featuredImage: "/placeholder.svg?height=400&width=800",
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <Link href={`/admin/articles/${article.id}`}>
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
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Lưu thay đổi
        </Button>
      </div>

      {/* Edit Article Form */}
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
                  <Input id="title" defaultValue={article.title} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="excerpt">Tóm tắt</Label>
                  <Textarea id="excerpt" defaultValue={article.excerpt} className="mt-1" rows={3} />
                </div>
                <div>
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea id="content" defaultValue={article.content} className="mt-1 font-mono" rows={20} />
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
                  <Select defaultValue={article.status}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đã xuất bản">Đã xuất bản</SelectItem>
                      <SelectItem value="Chờ duyệt">Chờ duyệt</SelectItem>
                      <SelectItem value="Bản nháp">Bản nháp</SelectItem>
                      <SelectItem value="Từ chối">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Chuyên mục</Label>
                  <Select defaultValue={article.category}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Chọn chuyên mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thời sự">Thời sự</SelectItem>
                      <SelectItem value="Thế giới">Thế giới</SelectItem>
                      <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                      <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                      <SelectItem value="Thể thao">Thể thao</SelectItem>
                      <SelectItem value="Du lịch">Du lịch</SelectItem>
                      <SelectItem value="Sức khỏe">Sức khỏe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Thẻ</Label>
                  <Input
                    id="tags"
                    defaultValue={article.tags}
                    className="mt-1"
                    placeholder="Nhập các thẻ, phân cách bằng dấu phẩy"
                  />
                </div>
                <div>
                  <Label htmlFor="featuredImage">Ảnh đại diện</Label>
                  <div className="mt-1 mb-2">
                    <img
                      src={article.featuredImage || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
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

