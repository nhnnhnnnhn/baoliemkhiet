import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { FileText, Home, LogOut, Menu, MessageSquare, Settings, User, Edit, ChevronDown } from "lucide-react"

import { NotificationDropdown } from "@/components/notification-dropdown"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import styles from "./author.module.css"

export default function AuthorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/author" className="flex items-center">
            <Image src="/logo.svg" alt="Báo Liêm Khiết" width={120} height={40} priority />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Author" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <Link href="/author" className={styles.logo}>
              <Image src="/logo.svg" alt="Báo Liêm Khiết Logo" width={120} height={40} priority />
            </Link>
          </div>
          <div className={styles.sidebarNav}>
            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>Tổng quan</div>
              <div className={styles.navLinks}>
                <Link href="/author" className={`${styles.navLink} ${styles.navLinkActive}`}>
                  <Home className={styles.navIcon} />
                  Trang chủ
                </Link>
              </div>
            </div>
            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>Quản lý bài viết</div>
              <div className={styles.navLinks}>
                <Link href="/author/articles" className={styles.navLink}>
                  <FileText className={styles.navIcon} />
                  Bài viết của tôi
                </Link>
                <Link href="/author/articles/add" className={styles.navLink}>
                  <Edit className={styles.navIcon} />
                  Viết bài mới
                </Link>
              </div>
            </div>
            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>Cài đặt</div>
              <div className={styles.navLinks}>
                <Link href="/author/profile" className={styles.navLink}>
                  <User className={styles.navIcon} />
                  Hồ sơ
                </Link>
                <Link href="/author/settings" className={styles.navLink}>
                  <Settings className={styles.navIcon} />
                  Cài đặt
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.sidebarFooter}>
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className={styles.userAvatarImg}
                />
                <div className={styles.userStatus}></div>
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>Author User</div>
                <div className={styles.userRole}>Author</div>
              </div>
              <div className={styles.userAction}>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Desktop Header */}
        <header className="hidden md:flex sticky top-0 z-10 bg-white border-b p-4 items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Home className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Tác giả</span> / Trang chủ
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
