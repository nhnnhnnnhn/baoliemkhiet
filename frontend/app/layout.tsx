import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

export const metadata = {
  title: "Báo Liêm Khiết",
  description: "Trang tin tức Báo Liêm Khiết - Thông tin chính xác, khách quan và đa chiều",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
