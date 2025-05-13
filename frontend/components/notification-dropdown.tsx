"use client"

import { useEffect, useState } from "react"
import { Bell, MessageSquare, UserPlus, Heart, FileEdit, Trash2, Check } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { 
  handleGetNotifications, 
  handleMarkAsRead, 
  handleMarkAllAsRead,
  handleGetUnreadCount,
  handleDeleteNotification
} from "@/src/thunks/notification/notificationThunk"
import {
  selectNotifications,
  selectUnreadCount,
  selectNotificationLoading,
  selectDeletingNotification,
  selectMarkingAsRead,
  selectMarkingAllAsRead
} from "@/src/thunks/notification/notificationSlice"
import { initializeSocket, disconnectSocket } from "@/src/apis/socket"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Notification } from "@/src/apis/notification"

export function NotificationDropdown() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  
  const notifications = useAppSelector(selectNotifications)
  const unreadCount = useAppSelector(selectUnreadCount)
  const loading = useAppSelector(selectNotificationLoading)
  const deleting = useAppSelector(selectDeletingNotification)
  const markingAsRead = useAppSelector(selectMarkingAsRead)
  const markingAllAsRead = useAppSelector(selectMarkingAllAsRead)

  // Initialize socket connection and handle notifications
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    console.log("[NOTIFICATION] Initializing socket connection");
    const socket = initializeSocket(token)

    // Listen for new notifications
    socket.on("connect", () => {
      console.log("[NOTIFICATION] Socket connected successfully");
      
      socket.on("notification", (notification) => {
        console.log("[NOTIFICATION] Received notification via socket:", notification);
        // Reload notifications when a new one arrives
        dispatch(handleGetNotifications())
        dispatch(handleGetUnreadCount())
      })
    })

    return () => {
      console.log("[NOTIFICATION] Disconnecting socket");
      disconnectSocket()
    }
  }, [dispatch])

  // Initial load of notifications and unread count
  useEffect(() => {
    console.log("[NOTIFICATION] Initial load of notifications");
    dispatch(handleGetNotifications())
    dispatch(handleGetUnreadCount())
    
    // Set up polling for new notifications every 10 seconds (reduced from 30 seconds)
    const intervalId = setInterval(() => {
      console.log("[NOTIFICATION] Polling for new notifications");
      dispatch(handleGetNotifications())
      dispatch(handleGetUnreadCount())
    }, 10000) // Changed from 30000 to 10000
    
    return () => clearInterval(intervalId)
  }, [dispatch])

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (open) {
      dispatch(handleGetNotifications())
      dispatch(handleGetUnreadCount())
    }
  }, [open, dispatch])

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      dispatch(handleMarkAsRead(notification.id))
    }
    
    // Navigate based on notification type
    if (notification.article_id) {
      router.push(`/article/${notification.article_id}`)
      setOpen(false)
    }
  }
  
  const handleMarkRead = (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation()
    if (!notification.is_read) {
      dispatch(handleMarkAsRead(notification.id))
        .unwrap()
        .then(() => {
          toast({
            title: "Đã đánh dấu đã đọc",
            description: "Thông báo đã được đánh dấu là đã đọc",
            variant: "default",
          })
        })
        .catch((error) => {
          toast({
            title: "Lỗi",
            description: "Không thể đánh dấu thông báo. Vui lòng thử lại sau.",
            variant: "destructive",
          })
        })
    }
  }
  
  const handleDeleteNotif = (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation()
    dispatch(handleDeleteNotification(notification.id))
      .unwrap()
      .then(() => {
        toast({
          title: "Đã xóa thông báo",
          description: "Thông báo đã được xóa thành công",
          variant: "default",
        })
      })
      .catch((error) => {
        toast({
          title: "Lỗi",
          description: "Không thể xóa thông báo. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      })
  }
  
  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(handleMarkAllAsRead())
      .unwrap()
      .then(() => {
        toast({
          title: "Đã đánh dấu tất cả đã đọc",
          description: "Tất cả thông báo đã được đánh dấu là đã đọc",
          variant: "default",
        })
      })
      .catch((error) => {
        toast({
          title: "Lỗi",
          description: "Không thể đánh dấu tất cả thông báo. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      })
  }
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COMMENT":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "LIKE":
        return <Heart className="h-5 w-5 text-red-500" />
      case "FOLLOW":
        return <UserPlus className="h-5 w-5 text-green-500" />
      case "ARTICLE_STATUS":
        return <FileEdit className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo {unreadCount > 0 && `(${unreadCount} chưa đọc)`}</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markingAllAsRead}
              className="h-auto text-xs px-2"
            >
              {markingAllAsRead ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-80">
          <DropdownMenuGroup>
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Đang tải...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Không có thông báo
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-3 cursor-pointer flex flex-col items-start ${
                    !notification.is_read ? "bg-muted/50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2 w-full">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none mb-1">
                        {notification.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: vi
                        })}
                      </p>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                      {!notification.is_read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => handleMarkRead(e, notification)}
                          title="Đánh dấu đã đọc"
                          disabled={markingAsRead}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => handleDeleteNotif(e, notification)}
                        title="Xóa thông báo"
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
