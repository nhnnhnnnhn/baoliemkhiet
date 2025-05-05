import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Đang theo dõi | Báo Liêm Khiết",
  description: "Danh sách tác giả bạn đang theo dõi",
}

interface FollowingAuthorProps {
  id: number
  name: string
  avatar: string
  bio: string
  articleCount: number
  followedAt: string
}

export default function FollowingPage() {
  // Dữ liệu mẫu
  const followingAuthors: FollowingAuthorProps[] = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/diverse-avatars.png",
      bio: "Phóng viên chuyên mục Thời sự",
      articleCount: 45,
      followedAt: "2023-04-15T08:30:00Z",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "/placeholder.svg?key=cj7mk",
      bio: "Biên tập viên chuyên mục Kinh doanh",
      articleCount: 32,
      followedAt: "2023-03-20T15:45:00Z",
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "/placeholder.svg?key=pyy0g",
      bio: "Phóng viên chuyên mục Thể thao",
      articleCount: 67,
      followedAt: "2023-02-10T10:20:00Z",
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
        <h2 className="text-3xl font-bold tracking-tight">Đang theo dõi</h2>
      </div>

      <div className="rounded-md border">
        {followingAuthors.length > 0 ? (
          <div className="divide-y">
            {followingAuthors.map((author) => (
              <div key={author.id} className="flex items-start p-4">
                <div className="mr-4">
                  <Image
                    src={author.avatar || "/placeholder.svg"}
                    alt={author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/profile/${author.id}`} className="text-lg font-medium hover:underline">
                    {author.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{author.bio}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {author.articleCount} bài viết • Theo dõi từ {formatDate(author.followedAt)}
                  </p>
                </div>
                <button className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50">
                  Bỏ theo dõi
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="mt-2 text-lg font-medium">Bạn chưa theo dõi ai</h3>
            <p className="mt-1 text-sm text-gray-500">
              Hãy theo dõi các tác giả yêu thích để nhận thông báo về bài viết mới.
            </p>
            <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Khám phá tác giả
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
