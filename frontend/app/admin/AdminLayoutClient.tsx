"use client"

import type React from "react"
import Link from "next/link"
import { Home, Users, FileText, BarChart2, Settings, Menu, Search, ChevronDown, LogOut, User, Mail } from "lucide-react"
import { useLogout } from "@/hooks/use-logout"
import Image from "next/image"
import { Suspense, useState } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { NotificationDropdown } from "@/components/notification-dropdown"
import { ImageWithFallback } from "@/components/image-with-fallback"
import styles from "./admin.module.css"

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
          <Link
            href="/admin/statistics"
            className={`${styles.navLink} ${isActive("/admin/statistics") ? styles.navLinkActive : ""}`}
          >
            <BarChart2 className={styles.navIcon} />
            Thống kê
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
          <Link
            href="/admin/settings"
            className={`${styles.navLink} ${isActive("/admin/settings") ? styles.navLinkActive : ""}`}
          >
            <Settings className={styles.navIcon} />
            Cài đặt
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
              <div className={styles.userAction}>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuButton}>
              <Menu size={20} />
            </button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <Home className="h-5 w-5" />
                <span className="sr-only">Về trang chủ</span>
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input type="text" placeholder="Tìm kiếm..." className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.headerAction}>
              <NotificationDropdown />
            </div>
            <div className={styles.userDropdown}>
              <button
                className={styles.userDropdownTrigger}
                onClick={(e) => {
                  e.stopPropagation();
                  const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                  if (dropdown) {
                    const isOpen = dropdown.style.display === 'block';
                    dropdown.style.display = isOpen ? 'none' : 'block';
                    
                    // Click outside to close
                    const closeDropdown = (e: MouseEvent) => {
                      if (!dropdown.contains(e.target as Node)) {
                        dropdown.style.display = 'none';
                        document.removeEventListener('click', closeDropdown);
                      }
                    };
                    if (!isOpen) {
                      document.addEventListener('click', closeDropdown);
                    }
                  }
                }}
              >
                <ImageWithFallback
                  src="/secure-admin-panel.png"
                  fallbackSrc={smallAvatarFallbackSrc}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className={styles.userDropdownAvatar}
                />
                <span className={styles.userDropdownName}>Admin User</span>
                <ChevronDown size={16} />
              </button>
              <div className={styles.userDropdownMenu} style={{ display: 'none' }}>
                <Link href="/admin/profile" className={styles.userDropdownItem}>
                  <User size={16} className="mr-2" />
                  Hồ sơ
                </Link>
                <div className={styles.userDropdownItem}>
                  <Mail size={16} className="mr-2" />
                  Tin nhắn
                </div>
                <div className={styles.userDropdownDivider}></div>
                <button
                  onClick={logout}
                  className={styles.userDropdownItem}
                >
                  <LogOut size={16} className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.pageContent}>
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}
