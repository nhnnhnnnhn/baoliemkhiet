import type { Metadata } from "next"
import { Bell, Heart, MessageSquare, UserPlus, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Thông báo | Báo Liêm Khiết",
  description: "Xem tất cả thông báo của bạn",
}

interface NotificationProps {
  id: number
  type: "MESSAGE" | "COMMENT" | "LIKE" | "FOLLOW" | "ARTICLE_STATUS"
  content: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  // Dữ liệu mẫu
  const notifications: NotificationProps[] = [
    {
      id: 1,
      type: "COMMENT",
      content: "Nguyễn Văn A đã bình luận về bài viết của bạn",
      isRead: false,
      createdAt: "2023-05-15T08:30:00Z",
    },
    {
      id: 2,
      type: "LIKE",
      content: "Trần Thị B đã thích bài viết của bạn",
      isRead: true,
      createdAt: "2023-05-14T15:45:00Z",
    },
    {
      id: 3,
      type: "FOLLOW",
      content: "Lê Văn C đã theo dõi bạn",
      isRead: false,
      createdAt: "2023-05-13T10:20:00Z",
    },
    {
      id: 4,
      type: "ARTICLE_STATUS",
      content: "Bài viết của bạn đã được phê duyệt",
      isRead: true,
      createdAt: "2023-05-12T09:15:00Z",
    },
    {
      id: 5,
      type: "MESSAGE",
      content: "Bạn có tin nhắn mới từ quản trị viên",
      isRead: false,
      createdAt: "2023-05-11T14:30:00Z",
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COMMENT":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "LIKE":
        return <Heart className="h-5 w-5 text-red-500" />
      case "FOLLOW":
        return <UserPlus className="h-5 w-5 text-green-500" />
      case "ARTICLE_STATUS":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "MESSAGE":
        return <Bell className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Thông báo</h2>
        <button className="text-sm text-blue-600 hover:underline">Đánh dấu tất cả là đã đọc</button>
      </div>

      <div className="rounded-md border">
        {notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-start p-4 ${!notification.isRead ? "bg-blue-50" : ""}`}>
                <div className="mr-4 mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
                </div>
                {!notification.isRead && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">Không có thông báo</h3>
            <p className="mt-1 text-sm text-gray-500">Bạn sẽ nhận được thông báo khi có hoạt động mới.</p>
          </div>
        )}
      </div>
    </div>
  )
}
