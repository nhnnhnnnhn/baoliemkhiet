import { Article } from "@/src/apis/article"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

/**
 * Kiểm tra tính hợp lệ của ngày tháng
 */
export const isValidDate = (date: string | null | undefined): boolean => {
  if (!date) return false
  const d = new Date(date)
  return !isNaN(d.getTime())
}

/**
 * Lấy ngày hợp lệ từ article
 */
export const getValidDate = (article: Article): string | null => {
  if (isValidDate(article.published_at)) return article.published_at
  if (isValidDate(article.created_at)) return article.created_at || null
  return null
}

/**
 * Format ngày tháng theo định dạng dd/MM/yyyy HH:mm
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString || !isValidDate(dateString)) return "Chưa có dữ liệu"
  const date = new Date(dateString)
  return format(date, "dd/MM/yyyy HH:mm", { locale: vi })
}

/**
 * Hàm so sánh ngày tháng cho việc sắp xếp
 */
export const compareDates = (a: Article, b: Article): number => {
  const validDateA = getValidDate(a)
  const validDateB = getValidDate(b)
  
  // Nếu cả hai đều không có giá trị ngày hợp lệ, giữ nguyên vị trí
  if (!validDateA && !validDateB) return 0
  // Nếu chỉ A không có ngày hợp lệ, đặt B lên trước
  if (!validDateA) return 1
  // Nếu chỉ B không có ngày hợp lệ, đặt A lên trước
  if (!validDateB) return -1
  
  // Nếu cả hai đều có ngày hợp lệ, so sánh bình thường
  const dateA = new Date(validDateA)
  const dateB = new Date(validDateB)
  return dateB.getTime() - dateA.getTime()
}

/**
 * Sắp xếp bài viết theo thời gian mới nhất
 */
export const sortByLatest = (articles: Article[]): Article[] => {
  return [...articles].sort(compareDates)
}

/**
 * Sắp xếp bài viết theo lượt xem
 */
export const sortByViews = (articles: Article[]): Article[] => {
  return [...articles].sort((a, b) => (b.view || 0) - (a.view || 0))
}
