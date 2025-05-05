"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

import { cn } from "@/lib/utils"
import { ImageWithFallback } from "./image-with-fallback"
import styles from "@/app/admin/admin.module.css"

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "comment",
      message: "Nguyễn Văn A đã bình luận về bài viết của bạn",
      time: "5 phút trước",
      read: false,
      userAvatar: "/diverse-avatars.png",
    },
    {
      id: 2,
      type: "article",
      message: "Bài viết của bạn đã được phê duyệt",
      time: "1 giờ trước",
      read: false,
      userAvatar: null,
    },
    {
      id: 3,
      type: "system",
      message: "Hệ thống đã được cập nhật lên phiên bản mới",
      time: "1 ngày trước",
      read: true,
      userAvatar: null,
    },
  ]

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Đảm bảo fallbackSrc không rỗng
  const avatarFallbackSrc = "/abstract-user-icon.png"

  return (
    <div className="relative">
      <button
        className={styles.notificationButton}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className={styles.notificationBadge}>{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className={styles.notificationDropdown}>
          <div className={styles.notificationHeader}>
            <h3 className={styles.notificationTitle}>Thông báo</h3>
            {unreadCount > 0 && <span className={styles.notificationCount}>{unreadCount} mới</span>}
          </div>
          <div className={styles.notificationList}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(styles.notificationItem, {
                  [styles.notificationItemUnread]: !notification.read,
                })}
              >
                <div className={styles.notificationAvatar}>
                  {notification.userAvatar ? (
                    <ImageWithFallback
                      src={notification.userAvatar || "/placeholder.svg"}
                      fallbackSrc={avatarFallbackSrc}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className={styles.notificationAvatarImg}
                    />
                  ) : (
                    <div className={styles.notificationIconContainer}>
                      <Bell size={16} />
                    </div>
                  )}
                </div>
                <div className={styles.notificationContent}>
                  <div className={styles.notificationMessage}>{notification.message}</div>
                  <div className={styles.notificationTime}>{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.notificationFooter}>
            <button className={styles.notificationAction}>Xem tất cả</button>
            <button className={styles.notificationAction}>Đánh dấu đã đọc</button>
          </div>
        </div>
      )}
    </div>
  )
}
