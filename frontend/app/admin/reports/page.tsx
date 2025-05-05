import type { Metadata } from "next"
import ReportsPageClient from "./ReportsPageClient"

export const metadata: Metadata = {
  title: "Quản lý báo cáo | Báo Liêm Khiết Admin",
  description: "Quản lý báo cáo trên Báo Liêm Khiết",
}

export default function ReportsPage() {
  return <ReportsPageClient />
}
