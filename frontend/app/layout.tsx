import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Suspense } from "react"

import "./globals.css"
import Loading from "./loading"
import Providers from "@/components/providers"

// Sử dụng font Inter cho nội dung - font sans-serif hiện đại
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
})

// Sử dụng font Montserrat cho tiêu đề - font hiện đại và bắt mắt
const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Báo Liêm Khiết - Tin tức nhanh chóng và chính xác",
  description: "Trang tin tức cập nhật nhanh chóng và chính xác nhất Việt Nam",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${montserrat.variable}`}>
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  )
}
