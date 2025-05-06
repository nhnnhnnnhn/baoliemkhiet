import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, MapPinIcon, UserIcon, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Mock function to get user data
const getUserData = (username: string) => {
  // In a real app, this would fetch data from an API
  return {
    id: 1,
    username: username,
    fullname: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=200&width=200&text=Avatar",
    bio: "Phóng viên kinh tế với hơn 10 năm kinh nghiệm theo dõi thị trường Đông Nam Á",
    role: "JOURNALIST",
    location: "Hà Nội, Việt Nam",
    joinedDate: "Tháng 4, 2023",
    followersCount: 1245,
    followingCount: 87,
    articlesCount: 156,
    isFollowing: false,
  }
}

// Mock function to get user articles
const getUserArticles = (username: string) => {
  // In a real app, this would fetch data from an API
  return [
    {
      id: 1,
      title: "Việt Nam đạt thỏa thuận hợp tác kinh tế mới với các nước ASEAN",
      slug: "viet-nam-dat-thoa-thuan-hop-tac-kinh-te-moi-voi-cac-nuoc-asean",
      excerpt:
        "Trong khuôn khổ Hội nghị cấp cao ASEAN lần thứ 42, Việt Nam đã đạt được thỏa thuận hợp tác kinh tế mới với các nước thành viên.",
      publishedAt: "15/04/2025",
      category: "Kinh doanh",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Article+1",
      views: 12543,
      likes: 345,
      comments: 56,
    },
    {
      id: 2,
      title: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
      slug: "thi-truong-bat-dong-san-phia-nam-khoi-sac-trong-quy-ii",
      excerpt: "Các chuyên gia nhận định thị trường sẽ sôi động trở lại nhờ các chính sách hỗ trợ mới.",
      publishedAt: "10/04/2025",
      category: "Kinh doanh",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Article+2",
      views: 8932,
      likes: 267,
      comments: 42,
    },
    {
      id: 3,
      title: "Doanh nghiệp công nghệ Việt Nam đón đầu xu hướng AI",
      slug: "doanh-nghiep-cong-nghe-viet-nam-don-dau-xu-huong-ai",
      excerpt:
        "Các doanh nghiệp công nghệ trong nước đang tích cực đầu tư vào nghiên cứu và ứng dụng trí tuệ nhân tạo.",
      publishedAt: "05/04/2025",
      category: "Công nghệ",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Article+3",
      views: 7654,
      likes: 198,
      comments: 37,
    },
  ]
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = getUserData(params.username)
  const articles = getUserArticles(params.username)

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className="relative -mt-20 md:-mt-24">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden">
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.fullname}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{user.fullname}</h1>
                    <p className="text-gray-500">@{user.username}</p>
                  </div>
                  <div>
                    <Button>{user.isFollowing ? "Đang theo dõi" : "Theo dõi"}</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio and Stats */}
            <div className="mt-6">
              <p className="text-gray-700 mb-4">{user.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {user.role === "JOURNALIST" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Nhà báo
                  </span>
                )}
                {user.location && (
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {user.location}
                  </span>
                )}
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Tham gia {user.joinedDate}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t">
              <Link href={`/profile/${user.username}/followers`} className="flex items-center hover:text-blue-600">
                <Users className="h-5 w-5 mr-2" />
                <span className="font-bold">{user.followersCount}</span>
                <span className="ml-1">người theo dõi</span>
              </Link>
              <Link href={`/profile/${user.username}/following`} className="flex items-center hover:text-blue-600">
                <UserIcon className="h-5 w-5 mr-2" />
                <span className="font-bold">{user.followingCount}</span>
                <span className="ml-1">đang theo dõi</span>
              </Link>
              <div className="flex items-center">
                <span className="font-bold">{user.articlesCount}</span>
                <span className="ml-1">bài viết</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="articles">
          <TabsList className="mb-6">
            <TabsTrigger value="articles">Bài viết</TabsTrigger>
            <TabsTrigger value="about">Giới thiệu</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <Image
                      src={article.thumbnail || "/placeholder.svg"}
                      alt={article.title}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="font-medium text-blue-600">{article.category}</span>
                      <span className="mx-2">•</span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                      <Link href={`/article/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">{article.views.toLocaleString()} lượt xem</span>
                      <span className="mr-4">{article.likes} lượt thích</span>
                      <span>{article.comments} bình luận</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="about">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Giới thiệu</h2>
              <p className="text-gray-700 mb-6">{user.bio}</p>

              <h3 className="text-lg font-semibold mb-3">Thông tin liên hệ</h3>
              <div className="space-y-2 text-gray-700">
                <p>Email: {user.username}@example.com</p>
                {user.location && <p>Địa chỉ: {user.location}</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <SiteFooter />
    </>
  )
}
