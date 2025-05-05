import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, ThumbsUp, Share2, Bookmark, Facebook, Twitter, AlertTriangle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ChatbotButton } from "@/components/chatbot-button"

// Giả lập dữ liệu bài viết
const getArticleData = (slug: string) => {
  return {
    id: "article123", // Added article ID
    title: "Việt Nam đạt thỏa thuận hợp tác kinh tế mới với các nước ASEAN",
    publishDate: "15/04/2025",
    publishTime: "08:30",
    category: "Kinh doanh",
    author: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=80&width=80",
      bio: "Phóng viên kinh tế với hơn 10 năm kinh nghiệm theo dõi thị trường Đông Nam Á",
      username: "nguyenvanA",
    },
    content: [
      {
        type: "text",
        value:
          "Hà Nội - Trong khuôn khổ Hội nghị cấp cao ASEAN lần thứ 42, Việt Nam đã đạt được thỏa thuận hợp tác kinh tế mới với các nước thành viên, mở ra cơ hội phát triển mới cho khu vực.",
      },
      {
        type: "text",
        value:
          "Theo thỏa thuận mới, các nước ASEAN sẽ tăng cường hợp tác trong lĩnh vực công nghệ cao, chuyển đổi số và phát triển bền vững. Đây được xem là bước tiến quan trọng trong việc thúc đẩy tăng trưởng kinh tế khu vực sau đại dịch.",
      },
      {
        type: "image",
        url: "/placeholder.svg?height=500&width=800",
        caption: "Đại diện các nước ASEAN tại lễ ký kết thỏa thuận hợp tác kinh tế mới",
      },
      {
        type: "text",
        value:
          "Thủ tướng Chính phủ nhấn mạnh tầm quan trọng của việc tăng cường kết nối kinh tế khu vực trong bối cảnh thế giới đang đối mặt với nhiều thách thức. 'Chúng ta cần đoàn kết và hợp tác chặt chẽ hơn nữa để vượt qua khó khăn, tạo động lực mới cho tăng trưởng kinh tế khu vực', Thủ tướng phát biểu.",
      },
      {
        type: "text",
        value:
          "Các chuyên gia kinh tế đánh giá cao thỏa thuận này và cho rằng đây là cơ hội để Việt Nam mở rộng thị trường xuất khẩu, thu hút đầu tư và nâng cao vị thế trong khu vực.",
      },
      {
        type: "image",
        url: "/placeholder.svg?height=500&width=800",
        caption: "Biểu đồ tăng trưởng kinh tế của các nước ASEAN giai đoạn 2020-2025",
      },
      {
        type: "text",
        value:
          "Theo số liệu thống kê, kim ngạch thương mại giữa Việt Nam và các nước ASEAN đã tăng 15% trong năm 2024, đạt 80 tỷ USD. Với thỏa thuận mới, con số này dự kiến sẽ tăng lên 100 tỷ USD vào năm 2026.",
      },
      {
        type: "text",
        value:
          "Bên cạnh đó, thỏa thuận cũng đề cập đến việc thúc đẩy hợp tác trong lĩnh vực an ninh mạng, một vấn đề ngày càng được quan tâm trong kỷ nguyên số. Các nước sẽ chia sẻ kinh nghiệm, công nghệ và thông tin để bảo vệ hệ thống thông tin và dữ liệu quan trọng.",
      },
      {
        type: "text",
        value:
          "Dự kiến, các dự án hợp tác cụ thể sẽ được triển khai từ quý III năm 2025, với tổng vốn đầu tư lên đến 5 tỷ USD từ các quốc gia thành viên và đối tác quốc tế.",
      },
    ],
    comments: [
      {
        user: {
          name: "Trần Văn B",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        date: "15/04/2025",
        time: "10:15",
        content: "Tin tức rất hữu ích. Mong rằng thỏa thuận này sẽ mang lại nhiều cơ hội cho doanh nghiệp Việt Nam.",
        likes: 15,
      },
      {
        user: {
          name: "Lê Thị C",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        date: "15/04/2025",
        time: "11:30",
        content:
          "Tôi quan tâm đến các dự án hợp tác cụ thể. Bài viết có thể cung cấp thêm thông tin chi tiết về các lĩnh vực ưu tiên không?",
        likes: 8,
      },
      {
        user: {
          name: "Phạm Văn D",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        date: "15/04/2025",
        time: "13:45",
        content:
          "Đây là một bước tiến quan trọng cho ASEAN. Tôi hy vọng các nước sẽ thực hiện nghiêm túc các cam kết đã đưa ra.",
        likes: 12,
      },
    ],
    relatedArticles: [
      {
        title: "ASEAN và EU ký kết hiệp định thương mại tự do",
        slug: "asean-eu-ky-ket-hiep-dinh-thuong-mai-tu-do",
        thumbnail: "/placeholder.svg?height=200&width=300",
        category: "Kinh doanh",
        publishDate: "10/04/2025",
      },
      {
        title: "Việt Nam tăng 5 bậc trong bảng xếp hạng môi trường kinh doanh toàn cầu",
        slug: "viet-nam-tang-5-bac-trong-bang-xep-hang-moi-truong-kinh-doanh",
        thumbnail: "/placeholder.svg?height=200&width=300",
        category: "Kinh doanh",
        publishDate: "08/04/2025",
      },
      {
        title: "Doanh nghiệp công nghệ Việt Nam đón đầu xu hướng AI",
        slug: "doanh-nghiep-cong-nghe-viet-nam-don-dau-xu-huong-ai",
        thumbnail: "/placeholder.svg?height=200&width=300",
        category: "Công nghệ",
        publishDate: "12/04/2025",
      },
    ],
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleData(params.slug)

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">
            Trang chủ
          </Link>{" "}
          &gt;{" "}
          <Link href={`/${article.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:underline">
            {article.category}
          </Link>{" "}
          &gt; <span className="text-gray-700">Bài viết hiện tại</span>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>{article.publishDate}</span>
            <span className="mx-2">•</span>
            <span>{article.publishTime}</span>
            <span className="mx-2">•</span>
            <Link
              href={`/${article.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-blue-600 hover:underline"
            >
              {article.category}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{article.title}</h1>

          {/* Social Share */}
          <div className="flex space-x-4 mb-6">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Facebook size={16} />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Twitter size={16} />
              <span className="hidden sm:inline">Tweet</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 size={16} />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bookmark size={16} />
              <span className="hidden sm:inline">Lưu</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <Link href={`/user/reports/add?articleId=${article.id}`}>Báo cáo</Link>
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-10">
          {article.content.map((block, index) => {
            if (block.type === "text") {
              return (
                <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                  {block.value}
                </p>
              )
            } else if (block.type === "image") {
              return (
                <figure key={index} className="my-8">
                  <div className="relative w-full h-[400px]">
                    <Image
                      src={block.url || "/placeholder.svg"}
                      alt={block.caption}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <figcaption className="text-sm text-gray-500 mt-2 text-center italic">{block.caption}</figcaption>
                </figure>
              )
            }
            return null
          })}
        </div>

        {/* Author Info */}
        <div className="bg-gray-50 p-6 rounded-lg mb-10">
          <Link href={`/profile/${article.author.username}`} className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold mb-1">Tác giả: {article.author.name}</h3>
              <p className="text-gray-600 mb-3">{article.author.bio}</p>
              <Button variant="outline" size="sm">
                Xem tất cả bài viết
              </Button>
            </div>
          </Link>
        </div>

        <Separator className="my-10" />

        {/* Comments Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Bình luận ({article.comments.length})</h2>

          {/* Comment Form */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Để lại bình luận</h3>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Viết bình luận của bạn..."
            ></textarea>
            <Button>Gửi bình luận</Button>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {article.comments.map((comment, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{comment.user.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {comment.date} • {comment.time}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <ThumbsUp size={16} />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <MessageSquare size={16} />
                    <span>Trả lời</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10" />

        {/* Related Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Bài viết bạn có thể quan tâm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.relatedArticles.map((relatedArticle, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={relatedArticle.thumbnail || "/placeholder.svg"}
                    alt={relatedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {relatedArticle.category} • {relatedArticle.publishDate}
                  </div>
                  <Link
                    href={`/article/${relatedArticle.slug}`}
                    className="text-lg font-semibold hover:text-blue-600 line-clamp-2"
                  >
                    {relatedArticle.title}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <ChatbotButton />
    </>
  )
}
