import type React from "react"
import "@/app/globals.css"
import { Noto_Serif, Roboto } from "next/font/google"
import { Suspense } from "react"
import Loading from "./loading"

// Sử dụng Noto Serif cho font serif - hỗ trợ tiếng Việt tốt
const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-serif",
})

// Sử dụng Roboto cho font sans-serif - hỗ trợ tiếng Việt tốt
const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
})

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
      <body className={`${notoSerif.variable} ${roboto.variable} font-sans`}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  )
}
