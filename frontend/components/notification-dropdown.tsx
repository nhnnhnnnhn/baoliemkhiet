"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationDropdown() {
  const [unreadCount, setUnreadCount] = useState(3)

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Bài viết mới cần duyệt",
      message: "Nguyễn Văn A đã gửi một bài viết mới cần được duyệt",
      time: "5 phút trước",
      read: false,
      avatar: "/placeholder.svg?height=32&width=32",
      avatarFallback: "NA",
    },
    {
      id: 2,
      title: "Bình luận mới",
      message: "Có 5 bình luận mới cần được duyệt",
      time: "30 phút trước",
      read: false,
      avatar: "/placeholder.svg?height=32&width=32",
      avatarFallback: "CM",
    },
    {
      id: 3,
      title: "Người dùng mới đăng ký",
      message: "Trần Thị B vừa đăng ký tài khoản mới",
      time: "1 giờ trước",
      read: false,
      avatar: "/placeholder.svg?height=32&width=32",
      avatarFallback: "TB",
    },
    {
      id: 4,
      title: "Cập nhật hệ thống",
      message: "Hệ thống vừa được cập nhật lên phiên bản mới",
      time: "1 ngày trước",
      read: true,
      avatar: "/placeholder.svg?height=32&width=32",
      avatarFallback: "SY",
    },
  ]

  // Mark all notifications as read
  const markAllAsRead = () => {
    setUnreadCount(0)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto text-xs px-2">
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className={notification.read ? "" : "bg-muted/50"}>
              <div className="flex items-start gap-2 py-1">
                <Avatar className="h-8 w-8">
                  {notification.avatar ? <AvatarImage src={notification.avatar || "/placeholder.svg"} alt="" /> : null}
                  <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-muted-foreground">{notification.message}</div>
                  <div className="text-xs text-muted-foreground">{notification.time}</div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <Button variant="ghost" size="sm" className="w-full">
            Xem tất cả thông báo
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
