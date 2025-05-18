import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Suspense } from "react"

import "./globals.css"
import Loading from "./loading"
import Providers from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

// Sử dụng font Inter cho nội dung - font sans-serif hiện đại
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

// Sử dụng font Montserrat cho tiêu đề - font hiện đại và bắt mắt
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

export const metadata: Metadata = {
  title: "Báo Liêm Khiết",
  description: "Báo điện tử Liêm Khiết - Tin tức mới nhất, nhanh nhất và đầy đủ nhất",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  )
}
