import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  count: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, count, onPageChange, className = '' }: PaginationProps) {
  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (page < count) {
      onPageChange(page + 1)
    }
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5 // Số trang tối đa hiển thị

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(count, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Luôn hiển thị trang đầu
    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key={1}
          variant={page === 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(1)}
          className={page === 1 ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          1
        </Button>
      )

      // Hiển thị dấu chấm lửng nếu không kề trang đầu
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        )
      }
    }

    // Hiển thị các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === count) continue // Bỏ qua trang đầu và cuối vì đã hiển thị riêng
      
      pageNumbers.push(
        <Button
          key={i}
          variant={page === i ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(i)}
          className={page === i ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {i}
        </Button>
      )
    }

    // Luôn hiển thị trang cuối
    if (endPage < count) {
      // Hiển thị dấu chấm lửng nếu không kề trang cuối
      if (endPage < count - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        )
      }

      pageNumbers.push(
        <Button
          key={count}
          variant={page === count ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(count)}
          className={page === count ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {count}
        </Button>
      )
    }

    return pageNumbers
  }

  if (count <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={page === 1}
        className="p-0 w-9 h-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {renderPageNumbers()}

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={page === count}
        className="p-0 w-9 h-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
