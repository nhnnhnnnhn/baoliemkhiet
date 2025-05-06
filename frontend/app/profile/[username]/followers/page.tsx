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
    followersCount: 1245,
  }
}

// Mock function to get user followers
const getUserFollowers = (username: string) => {
  // In a real app, this would fetch data from an API
  return Array(20)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      fullname: `Người dùng ${i + 1}`,
      avatar: `/placeholder.svg?height=100&width=100&text=User+${i + 1}`,
      bio: i % 3 === 0 ? "Nhà báo" : i % 3 === 1 ? "Độc giả" : "Biên tập viên",
      isFollowing: i % 2 === 0,
    }))
}

export default function FollowersPage({ params }: { params: { username: string } }) {
  const user = getUserData(params.username)
  const followers = getUserFollowers(params.username)

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
            <h1 className="text-2xl font-bold">Người theo dõi</h1>
            <p className="text-gray-500">
              {user.followersCount} người theo dõi @{params.username}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm người theo dõi..."
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Followers List */}
        <div className="space-y-4">
          {followers.map((follower) => (
            <div key={follower.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/profile/${follower.username}`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={follower.avatar || "/placeholder.svg"}
                      alt={follower.fullname}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div>
                  <Link href={`/profile/${follower.username}`} className="font-medium hover:text-blue-600">
                    {follower.fullname}
                  </Link>
                  <p className="text-sm text-gray-500">@{follower.username}</p>
                  <p className="text-xs text-gray-500">{follower.bio}</p>
                </div>
              </div>
              <Button variant={follower.isFollowing ? "outline" : "default"} size="sm">
                {follower.isFollowing ? "Đang theo dõi" : "Theo dõi"}
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
          <span className="mx-2 flex items-center">...</span>
          <Button variant="outline" className="mx-1">
            10
          </Button>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
