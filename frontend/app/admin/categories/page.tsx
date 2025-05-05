import type { Metadata } from "next"
import CategoriesClientPage from "./CategoriesClientPage"

export const metadata: Metadata = {
  title: "Quản lý danh mục | Báo Liêm Khiết Admin",
  description: "Quản lý danh mục trên Báo Liêm Khiết",
}

export default function CategoriesPage() {
  return <CategoriesClientPage />
}
