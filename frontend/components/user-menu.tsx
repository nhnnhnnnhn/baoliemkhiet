"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { useAppDispatch } from "@/src/store"
import { handleLogout } from "@/src/thunks/auth/authThunk"
import { UserAvatar } from "@/components/user-avatar"

interface UserMenuProps {
  user: {
    avatar?: string | null
    fullname: string
    role?: string
  }
  isScrolled: boolean
}

// Helper function to get current role
const getCurrentRole = () => {
  return localStorage.getItem("userRole") || ""
}

export function UserMenu({ user, isScrolled }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        <UserAvatar src={user.avatar} name={user.fullname} className="w-8 h-8" />
        <span className={`hidden sm:block font-medium ${isScrolled ? "text-gray-800" : "text-white"}`}>
          {user.fullname}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          {/* Dashboard link based on role */}
          {(() => {
            const currentRole = getCurrentRole()
            switch (currentRole) {
              case "ADMIN":
                return (
                  <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    Quản trị viên
                  </Link>
                )
              case "JOURNALIST":
                return (
                  <Link href="/author" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    Trang tác giả
                  </Link>
                )
              case "USER":
                return (
                  <Link href="/user" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    Tài khoản
                  </Link>
                )
              default:
                return null
            }
          })()}
          <button
            onClick={() => {
              dispatch(handleLogout())
                .unwrap()
                .then(() => {
                  window.location.href = "/"
                })
                .catch((error) => {
                  console.error("Logout failed:", error)
                  // Manually clear storage if API call fails
                  localStorage.removeItem("accessToken")
                  localStorage.removeItem("refreshToken")
                  localStorage.removeItem("userRole")
                  window.location.href = "/"
                })
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}
