"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, BookMarked, LogOut, MessageSquare, Settings, Tag, User, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock user data - in a real app, this would come from your auth system
const mockUser = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  username: "nguyenvana",
  image: "/placeholder.svg?height=32&width=32&text=NVA",
  role: "USER", // Could be USER, ADMIN, EDITOR, JOURNALIST
}

export function UserNav() {
  const router = useRouter()
  const [user, setUser] = useState(mockUser)

  // Thêm useEffect để lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo)
        setUser({
          ...mockUser,
          ...parsedUser,
          image: `/placeholder.svg?height=32&width=32&text=${parsedUser.name.substring(0, 2).toUpperCase()}`,
        })
      } catch (error) {
        console.error("Failed to parse user info", error)
      }
    }
  }, [])

  // Cập nhật hàm handleLogout để xóa token và thông tin người dùng
  const handleLogout = () => {
    // Xóa token và thông tin người dùng
    localStorage.removeItem("authToken")
    localStorage.removeItem("userInfo")

    // Kích hoạt sự kiện storage để các component khác biết người dùng đã đăng xuất
    window.dispatchEvent(new Event("storage"))

    // Chuyển hướng về trang đăng nhập
    router.push("/auth/login")
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/profile/${user.username}`}>
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ công khai</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications">
              <Bell className="mr-2 h-4 w-4" />
              <span>Thông báo</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user/bookmarks">
              <BookMarked className="mr-2 h-4 w-4" />
              <span>Bài viết đã lưu</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user/comments">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Bình luận của tôi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/tags">
              <Tag className="mr-2 h-4 w-4" />
              <span>Chủ đề</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.role === "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                <span>Quản trị</span>
              </Link>
            </DropdownMenuItem>
          )}
          {user.role === "JOURNALIST" && (
            <DropdownMenuItem asChild>
              <Link href="/author">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Trang tác giả</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/user">
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt tài khoản</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
