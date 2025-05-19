"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/hooks/use-logout"
import {
  Home,
  Users,
  FileText,
  Settings,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Mail,
  AlertTriangle,
  MessageSquare,
  Tag,
} from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import { usePathname } from "next/navigation"

import { NotificationDropdown } from "@/components/notification-dropdown"
import { ImageWithFallback } from "@/components/image-with-fallback"
import styles from "./admin.module.css"
// Thêm import cho ThemeToggle
import { ThemeToggle } from "@/components/theme-toggle"

// Client component for the sidebar navigation with active state detection
function SidebarNavigation() {
  const pathname = usePathname()

  // Function to check if a path is active (exact match or starts with for nested routes)
  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true
    }
    return pathname !== "/admin" && pathname.startsWith(path)
  }

  return (
    <div className={styles.sidebarNav}>
      <div className={styles.navSection}>
        <div className={styles.navSectionTitle}>Tổng quan</div>
        <div className={styles.navLinks}>
          <Link
            href="/admin"
            className={`${styles.navLink} ${isActive("/admin") && pathname === "/admin" ? styles.navLinkActive : ""}`}
          >
            <Home className={styles.navIcon} />
            Trang chủ
          </Link>
        </div>
      </div>
      <div className={styles.navSection}>
        <div className={styles.navSectionTitle}>Quản lý</div>
        <div className={styles.navLinks}>
          <Link
            href="/admin/articles"
            className={`${styles.navLink} ${isActive("/admin/articles") ? styles.navLinkActive : ""}`}
          >
            <FileText className={styles.navIcon} />
            Bài viết
          </Link>
          <Link
            href="/admin/users"
            className={`${styles.navLink} ${isActive("/admin/users") ? styles.navLinkActive : ""}`}
          >
            <Users className={styles.navIcon} />
            Người dùng
          </Link>
          <Link
            href="/admin/comments"
            className={`${styles.navLink} ${isActive("/admin/comments") ? styles.navLinkActive : ""}`}
          >
            <MessageSquare className={styles.navIcon} />
            Bình luận
          </Link>
          <Link
            href="/admin/categories"
            className={`${styles.navLink} ${isActive("/admin/categories") ? styles.navLinkActive : ""}`}
          >
            <FileText className={styles.navIcon} />
            Danh mục
          </Link>
          <Link
            href="/admin/tags"
            className={`${styles.navLink} ${isActive("/admin/tags") ? styles.navLinkActive : ""}`}
          >
            <Tag className={styles.navIcon} />
            Thẻ
          </Link>
          <Link
            href="/admin/reports"
            className={`${styles.navLink} ${isActive("/admin/reports") ? styles.navLinkActive : ""}`}
          >
            <AlertTriangle className={styles.navIcon} />
            Báo cáo
          </Link>
        </div>
      </div>
      <div className={styles.navSection}>
        <div className={styles.navSectionTitle}>Cài đặt</div>
        <div className={styles.navLinks}>
          <Link
            href="/admin/profile"
            className={`${styles.navLink} ${isActive("/admin/profile") ? styles.navLinkActive : ""}`}
          >
            <User className={styles.navIcon} />
            Hồ sơ
          </Link>
        </div>
      </div>
    </div>
  )
}

// Client component for the header breadcrumb
function HeaderBreadcrumb() {
  const pathname = usePathname()

  // Get the current section name based on the pathname
  const getCurrentSection = () => {
    if (pathname === "/admin") return "Trang chủ"
    if (pathname.startsWith("/admin/statistics")) return "Thống kê"
    if (pathname.startsWith("/admin/articles")) return "Bài viết"
    if (pathname.startsWith("/admin/users")) return "Người dùng"
    if (pathname.startsWith("/admin/comments")) return "Bình luận"
    if (pathname.startsWith("/admin/categories")) return "Danh mục"
    if (pathname.startsWith("/admin/tags")) return "Thẻ"
    if (pathname.startsWith("/admin/reports")) return "Báo cáo"
    if (pathname.startsWith("/admin/profile")) return "Hồ sơ"
    if (pathname.startsWith("/admin/settings")) return "Cài đặt"
    return "Trang chủ"
  }

  return (
    <div className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Admin</span> / {getCurrentSection()}
    </div>
  )
}

// Server component for the layout
export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const logout = useLogout()
  // Define fallback image sources
  const avatarFallbackSrc = "/abstract-user-icon.png"
  const smallAvatarFallbackSrc = "/abstract-user-icon.png"

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <Link href="/admin" className={styles.logo}>
              <Image src="/logo.svg" alt="Báo Liêm Khiết Logo" width={120} height={40} priority />
            </Link>
          </div>

          {/* Client component for navigation with active state */}
          <Suspense fallback={<div className="p-4">Loading navigation...</div>}>
            <SidebarNavigation />
          </Suspense>

          <div className={styles.sidebarFooter}>
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                <ImageWithFallback
                  src="/secure-admin-panel.png"
                  fallbackSrc={avatarFallbackSrc}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className={styles.userAvatarImg}
                />
                <div className={styles.userStatus}></div>
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>Admin User</div>
                <div className={styles.userRole}>Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <Home size={20} />
                </Button>
              </Link>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.headerAction}>
              <NotificationDropdown />
              <ThemeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 flex items-center gap-2 p-2">
                  <ImageWithFallback
                    src="/secure-admin-panel.png"
                    fallbackSrc={smallAvatarFallbackSrc}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-medium">Admin User</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/messages" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Tin nhắn</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className={styles.pageContent}>
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}
