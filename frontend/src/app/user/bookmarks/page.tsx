import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Bookmark } from "lucide-react"

export const metadata: Metadata = {
  title: "Bài viết đã lưu | Báo Liêm Khiết",
  description: "Danh sách bài viết bạn đã lưu",
}

interface BookmarkedArticleProps {
  id: number
  title: string
  excerpt: string
  thumbnail: string
  author: string
  category: string
  publishedAt: string
  savedAt: string
}

export default function BookmarksPage() {
  // Dữ liệu mẫu
  const bookmarkedArticles: BookmarkedArticleProps[] = [
    {
      id: 1,
      title: "Kinh tế Việt Nam tăng trưởng mạnh trong quý 2/2023",
      excerpt: "Theo số liệu mới nhất từ Tổng cục Thống kê, kinh tế Việt Nam đã tăng trưởng 6.5% trong quý 2/2023...",
      thumbnail: "/placeholder.svg?key=oej1w",
      author: "Nguyễn Văn A",
      category: "Kinh doanh",
      publishedAt: "2023-07-15T08:30:00Z",
      savedAt: "2023-07-16T10:45:00Z",
    },
    {
      id: 2,
      title: "Đội tuyển Việt Nam chuẩn bị cho AFF Cup 2023",
      excerpt: "HLV Philippe Troussier đã công bố danh sách sơ bộ 30 cầu thủ chuẩn bị cho AFF Cup 2023...",
      thumbnail: "/placeholder.svg?key=5p6j7",
      author: "Lê Văn C",
      category: "Thể thao",
      publishedAt: "2023-07-10T14:20:00Z",
      savedAt: "2023-07-10T18:30:00Z",
    },
    {
      id: 3,
      title: "Xu hướng công nghệ nổi bật năm 2023",
      excerpt: "AI, Metaverse và Web3 là những xu hướng công nghệ đang định hình tương lai của ngành công nghiệp số...",
      thumbnail: "/placeholder.svg?key=ms65k",
      author: "Trần Thị B",
      category: "Công nghệ",
      publishedAt: "2023-07-05T09:15:00Z",
      savedAt: "2023-07-06T07:20:00Z",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bài viết đã lưu</h2>
      </div>

      <div className="rounded-md border">
        {bookmarkedArticles.length > 0 ? (
          <div className="divide-y">
            {bookmarkedArticles.map((article) => (
              <div key={article.id} className="flex p-4">
                <div className="mr-4 w-[120px] h-[80px] relative flex-shrink-0">
                  <Image
                    src={article.thumbnail || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/article/${article.id}`} className="text-lg font-medium hover:underline line-clamp-2">
                    {article.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <span>{article.author}</span>
                    <span className="mx-1">•</span>
                    <span>{article.category}</span>
                    <span className="mx-1">•</span>
                    <span>Đăng: {formatDate(article.publishedAt)}</span>
                    <span className="mx-1">•</span>
                    <span>Đã lưu: {formatDate(article.savedAt)}</span>
                  </div>
                </div>
                <button className="ml-4 text-gray-500 hover:text-red-500">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">Chưa có bài viết đã lưu</h3>
            <p className="mt-1 text-sm text-gray-500">Lưu bài viết để đọc sau hoặc tham khảo khi cần.</p>
            <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Khám phá bài viết
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
