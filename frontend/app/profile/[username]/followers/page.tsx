"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetFollowers } from "@/src/thunks/follow/followThunk"
import { selectFollowers, selectIsLoadingFollowers } from "@/src/thunks/follow/followSlice"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import userApi, { User } from "@/src/apis/user"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Skeleton } from "@/components/ui/skeleton"
import { FollowButton } from "@/components/FollowButton"

export default function FollowersPage({ params }: { params: { username: string } }) {
  const username = params.username;
  
  const dispatch = useAppDispatch()
  const followers = useAppSelector(selectFollowers)
  const isLoading = useAppSelector(selectIsLoadingFollowers)
  const currentUser = useAppSelector(selectCurrentUser)
  const [searchTerm, setSearchTerm] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [profileUser, setProfileUser] = useState<User | null>(null)
  
  // Mark when component has been rendered on client
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Fetch user data first
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await userApi.getUsers({
          search: username,
          role: username.toLowerCase() === 'admin' ? 'ADMIN' : undefined,
          limit: 5
        })
        const matchedUser = users.users.find((u: User) => {
          if (username.toLowerCase() === 'admin') {
            return u.role === 'ADMIN'
          }
          return u.fullname.replace(/\s+/g, '').toLowerCase() === username.toLowerCase()
        })
        if (matchedUser) {
          setProfileUser(matchedUser)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    if (isClient) {
      fetchUserData()
    }
  }, [username, isClient])
  
  // Fetch followers on component mount
  useEffect(() => {
    if (isClient && profileUser?.id) {
      dispatch(handleGetFollowers(profileUser.id))
    }
  }, [dispatch, isClient, profileUser?.id])
  
  // Filter followers based on search term
  const filteredFollowers = searchTerm 
    ? followers.filter(follow => 
        follow.follower?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follow.follower?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : followers
  
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href={`/profile/${username}`} className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Người theo dõi</h1>
            <p className="text-gray-500">
              {isClient ? followers.length : 0} người theo dõi @{username}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!isClient}
            />
          </div>
        </div>

        {/* Followers List */}
        {!isClient || isLoading ? (
          // Loading skeletons
          <div className="space-y-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-24 h-3 mb-1" />
                    <Skeleton className="w-40 h-3" />
                  </div>
                </div>
                <Skeleton className="w-24 h-9" />
              </div>
            ))}
          </div>
        ) : filteredFollowers.length === 0 ? (
          // No followers found
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            {searchTerm ? (
              <>
                <p className="text-lg font-medium">Không tìm thấy kết quả</p>
                <p className="text-gray-500 mt-1">Không có người theo dõi nào phù hợp với tìm kiếm của bạn</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">Chưa có người theo dõi</p>
                <p className="text-gray-500 mt-1">Khi có người theo dõi bạn, họ sẽ xuất hiện ở đây</p>
              </>
            )}
          </div>
        ) : (
          // Followers list
          <div className="space-y-4">
            {filteredFollowers.map((follow) => (
              <div key={follow.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${follow.follower?.fullname?.toLowerCase().replace(/\s+/g, '')}`}>
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={follow.follower?.avatar || "/placeholder.svg"}
                        alt={follow.follower?.fullname || ""}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div>
                    <Link href={`/profile/${follow.follower?.fullname?.toLowerCase().replace(/\s+/g, '')}`} className="font-medium hover:text-blue-600">
                      {follow.follower?.fullname || "Người dùng"}
                    </Link>
                    <p className="text-sm text-gray-500">{follow.follower?.email || ""}</p>
                  </div>
                </div>
                
                {/* Only show follow button if not the current user */}
                {isClient && currentUser?.id !== follow.followerId && follow.follower?.id && (
                  <FollowButton journalistId={follow.follower.id} size="sm" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
