"use client"

import { useEffect, useState } from "react"
import { UserPlus, UserCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { 
  handleFollowJournalist, 
  handleUnfollowJournalist, 
  handleCheckFollowing 
} from "@/src/thunks/follow/followThunk"
import { 
  selectFollowStatus, 
  selectIsFollowing, 
  selectIsUnfollowing, 
  selectFollowError, 
  selectUnfollowError 
} from "@/src/thunks/follow/followSlice"
import { selectIsLoggedIn, selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { useRouter } from "next/navigation"

interface FollowButtonProps {
  journalistId: number
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function FollowButton({
  journalistId,
  variant = "default",
  size = "default",
  className = ""
}: FollowButtonProps) {
  // Redux state
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsLoggedIn)
  const currentUser = useAppSelector(selectCurrentUser)
  const isFollowing = useAppSelector((state) => selectFollowStatus(state, journalistId))
  const isLoadingFollow = useAppSelector(selectIsFollowing)
  const isLoadingUnfollow = useAppSelector(selectIsUnfollowing)
  const followError = useAppSelector(selectFollowError)
  const unfollowError = useAppSelector(selectUnfollowError)

  // Local state
  const [hasCheckedFollowStatus, setHasCheckedFollowStatus] = useState(false)
  
  // Router for redirect to login
  const router = useRouter()
  
  // Toast for error and success messages
  const { toast } = useToast()
  
  // Check if current user is following the journalist on mount
  useEffect(() => {
    if (isAuthenticated && currentUser?.id && journalistId && !hasCheckedFollowStatus) {
      dispatch(handleCheckFollowing(journalistId))
      setHasCheckedFollowStatus(true)
    }
  }, [dispatch, isAuthenticated, currentUser?.id, journalistId, hasCheckedFollowStatus])
  
  // Show errors in toast
  useEffect(() => {
    if (followError) {
      toast({
        title: "Lỗi khi theo dõi",
        description: followError,
        variant: "destructive"
      })
    }
    
    if (unfollowError) {
      toast({
        title: "Lỗi khi hủy theo dõi",
        description: unfollowError,
        variant: "destructive"
      })
    }
  }, [followError, unfollowError, toast])
  
  // Handle follow/unfollow action
  const handleFollowAction = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để theo dõi tác giả này",
        variant: "default"
      })
      router.push('/auth/login')
      return
    }
    
    // Don't let users follow themselves
    if (currentUser?.id === journalistId) {
      toast({
        title: "Không thể thực hiện",
        description: "Bạn không thể tự theo dõi chính mình",
        variant: "default"
      })
      return
    }
    
    try {
      if (isFollowing) {
        await dispatch(handleUnfollowJournalist(journalistId)).unwrap()
        toast({
          title: "Đã hủy theo dõi",
          description: "Bạn sẽ không nhận được thông báo từ tác giả này nữa",
          variant: "default"
        })
      } else {
        await dispatch(handleFollowJournalist(journalistId)).unwrap()
        toast({
          title: "Đã theo dõi",
          description: "Bạn sẽ nhận được thông báo khi tác giả này đăng bài viết mới",
          variant: "default"
        })
      }
    } catch (error) {
      console.error("Error toggling follow status:", error)
    }
  }
  
  // Don't show follow button for own profile
  if (currentUser?.id === journalistId) {
    return null
  }
  
  const isLoading = isLoadingFollow || isLoadingUnfollow
  
  return (
    <Button
      variant={isFollowing ? "outline" : variant}
      size={size}
      className={`gap-2 ${isFollowing ? "text-blue-600 border-blue-200 hover:bg-blue-50" : ""} ${className}`}
      onClick={handleFollowAction}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{isFollowing ? "Đang hủy theo dõi" : "Đang theo dõi"}</span>
        </>
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          <span>Đang theo dõi</span>
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          <span>Theo dõi</span>
        </>
      )}
    </Button>
  )
} 