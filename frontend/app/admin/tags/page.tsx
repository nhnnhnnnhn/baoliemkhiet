import type { Metadata } from "next"
import TagsClientPage from "./TagsClientPage"

export const metadata: Metadata = {
  title: "Quản lý thẻ | Báo Liêm Khiết Admin",
  description: "Quản lý thẻ trên Báo Liêm Khiết",
}

export default function TagsPage() {
  return <TagsClientPage />
}
