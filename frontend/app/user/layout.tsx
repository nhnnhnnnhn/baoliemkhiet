"use client"

import type React from "react"

import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  ChevronDown,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  BookMarked,
  MessageSquare,
  AlertTriangle,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import styles from "../admin/admin.module.css"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/user" && pathname === "/user") {
      return true
    }
    if (path !== "/user" && pathname.startsWith(path)) {
      return true
    }
    return false
  }

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => (
    <Link href={href} className={`${styles.navLink} ${isActive(href) ? styles.navLinkActive : ""}`}>
      <Icon className={styles.navIcon} />
      <span>{children}</span>
    </Link>
  )

  const SidebarContent = () => (
    <div className={styles.sidebarContent}>
      <div className={styles.sidebarHeader}>
        <Link href="/user" className={styles.logo}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoIcon}
          >
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path
              d="M22 12.5C22 10.567 20.433 9 18.5 9C16.567 9 15 10.567 15 12.5C15 14.433 16.567 16 18.5 16C20.433 16 22 14.433 22 12.5Z"
              fill="white"
            />
            <path
              d="M17 19.5C17 17.567 15.433 16 13.5 16C11.567 16 10 17.567 10 19.5C10 21.433 11.567 23 13.5 23C15.433 23 17 21.433 17 19.5Z"
              fill="white"
            />
          </svg>
          <span className={styles.logoText}>Tài khoản</span>
        </Link>
      </div>

      <div className={styles.sidebarNav}>
        <div className={styles.navSection}>
          <div className={styles.navSectionTitle}>Tài khoản</div>
          <div className={styles.navLinks}>
            <NavLink href="/user" icon={Home}>
              Trang chủ
            </NavLink>
            <NavLink href="/user/profile" icon={User}>
              Hồ sơ cá nhân
            </NavLink>
            <NavLink href="/user/payments" icon={CreditCard}>
              Quản lý thanh toán
            </NavLink>
            <NavLink href="/user/settings" icon={Settings}>
              Cài đặt
            </NavLink>
          </div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navSectionTitle}>Nội dung</div>
          <div className={styles.navLinks}>
            <NavLink href="/user/bookmarks" icon={BookMarked}>
              Bài viết đã lưu
            </NavLink>
            <NavLink href="/user/comments" icon={MessageSquare}>
              Bình luận của tôi
            </NavLink>
            <NavLink href="/user/following" icon={Users}>
              Đang theo dõi
            </NavLink>
          </div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navSectionTitle}>Thông báo</div>
          <div className={styles.navLinks}>
            <NavLink href="/user/notifications" icon={Bell}>
              Thông báo
            </NavLink>
            <NavLink href="/user/reports" icon={AlertTriangle}>
              Báo cáo
            </NavLink>
          </div>
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            <img src="/placeholder.svg?height=40&width=40" alt="User Avatar" className={styles.userAvatarImg} />
            <span className={styles.userStatus}></span>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Nguyễn Văn A</div>
            <div className={styles.userRole}>Độc giả</div>
          </div>
          <Button variant="ghost" size="icon" className={styles.userAction}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className={styles.mobileSidebar}>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button variant="ghost" size="icon" className={styles.menuButton} onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <Input type="search" placeholder="Tìm kiếm..." className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.headerRight}>
            <Button variant="ghost" size="icon" className={styles.headerAction}>
              <Bell className="h-5 w-5" />
              <span className={styles.notificationBadge}>2</span>
            </Button>
            <div className={styles.userDropdown}>
              <div className={styles.userDropdownTrigger}>
                <img src="/placeholder.svg?height=32&width=32" alt="User" className={styles.userDropdownAvatar} />
                <span className={styles.userDropdownName}>Nguyễn Văn A</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <div className={styles.userDropdownMenu}>
                <Link href="/user/profile" className={styles.userDropdownItem}>
                  <User className="h-4 w-4 mr-2" />
                  Hồ sơ cá nhân
                </Link>
                <Link href="/user/settings" className={styles.userDropdownItem}>
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </Link>
                <div className={styles.userDropdownDivider}></div>
                <Link href="/auth/login" className={styles.userDropdownItem}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
