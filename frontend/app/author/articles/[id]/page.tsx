import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, Eye, MessageSquare, Share2, ThumbsUp, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import styles from "../../../admin/admin.module.css"

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  // Mock article data
  const article = {
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
    content: `
      <p>Đội tuyển Việt Nam đã có một trận đấu xuất sắc khi đánh bại đối thủ mạnh với tỷ số 2-0 trong trận đấu thuộc vòng loại World Cup diễn ra vào tối qua.</p>
      
      <p>Hai bàn thắng được ghi do công của tiền đạo Nguyễn Tiến Linh ở phút thứ 30 và tiền vệ Nguyễn Quang Hải ở phút 75. Đây là chiến thắng quan trọng giúp đội tuyển Việt Nam cải thiện vị trí trên bảng xếp hạng và nuôi hy vọng tiến xa hơn trong hành trình chinh phục tấm vé dự World Cup.</p>
      
      <h2>Diễn biến trận đấu</h2>
      
      <p>Ngay từ đầu trận, đội tuyển Việt Nam đã thể hiện lối chơi tấn công mạnh mẽ. Các cầu thủ liên tục tạo ra những tình huống nguy hiểm về phía khung thành đối phương.</p>
      
      <p>Phút thứ 30, từ đường chuyền của Quang Hải, Tiến Linh đã thoát xuống và dứt điểm chính xác, mở tỷ số cho đội tuyển Việt Nam.</p>
      
      <p>Sang hiệp hai, dù đối phương tăng cường tấn công nhưng hàng thủ Việt Nam đã chơi rất chắc chắn. Phút 75, Quang Hải có pha đi bóng và dứt điểm từ ngoài vòng cấm, nâng tỷ số lên 2-0 cho đội tuyển Việt Nam.</p>
      
      <h2>Nhận định từ chuyên gia</h2>
      
      <p>Theo nhận định của các chuyên gia, đội tuyển Việt Nam đã có một trận đấu hoàn hảo cả về chiến thuật lẫn tinh thần. HLV Park Hang-seo đã có những điều chỉnh hợp lý về đội hình và chiến thuật, giúp đội tuyển Việt Nam kiểm soát tốt trận đấu.</p>
      
      <p>"Đây là một trong những trận đấu hay nhất của đội tuyển Việt Nam trong vòng loại World Cup. Các cầu thủ đã thể hiện được bản lĩnh và kỹ thuật tốt. Chiến thắng này mở ra cơ hội lớn cho đội tuyển Việt Nam ở các trận đấu tiếp theo", chuyên gia bóng đá Trần Văn D nhận định.</p>
      
      <h2>Cơ hội tiến xa</h2>
      
      <p>Với chiến thắng này, đội tuyển Việt Nam đã cải thiện đáng kể vị trí trên bảng xếp hạng. Nếu tiếp tục duy trì phong độ tốt ở các trận đấu sắp tới, cơ hội tiến xa trong vòng loại World Cup là hoàn toàn có thể.</p>
      
      <p>Trận đấu tiếp theo của đội tuyển Việt Nam sẽ diễn ra vào ngày 10/04/2025. Đây sẽ là thử thách quan trọng để đội tuyển Việt Nam khẳng định vị thế của mình trong khu vực.</p>
    `,
    relatedArticles: [
      {
        id: "ART-002",
        title: "Phân tích chiến thuật của HLV Park Hang-seo trong trận đấu với đội tuyển Malaysia",
        category: "Thể thao",
        publishedAt: "03/04/2025",
      },
      {
        id: "ART-003",
        title: "Tiền vệ Nguyễn Quang Hải: 'Chúng tôi đặt mục tiêu tiến xa nhất có thể trong vòng loại World Cup'",
        category: "Thể thao",
        publishedAt: "02/04/2025",
      },
      {
        id: "ART-004",
        title: "Lịch thi đấu của đội tuyển Việt Nam trong vòng loại World Cup 2026",
        category: "Thể thao",
        publishedAt: "01/04/2025",
      },
    ],
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <Link href="/author/articles">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <h1 className={styles.pageTitle}>Chi tiết bài viết</h1>
        </div>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Tác giả</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Bài viết</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>{article.id}</div>
        </div>
      </div>

      {/* Article Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{article.title}</CardTitle>
              <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
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
                <Badge variant="secondary">{article.category}</Badge>
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
              <Link href={`/author/articles/${article.id}/edit`}>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </Link>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Article Content and Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Article Content */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nội dung bài viết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            </CardContent>
          </Card>
        </div>

        {/* Article Metadata */}
        <div className="space-y-6">
          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Tác giả</h4>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={article.author.avatar} alt={article.author.name} />
                    <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{article.author.name}</span>
                </div>
              </div>

              {article.editor && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Biên tập viên</h4>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{article.editor.name}</span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Chuyên mục</h4>
                <Badge variant="secondary">{article.category}</Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Thẻ</h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Ngày xuất bản</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{article.publishedAt}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Cập nhật lần cuối</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{article.updatedAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Lượt xem</span>
                </div>
                <span className="font-medium">{article.views.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Lượt thích</span>
                </div>
                <span className="font-medium">{article.likes.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Bình luận</span>
                </div>
                <span className="font-medium">{article.comments.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bài viết liên quan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {article.relatedArticles.map((relatedArticle) => (
                  <div key={relatedArticle.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <Link href={`/author/articles/${relatedArticle.id}`} className="hover:underline">
                      <h4 className="font-medium mb-1">{relatedArticle.title}</h4>
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Badge variant="secondary" className="mr-2">
                        {relatedArticle.category}
                      </Badge>
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {relatedArticle.publishedAt}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
