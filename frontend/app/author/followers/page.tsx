"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Filter, ChevronLeftIcon, ChevronRightIcon, Calendar, Clock, User, UserX } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import followApi, { Follow } from "@/src/apis/follow"
import styles from "../author.module.css"

// Định nghĩa các tùy chọn lọc theo thời gian
const TIME_FILTERS = {
  ALL: {
    value: "all",
    label: "Tất cả",
    getDateRange: () => ({ start: null, end: null })
  },
  LAST_WEEK: {
    value: "last_week",
    label: "Tuần trước",
    getDateRange: () => {
      const today = new Date()
      const lastWeek = new Date(today)
      lastWeek.setDate(today.getDate() - 7)
      return { start: lastWeek, end: today }
    }
  },
  LAST_MONTH: {
    value: "last_month",
    label: "Tháng trước",
    getDateRange: () => {
      const today = new Date()
      const lastMonth = new Date(today)
      lastMonth.setMonth(today.getMonth() - 1)
      return { start: lastMonth, end: today }
    }
  },
  LAST_3_MONTHS: {
    value: "last_3_months",
    label: "3 tháng trước",
    getDateRange: () => {
      const today = new Date()
      const last3Months = new Date(today)
      last3Months.setMonth(today.getMonth() - 3)
      return { start: last3Months, end: today }
    }
  }
} as const

export default function AuthorFollowersPage() {
  const [followers, setFollowers] = useState<Follow[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | null>(null)
  const [followerToRemove, setFollowerToRemove] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const perPage = 10

  const currentUser = useAppSelector(selectCurrentUser)
  const authorId = currentUser?.id

  // Load followers
  useEffect(() => {
    if (authorId) {
      fetchFollowers()
    }
  }, [authorId, page, timeFilter, sortBy])

  const fetchFollowers = async () => {
    if (!authorId) return
    setIsLoading(true)
    
    try {
      const rawFollowers = await followApi.getFollowers(authorId)
      let filtered = [...rawFollowers]
      
      // Apply time filter if needed
      if (timeFilter !== 'all') {
        const filter = TIME_FILTERS[timeFilter.toUpperCase() as keyof typeof TIME_FILTERS]
        if (filter) {
          const { start, end } = filter.getDateRange()
          if (start && end) {
            filtered = filtered.filter(follower => {
              const createdDate = new Date(follower.createdAt)
              return createdDate >= start && createdDate <= end
            })
          }
        }
      }
      
      // Apply sorting
      if (sortBy) {
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return sortBy === 'newest' ? dateB - dateA : dateA - dateB
        })
      }
      
      // Calculate pagination
      setTotalPages(Math.ceil(filtered.length / perPage))
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedFollowers = filtered.slice(startIndex, endIndex)
      
      setFollowers(paginatedFollowers)
    } catch (error) {
      console.error('Error loading followers:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người theo dõi",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle removing follower (unfollow)
  const handleRemoveFollower = async (followerId: number) => {
    try {
      await followApi.deleteFollowerByJournalist(followerId)
      toast({
        title: "Thành công",
        description: "Đã xóa người theo dõi khỏi danh sách",
      })
      fetchFollowers() // Refresh the list
    } catch (error) {
      console.error('Error removing follower:', error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa người theo dõi",
        variant: "destructive"
      })
    } finally {
      setFollowerToRemove(null)
    }
  }

  // Filtered followers based on search query
  const filteredFollowers = followers.filter(follower => {
    if (!searchQuery) return true
    
    const followerName = follower.follower?.fullname || ''
    const followerEmail = follower.follower?.email || ''
    
    return (
      followerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      followerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Người theo dõi</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách người theo dõi bài viết của bạn
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm người theo dõi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon" aria-label="Filter">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select
            value={timeFilter}
            onValueChange={(value) => {
              setTimeFilter(value)
              setPage(1) // Reset page when filter changes
            }}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Lọc theo thời gian" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TIME_FILTERS).map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy || "default"}
            onValueChange={(value) => setSortBy(value === "default" ? null : value as "newest" | "oldest")}
          >
            <SelectTrigger className="w-[180px]">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Mặc định</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Followers List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-9 rounded" />
              </CardFooter>
            </Card>
          ))
        ) : filteredFollowers.length > 0 ? (
          filteredFollowers.map((follower) => (
            <Card key={follower.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <ImageWithFallback
                      src={follower.follower?.avatar || ''}
                      fallbackSrc="/abstract-user-icon.png"
                      alt={follower.follower?.fullname || 'User'}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-base">{follower.follower?.fullname || 'Người dùng không xác định'}</CardTitle>
                    <p className="text-sm text-muted-foreground">{follower.follower?.email || ''}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">
                  <span className="text-muted-foreground">Theo dõi từ: </span>
                  {new Date(follower.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  })}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Link 
                  href={`/profile/${follower.follower?.email?.split('@')[0]}`}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <User className="h-3.5 w-3.5" />
                  Xem hồ sơ
                </Link>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setFollowerToRemove(follower.followerId)}
                >
                  <UserX className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg">
            <User className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="font-medium">Không tìm thấy người theo dõi nào</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery
                ? "Không tìm thấy người theo dõi nào phù hợp với tìm kiếm của bạn"
                : "Bạn chưa có người theo dõi nào"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {(page - 1) * perPage + 1} - {Math.min(page * perPage, followers.length)} trong số {followers.length} người theo dõi
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNumber: number

              // Strategy for showing page numbers when there are many pages
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else {
                if (page <= 3) {
                  // At the beginning of pagination
                  if (i < 4) {
                    pageNumber = i + 1
                  } else {
                    pageNumber = totalPages
                  }
                } else if (page >= totalPages - 2) {
                  // At the end of pagination
                  if (i === 0) {
                    pageNumber = 1
                  } else {
                    pageNumber = totalPages - 4 + i
                  }
                } else {
                  // In the middle
                  if (i === 0) {
                    pageNumber = 1
                  } else if (i === 4) {
                    pageNumber = totalPages
                  } else {
                    pageNumber = page - 1 + i
                  }
                }
              }

              return (
                <Button
                  key={i}
                  variant={page === pageNumber ? "default" : "outline"}
                  className="h-8 w-8"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Remove Follower Confirmation Dialog */}
      <AlertDialog open={!!followerToRemove} onOpenChange={() => setFollowerToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người này khỏi danh sách người theo dõi? Họ sẽ không còn theo dõi bạn nữa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => followerToRemove && handleRemoveFollower(followerToRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
