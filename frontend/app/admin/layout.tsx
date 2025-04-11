import type React from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { Home, Users, FileText, BarChart2, Settings, Menu, Search, ChevronDown, LogOut, User, Mail } from "lucide-react"
import Image from "next/image"

import { NotificationDropdown } from "@/components/notification-dropdown"
import styles from "./admin.module.css"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard for Báo Liêm Khiết",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          <div className={styles.sidebarNav}>
            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>Tổng quan</div>
              <div className={styles.navLinks}>
                <Link href="/admin" className={`${styles.navLink} ${styles.navLinkActive}`}>
                  <Home className={styles.navIcon} />
                  Trang chủ
                </Link>
                <Link href="/admin/statistics" className={styles.navLink}>
                  <BarChart2 className={styles.navIcon} />
                  Thống kê
                </Link>
              </div>
            </div>
            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>Quản lý</div>
              <div className={styles.navLinks}>
                <Link href="/admin/articles" className={styles.navLink}>
                  <FileText className={styles.navIcon} />
                  Bài viết
                </Link>
                <Link href="/admin/users" className={styles.navLink}>
                  <Users className={styles.navIcon} />
                  Người dùng
                </Link>
              </div>
            </div>
            <div className={styles.navSection}>
              <div className={styles.navSectionTitle}>Cài đặt</div>
              <div className={styles.navLinks}>
                <Link href="/admin/profile" className={styles.navLink}>
                  <User className={styles.navIcon} />
                  Hồ sơ
                </Link>
                <Link href="/admin/settings" className={styles.navLink}>
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
              <div className={styles.userDropdownTrigger}>
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className={styles.userDropdownAvatar}
                />
                <span className={styles.userDropdownName}>Admin User</span>
                <ChevronDown size={16} />
              </div>
              <div className={styles.userDropdownMenu}>
                <Link href="/admin/profile" className={styles.userDropdownItem}>
                  <User size={16} className="mr-2" />
                  Hồ sơ
                </Link>
                <Link href="/admin/messages" className={styles.userDropdownItem}>
                  <Mail size={16} className="mr-2" />
                  Tin nhắn
                </Link>
                <div className={styles.userDropdownDivider}></div>
                <Link href="/auth/login" className={styles.userDropdownItem}>
                  <LogOut size={16} className="mr-2" />
                  Đăng xuất
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.pageContent}>{children}</div>
      </div>
    </div>
  )
}
