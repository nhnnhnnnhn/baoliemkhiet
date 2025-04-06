import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "Báo Liêm Khiết",
  description: "Trang tin tức chính thống về liêm chính và minh bạch",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} font-inter`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

