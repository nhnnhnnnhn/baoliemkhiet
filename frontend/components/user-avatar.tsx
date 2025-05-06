"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface UserAvatarProps {
  src?: string | null
  name: string
  className?: string
}

export function UserAvatar({ src, name, className }: UserAvatarProps) {
  // Lấy chữ cái đầu của tên người dùng
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <Avatar className={className}>
      <AvatarImage src={src || undefined} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
