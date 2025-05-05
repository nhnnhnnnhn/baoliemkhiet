import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    followingCount: 87,
  }
}

// Mock function to get user following
const getUserFollowing = (username: string) => {
  // In a real app, this would fetch data from an API
  return Array(15)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      username: `journalist${i + 1}`,
      fullname: `Nhà báo ${i + 1}`,
      avatar: `/placeholder.svg?height=100&width=100&text=Journalist+${i + 1}`,
      bio: "Nhà báo, Biên tập viên",
      articlesCount: Math.floor(Math.random() * 100) + 10,
      isFollowing: true,
    }))
}

export default function FollowingPage({ params }: { params: { username: string } }) {
  const user = getUserData(params.username)
  const following = getUserFollowing(params.username)

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href={`/profile/${params.username}`} className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Đang theo dõi</h1>
            <p className="text-gray-500">
              @{params.username} đang theo dõi {user.followingCount} người
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm người đang theo dõi..."
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Following List */}
        <div className="space-y-4">
          {following.map((followedUser) => (
            <div key={followedUser.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/profile/${followedUser.username}`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={followedUser.avatar || "/placeholder.svg"}
                      alt={followedUser.fullname}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div>
                  <Link href={`/profile/${followedUser.username}`} className="font-medium hover:text-blue-600">
                    {followedUser.fullname}
                  </Link>
                  <p className="text-sm text-gray-500">@{followedUser.username}</p>
                  <p className="text-xs text-gray-500">
                    {followedUser.bio} • {followedUser.articlesCount} bài viết
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Đang theo dõi
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="mx-1">
            1
          </Button>
          <Button variant="outline" className="mx-1">
            2
          </Button>
          <Button variant="outline" className="mx-1">
            3
          </Button>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
