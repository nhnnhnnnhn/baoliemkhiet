"use client"

import type React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/hooks/use-logout"

import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
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
  const logout = useLogout()
  const currentUser = useSelector(selectCurrentUser)

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

  // Helper function to get avatar URL
  const getAvatarUrl = (path: string | null | undefined) => {
    if (!path) return `/placeholder.svg?height=40&width=40`;
    if (path.startsWith('http')) return path;
    if (path.startsWith('data:image')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

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
            <NavLink href="/user/profile" icon={User}>
              Hồ sơ cá nhân
            </NavLink>
          </div>
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            <img src={getAvatarUrl(currentUser?.avatar)} alt={currentUser?.fullname || 'User'} className={styles.userAvatarImg} />
            <span className={styles.userStatus}></span>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{currentUser?.fullname || 'User'}</div>
            <div className={styles.userRole}>{currentUser?.role || 'Độc giả'}</div>
          </div>
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
            <Link href="/">              
              <div className="flex items-center gap-2">                
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>                  
                  <Menu className="h-5 w-5" />                
                </Button>                
                <Link href="/user/profile">                  
                  <Button variant="ghost" size="icon">                    
                    <Home className="h-5 w-5" />                  
                  </Button>                
                </Link>              
              </div>            
            </Link>          
          </div>          
          <div className={styles.headerRight}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 flex items-center gap-2 p-2">
                  <img
                    src={getAvatarUrl(currentUser?.avatar)}
                    alt={currentUser?.fullname || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-medium">{currentUser?.fullname || 'User'}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/user/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
