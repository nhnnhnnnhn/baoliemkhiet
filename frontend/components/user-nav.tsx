"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/src/store"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { handleLogout as handleLogoutThunk } from "@/src/thunks/auth/authThunk"
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

export function UserNav() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  
  const handleLogout = async () => {
    try {
      await dispatch(handleLogoutThunk()).unwrap()
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Helper function to get avatar URL
  const getAvatarUrl = (path: string | null | undefined) => {
    if (!path) return `/placeholder.svg?height=32&width=32&text=${user?.fullname?.substring(0, 2).toUpperCase() || 'U'}`;
    if (path.startsWith('http')) return path;
    if (path.startsWith('data:image')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={getAvatarUrl(user?.avatar)}
              alt={user?.fullname || 'User'}
            />
            <AvatarFallback>{getInitials(user?.fullname || 'User')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullname || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/profile/${user?.email?.split('@')[0] || ''}`}>
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user?.role === "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                <span>Quản trị</span>
              </Link>
            </DropdownMenuItem>
          )}
          {user?.role === "JOURNALIST" && (
            <DropdownMenuItem asChild>
              <Link href="/author">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Trang tác giả</span>
              </Link>
            </DropdownMenuItem>
          )}
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
