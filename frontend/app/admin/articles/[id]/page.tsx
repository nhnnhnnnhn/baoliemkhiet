import Link from "next/link"
import { ArrowLeft, Calendar, Edit, Eye, MessageSquare, ThumbsUp, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "../../admin.module.css"

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  // Mock article data - in a real app, you would fetch this from an API
  const article = {
    id: params.id,
    title: "Chính phủ công bố kế hoạch phát triển kinh tế 5 năm tới",
    content: `
      <p>Hôm nay, Chính phủ đã chính thức công bố kế hoạch phát triển kinh tế cho 5 năm tới, với mục tiêu tăng trưởng GDP bình quân 6,5-7% mỗi năm.</p>
      
      <p>Theo ông Nguyễn Văn X, Bộ trưởng Bộ Kế hoạch và Đầu tư, kế hoạch này tập trung vào 5 trụ cột chính:</p>
      
      <ul>
        <li>Phát triển kinh tế số và chuyển đổi số toàn diện</li>
        <li>Đẩy mạnh cải cách hành chính và cải thiện môi trường đầu tư</li>
        <li>Phát triển cơ sở hạ tầng đồng bộ và hiện đại</li>
        <li>Nâng cao chất lượng nguồn nhân lực</li>
        <li>Phát triển bền vững và bảo vệ môi trường</li>
      </ul>
      
      <p>"Đây là kế hoạch toàn diện nhất từ trước đến nay, với sự tham gia đóng góp ý kiến của nhiều chuyên gia kinh tế hàng đầu trong và ngoài nước", ông X cho biết.</p>
      
      <p>Kế hoạch cũng đề ra mục tiêu đưa Việt Nam trở thành nước có thu nhập trung bình cao vào năm 2030 và thu nhập cao vào năm 2045.</p>
      
      <p>Các chuyên gia kinh tế đánh giá cao tính khả thi của kế hoạch này, đặc biệt là việc tập trung vào chuyển đổi số và phát triển bền vững.</p>
      
      <p>Tuy nhiên, cũng có những ý kiến cho rằng để đạt được các mục tiêu đề ra, Việt Nam cần có những giải pháp mạnh mẽ hơn nữa trong việc cải cách thể chế và nâng cao năng lực cạnh tranh.</p>
    `,
    excerpt:
      "Chính phủ đã chính thức công bố kế hoạch phát triển kinh tế cho 5 năm tới, với mục tiêu tăng trưởng GDP bình quân 6,5-7% mỗi năm.",
    category: "Thời sự",
    tags: ["Kinh tế", "Chính phủ", "Phát triển"],
    author: "Nguyễn Văn A",
    status: "Đã xuất bản",
    views: 12543,
    likes: 345,
    comments: 45,
    publishedAt: "05/04/2025 08:30",
    updatedAt: "05/04/2025 10:15",
    featuredImage: "/placeholder.svg?height=400&width=800",
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
          <Link href={`/admin/articles/${article.id}/edit`}>
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
              <h3 className={styles.chartTitle}>Nội dung bài viết</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  article.status === "Đã xuất bản"
                    ? "bg-green-100 text-green-800"
                    : article.status === "Chờ duyệt"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {article.status}
              </span>
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
              <div className="mb-6">
                <img
                  src={article.featuredImage || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
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
                  <div className="text-sm font-medium text-gray-500 mb-1">Chuyên mục</div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Thẻ</div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Tác giả</div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    {article.author}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Ngày xuất bản</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    {article.publishedAt}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Cập nhật lần cuối</div>
                  <div>{article.updatedAt}</div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{article.views.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Lượt xem</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <ThumbsUp className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{article.likes}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Lượt thích</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{article.comments}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Bình luận</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

