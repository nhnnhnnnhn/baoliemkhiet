"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  Edit,
  ChevronDown,
  Bell,
  Users,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/src/store"
import { handleLogout } from "@/src/thunks/auth/authThunk"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"

import { NotificationDropdown } from "@/components/notification-dropdown"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ImageWithFallback } from "@/components/image-with-fallback"

import styles from "./author.module.css"

// Client component for the sidebar navigation with active state detection
function AuthorSidebarNavigation() {
  const pathname = usePathname()

  // Function to check if a path is active (exact match or starts with for nested routes)
  const isActive = (path: string) => {
    if (path === "/author" && pathname === "/author") {
      return true
    }
    return pathname !== "/author" && pathname.startsWith(path)
  }

  return (
    <div className={styles.sidebarNav}>
      <div className={styles.navSection}>
        <div className={styles.navSectionTitle}>Tổng quan</div>
        <div className={styles.navLinks}>
          <Link
            href="/author"
            className={`${styles.navLink} ${isActive("/author") && pathname === "/author" ? styles.navLinkActive : ""}`}
          >
            <Home className={styles.navIcon} />
            Trang chủ
          </Link>
        </div>
      </div>
      <div className={styles.navSection}>
        <div className={styles.navSectionTitle}>Quản lý bài viết</div>
        <div className={styles.navLinks}>
          <Link
            href="/author/articles"
            className={`${styles.navLink} ${isActive("/author/articles") && pathname !== "/author/articles/add" ? styles.navLinkActive : ""}`}
          >
            <FileText className={styles.navIcon} />
            Bài viết của tôi
          </Link>
          <Link
            href="/author/articles/add"
            className={`${styles.navLink} ${isActive("/author/articles/add") ? styles.navLinkActive : ""}`}
          >
            <Edit className={styles.navIcon} />
            Viết bài mới
          </Link>
        </div>
      </div>
      <div className={styles.navSection}>
        <div className={styles.navSectionTitle}>Cộng đồng</div>
        <div className={styles.navLinks}>
          <Link
            href="/author/followers"
            className={`${styles.navLink} ${isActive("/author/followers") ? styles.navLinkActive : ""}`}
          >
            <Users className={styles.navIcon} />
            Người theo dõi
          </Link>
        </div>
      </div>
      <div className={styles.navSection}>
        <div className={styles.navSectionTitle}>Tài khoản</div>
        <div className={styles.navLinks}>
          <Link
            href="/author/profile"
            className={`${styles.navLink} ${isActive("/author/profile") ? styles.navLinkActive : ""}`}
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
function AuthorHeaderBreadcrumb() {
  const pathname = usePathname()

  // Get the current section name based on the pathname
  const getCurrentSection = () => {
    if (pathname === "/author") return "Trang chủ"
    if (pathname.startsWith("/author/articles/add")) return "Viết bài mới"
    if (pathname.startsWith("/author/articles")) return "Bài viết của tôi"
    if (pathname.startsWith("/author/comments")) return "Bình luận"
    if (pathname.startsWith("/author/followers")) return "Người theo dõi"
    if (pathname.startsWith("/author/notifications")) return "Thông báo"
    if (pathname.startsWith("/author/profile")) return "Hồ sơ"
    if (pathname.startsWith("/author/settings")) return "Cài đặt"
    return "Trang chủ"
  }

  return (
    <div className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Tác giả</span> / {getCurrentSection()}
    </div>
  )
}

export default function AuthorLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)
  // Define fallback image sources
  const avatarFallbackSrc = "/abstract-user-icon.png"

  const handleLogoutClick = () => {
    dispatch(handleLogout())
  }

  // Helper function to get full image URL
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) {
      return "/abstract-user-icon.png";
    }
    if (path.startsWith('data:image')) {
      return path;
    }
    if (path.startsWith('http')) {
      return path;
    }
    return "/abstract-user-icon.png";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/author" className="flex items-center">
            <Image src="/logo.svg" alt="Báo Liêm Khiết" width={120} height={40} priority />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <Avatar className="h-8 w-8">
            <AvatarImage src={getImageUrl(currentUser?.avatar)} alt={currentUser?.fullname || "Author"} />
            <AvatarFallback>{currentUser?.fullname?.[0] || "A"}</AvatarFallback>
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

          {/* Client component for navigation with active state */}
          <Suspense fallback={<div className="p-4">Loading navigation...</div>}>
            <AuthorSidebarNavigation />
          </Suspense>

          <div className={styles.sidebarFooter}>
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                <ImageWithFallback
                  src={getImageUrl(currentUser?.avatar)}
                  fallbackSrc={avatarFallbackSrc}
                  alt={currentUser?.fullname || "User Avatar"}
                  width={40}
                  height={40}
                  className={styles.userAvatarImg}
                />
                <div className={styles.userStatus}></div>
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{currentUser?.fullname || "Author User"}</div>
                <div className={styles.userRole}>Author</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Desktop Header */}
        <header className="hidden md:flex sticky top-0 z-10 bg-white border-b h-[72px] px-6 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Suspense fallback={<div>Loading...</div>}>
              <AuthorHeaderBreadcrumb />
            </Suspense>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 hover:bg-gray-100"
              onClick={handleLogoutClick}
            >
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
