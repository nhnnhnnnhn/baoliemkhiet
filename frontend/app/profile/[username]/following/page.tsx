"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetFollowing } from "@/src/thunks/follow/followThunk"
import { selectFollowing, selectIsLoadingFollowing } from "@/src/thunks/follow/followSlice"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Skeleton } from "@/components/ui/skeleton"
import { FollowButton } from "@/components/FollowButton"

export default function FollowingPage({ params }: { params: { username: string } }) {
  const username = params.username;
  
  const dispatch = useAppDispatch()
  const following = useAppSelector(selectFollowing)
  const isLoading = useAppSelector(selectIsLoadingFollowing)
  const [searchTerm, setSearchTerm] = useState("")
  const [isClient, setIsClient] = useState(false)
  
  // Mark when component has been rendered on client
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Fetch following on component mount
  useEffect(() => {
    // Only fetch data when on client side
    if (isClient) {
      dispatch(handleGetFollowing())
    }
  }, [dispatch, isClient])
  
  // Filter following based on search term
  const filteredFollowing = searchTerm 
    ? following.filter(follow => 
        follow.journalist?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follow.journalist?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : following
  
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
            <h1 className="text-2xl font-bold">Đang theo dõi</h1>
            <p className="text-gray-500">
              @{username} đang theo dõi {isClient ? following.length : 0} người
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!isClient}
            />
          </div>
        </div>

        {/* Following List */}
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
        ) : filteredFollowing.length === 0 ? (
          // No following found
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            {searchTerm ? (
              <>
                <p className="text-lg font-medium">Không tìm thấy kết quả</p>
                <p className="text-gray-500 mt-1">Không có tác giả nào phù hợp với tìm kiếm của bạn</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">Chưa theo dõi ai</p>
                <p className="text-gray-500 mt-1">Khi bạn theo dõi tác giả, họ sẽ xuất hiện ở đây</p>
              </>
            )}
          </div>
        ) : (
          // Following list
          <div className="space-y-4">
            {filteredFollowing.map((follow) => (
              <div key={follow.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${follow.journalist?.fullname?.toLowerCase().replace(/\s+/g, '')}`}>
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={follow.journalist?.avatar || "/placeholder.svg"}
                        alt={follow.journalist?.fullname || ""}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div>
                    <Link href={`/profile/${follow.journalist?.fullname?.toLowerCase().replace(/\s+/g, '')}`} className="font-medium hover:text-blue-600">
                      {follow.journalist?.fullname || "Tác giả"}
                    </Link>
                    <p className="text-sm text-gray-500">{follow.journalist?.email || ""}</p>
                  </div>
                </div>
                {isClient && <FollowButton journalistId={follow.journalistId} size="sm" />}
              </div>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
