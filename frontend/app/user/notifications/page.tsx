"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, MessageSquare, UserPlus, Heart, FileEdit, Trash2, Check, RefreshCw } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow, format } from "date-fns"
import { vi } from "date-fns/locale"
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
import { Notification } from "@/src/apis/notification"
import { ChatbotButton } from "@/components/chatbot-button"

export default function NotificationsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  
  const notifications = useAppSelector(selectNotifications)
  const unreadCount = useAppSelector(selectUnreadCount)
  const loading = useAppSelector(selectNotificationLoading)
  const deleting = useAppSelector(selectDeletingNotification)
  const markingAsRead = useAppSelector(selectMarkingAsRead)
  const markingAllAsRead = useAppSelector(selectMarkingAllAsRead)
  
  // Initial load of notifications
  useEffect(() => {
    dispatch(handleGetNotifications())
    dispatch(handleGetUnreadCount())
  }, [dispatch])
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      dispatch(handleMarkAsRead(notification.id))
    }
    
    // Navigate based on notification type
    if (notification.article_id) {
      router.push(`/article/${notification.article_id}`)
    }
  }
  
  // Handle mark notification as read
  const handleMarkRead = (notification: Notification) => {
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
  
  // Handle delete notification
  const handleDeleteNotif = (notification: Notification) => {
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
  
  // Handle mark all as read
  const handleMarkAllRead = () => {
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
  
  // Handle refresh notifications
  const handleRefresh = () => {
    dispatch(handleGetNotifications())
    dispatch(handleGetUnreadCount())
    toast({
      title: "Đã làm mới",
      description: "Danh sách thông báo đã được cập nhật",
      variant: "default",
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
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi })
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thông báo</h1>
            <p className="text-muted-foreground mt-1">
              Xem và quản lý tất cả thông báo của bạn
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={handleMarkAllRead}
                disabled={markingAllAsRead || notifications.length === 0}
              >
                <Check className="mr-2 h-4 w-4" />
                {markingAllAsRead ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
              </Button>
            )}
            
            <Button variant="ghost" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="ml-2 sr-only md:not-sr-only">Làm mới</span>
            </Button>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tất cả thông báo</span>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} chưa đọc</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Quản lý và xem các thông báo từ hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <RefreshCw className="animate-spin h-6 w-6 mr-2" />
                <span>Đang tải thông báo...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">Không có thông báo</h3>
                <p className="text-muted-foreground mt-1">
                  Bạn chưa có thông báo nào trong hệ thống
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Loại</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead className="w-40">Thời gian</TableHead>
                    <TableHead className="w-32">Trạng thái</TableHead>
                    <TableHead className="w-32 text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow 
                      key={notification.id} 
                      className={`cursor-pointer ${!notification.is_read ? 'bg-muted/30' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <TableCell>
                        {getNotificationIcon(notification.type)}
                      </TableCell>
                      <TableCell>
                        <span className={!notification.is_read ? 'font-medium' : ''}>
                          {notification.content}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(notification.created_at)}
                          </span>
                          <span className="text-xs">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: vi
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.is_read ? (
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            Đã đọc
                          </Badge>
                        ) : (
                          <Badge>Chưa đọc</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkRead(notification);
                              }}
                              disabled={markingAsRead}
                              title="Đánh dấu đã đọc"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotif(notification);
                            }}
                            disabled={deleting}
                            title="Xóa thông báo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
      <ChatbotButton />
    </div>
  )
}
