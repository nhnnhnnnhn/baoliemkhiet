"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Check, Trash2, MessageSquare, UserPlus, Heart, FileEdit } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { 
  handleGetNotifications, 
  handleMarkAsRead, 
  handleMarkAllAsRead,
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
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useToast } from "@/hooks/use-toast"

export default function NotificationsPage() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  
  const notifications = useAppSelector(selectNotifications)
  const unreadCount = useAppSelector(selectUnreadCount)
  const loading = useAppSelector(selectNotificationLoading)
  const deleting = useAppSelector(selectDeletingNotification)
  const markingAsRead = useAppSelector(selectMarkingAsRead)
  const markingAllAsRead = useAppSelector(selectMarkingAllAsRead)

  // Load notifications on mount
  useEffect(() => {
    dispatch(handleGetNotifications())
  }, [dispatch])

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await dispatch(handleMarkAllAsRead()).unwrap()
      toast({
        title: "Đã đánh dấu tất cả đã đọc",
        description: "Tất cả thông báo đã được đánh dấu là đã đọc",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu tất cả thông báo. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  // Mark a single notification as read
  const handleMarkRead = async (notificationId: number) => {
    try {
      await dispatch(handleMarkAsRead(notificationId)).unwrap()
      toast({
        title: "Đã đánh dấu đã đọc",
        description: "Thông báo đã được đánh dấu là đã đọc",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu thông báo. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  // Delete a notification
  const handleDeleteNotif = async (notificationId: number) => {
    try {
      await dispatch(handleDeleteNotification(notificationId)).unwrap()
      toast({
        title: "Đã xóa thông báo",
        description: "Thông báo đã được xóa thành công",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa thông báo. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COMMENT":
        return <MessageSquare className="h-4 w-4" />
      case "LIKE":
        return <Heart className="h-4 w-4" />
      case "FOLLOW":
        return <UserPlus className="h-4 w-4" />
      case "ARTICLE_STATUS":
        return <FileEdit className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.is_read
    return notification.type === activeTab
  })

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Thông báo {unreadCount > 0 && `(${unreadCount})`}</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllRead} 
              disabled={unreadCount === 0 || markingAllAsRead}
            >
              <Check className="h-4 w-4 mr-2" />
              {markingAllAsRead ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="unread">Chưa đọc {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
            <TabsTrigger value="COMMENT">Bình luận</TabsTrigger>
            <TabsTrigger value="LIKE">Lượt thích</TabsTrigger>
            <TabsTrigger value="FOLLOW">Người theo dõi</TabsTrigger>
            <TabsTrigger value="ARTICLE_STATUS">Trạng thái bài viết</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 mt-2">Đang tải thông báo...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${notification.is_read ? "bg-white" : "bg-blue-50 border-blue-100"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          notification.type === "COMMENT"
                            ? "bg-blue-100 text-blue-600"
                            : notification.type === "LIKE"
                              ? "bg-red-100 text-red-600"
                              : notification.type === "FOLLOW"
                                ? "bg-green-100 text-green-600"
                                : notification.type === "ARTICLE_STATUS"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{notification.content}</p>
                        {notification.article_id && (
                          <Link
                            href={`/article/${notification.article_id}`}
                            className="text-sm text-blue-600 hover:underline mt-1 block"
                          >
                            {notification.article_title}
                          </Link>
                        )}
                        <span className="text-xs text-gray-500 mt-1 block">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: vi
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleMarkRead(notification.id)}
                          disabled={markingAsRead}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                        onClick={() => handleDeleteNotif(notification.id)}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Không có thông báo nào</h3>
                <p className="text-gray-500 mt-1">Bạn sẽ nhận được thông báo khi có hoạt động mới</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <SiteFooter />
    </>
  )
}
