"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import notificationApi from "@/src/apis/notification"
import { initializeSocket, disconnectSocket } from "@/src/apis/socket"

interface Notification {
  id: number
  content: string
  article_id?: number
  is_read: boolean
  created_at: string
  read_at?: string
  type: "MESSAGE" | "COMMENT" | "LIKE" | "FOLLOW" | "ARTICLE_STATUS"
}

interface NotificationPayload {
  receiver_id: number
  content: string
  type: "MESSAGE" | "COMMENT" | "LIKE" | "FOLLOW" | "ARTICLE_STATUS"
  article_id?: number
}

export function NotificationDropdown() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await notificationApi.getNotifications()
      if (response?.data) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount()
      if (response?.count?.data !== undefined) {
        setUnreadCount(response.count.data)
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
      setUnreadCount(0)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationApi.markAsRead(notificationId)
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await notificationApi.markAllAsRead()
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  // Initialize socket connection and handle notifications
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    console.log("Token:", token)

    if (!token) return

    const socket = initializeSocket(token)

    // Listen for new notifications
    socket.on("connect", () => {
      socket.on("notification", (notification) => {
        notification.created_at = new Date().toISOString()
        notification.is_read = false
        console.log("New notification:", notification)
        setNotifications((prev) => [notification, ...prev])
        setUnreadCount((prev) => prev + 1)
      })
    })

    return () => {
      disconnectSocket()
    }
  }, [])

  // Initial load of notifications and unread count
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchUnreadCount(), fetchNotifications()])
    }
    loadInitialData()
  }, [])

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (open) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [open])

  // Format the created_at date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Không có dữ liệu"

      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Không có dữ liệu"

      const formatter = new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh",
      })

      return formatter.format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Không có dữ liệu"
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-600 text-xs font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={5} collisionPadding={10} forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                markAllAsRead()
              }}
              className="h-auto text-xs px-2"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto py-1">
          {loading ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">Đang tải thông báo...</div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`${notification.is_read ? "" : "bg-muted/50"} py-2`}
                onClick={(e) => {
                  e.preventDefault()
                  if (!notification.is_read) {
                    markAsRead(notification.id)
                  }
                  // Add navigation logic here if needed
                  // For example: router.push(`/article/${notification.article_id}`);
                }}
              >
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="" />
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="text-sm">{notification.content}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">Không có thông báo mới</div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
