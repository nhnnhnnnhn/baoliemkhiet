import type { Metadata } from "next"
import CommentsClientPage from "./CommentsClientPage"

export const metadata: Metadata = {
  title: "Quản lý bình luận | Báo Liêm Khiết Admin",
  description: "Quản lý bình luận trên Báo Liêm Khiết",
}

export default function CommentsPage() {
  return <CommentsClientPage />
}
