"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Check, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "COMMENT",
    content: "Nguyễn Văn A đã bình luận về bài viết của bạn",
    articleId: 123,
    articleTitle: "Việt Nam đạt thỏa thuận hợp tác kinh tế mới với các nước ASEAN",
    isRead: false,
    createdAt: "2025-04-15T08:30:00Z",
  },
  {
    id: 2,
    type: "LIKE",
    content: "Trần Thị B đã thích bài viết của bạn",
    articleId: 123,
    articleTitle: "Việt Nam đạt thỏa thuận hợp tác kinh tế mới với các nước ASEAN",
    isRead: false,
    createdAt: "2025-04-15T07:45:00Z",
  },
  {
    id: 3,
    type: "FOLLOW",
    content: "Lê Văn C đã bắt đầu theo dõi bạn",
    isRead: true,
    createdAt: "2025-04-14T14:20:00Z",
  },
  {
    id: 4,
    type: "ARTICLE_STATUS",
    content: "Bài viết của bạn đã được phê duyệt",
    articleId: 124,
    articleTitle: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
    isRead: true,
    createdAt: "2025-04-14T10:15:00Z",
  },
  {
    id: 5,
    type: "MESSAGE",
    content: "Bạn có tin nhắn mới từ ban biên tập",
    isRead: true,
    createdAt: "2025-04-13T16:30:00Z",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "vừa xong"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} phút trước`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} giờ trước`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ngày trước`
    }
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  // Mark a single notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // Delete a notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.isRead
    return notification.type === activeTab
  })

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Thông báo {unreadCount > 0 && `(${unreadCount})`}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2" />
              Đánh dấu tất cả đã đọc
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
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${notification.isRead ? "bg-white" : "bg-blue-50 border-blue-100"}`}
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
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{notification.content}</p>
                        {notification.articleId && (
                          <Link
                            href={`/article/${notification.articleId}`}
                            className="text-sm text-blue-600 hover:underline mt-1 block"
                          >
                            {notification.articleTitle}
                          </Link>
                        )}
                        <span className="text-xs text-gray-500 mt-1 block">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                        onClick={() => deleteNotification(notification.id)}
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
