"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, ChevronDown, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Mock data for reports
const mockReports = [
  {
    id: 1,
    reason: "Nội dung không phù hợp",
    articleId: 123,
    articleTitle: "Việt Nam đạt thỏa thuận hợp tác kinh tế mới với các nước ASEAN",
    commentId: null,
    commentContent: null,
    status: "Đang xử lý",
    createdAt: "2025-04-15T08:30:00Z",
  },
  {
    id: 2,
    reason: "Thông tin sai lệch",
    articleId: 124,
    articleTitle: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
    commentId: null,
    commentContent: null,
    status: "Đã xử lý",
    createdAt: "2025-04-14T10:15:00Z",
  },
  {
    id: 3,
    reason: "Bình luận xúc phạm",
    articleId: 125,
    articleTitle: "Doanh nghiệp công nghệ Việt Nam đón đầu xu hướng AI",
    commentId: 456,
    commentContent: "Nội dung bình luận không phù hợp...",
    status: "Đang xử lý",
    createdAt: "2025-04-13T14:20:00Z",
  },
  {
    id: 4,
    reason: "Spam",
    articleId: 126,
    articleTitle: "Chính phủ công bố kế hoạch phát triển kinh tế 5 năm tới",
    commentId: 457,
    commentContent: "Nội dung bình luận spam...",
    status: "Đã xử lý",
    createdAt: "2025-04-12T09:45:00Z",
  },
  {
    id: 5,
    reason: "Vi phạm bản quyền",
    articleId: 127,
    articleTitle: "Đội tuyển Việt Nam giành chiến thắng ấn tượng tại vòng loại World Cup",
    commentId: null,
    commentContent: null,
    status: "Đang xử lý",
    createdAt: "2025-04-11T16:30:00Z",
  },
]

// Format date to relative time (e.g., "2 hours ago")
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "vừa xong"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ngày trước`
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports)
  const [filter, setFilter] = useState("all")

  // Filter reports based on status
  const filteredReports = reports.filter((report) => {
    if (filter === "all") return true
    if (filter === "pending") return report.status === "Đang xử lý"
    if (filter === "processed") return report.status === "Đã xử lý"
    return true
  })

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Reports</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("processed")}>Processed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {filteredReports.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <AlertTriangle className="h-6 w-6 mr-2 text-yellow-500" />
            <span>No reports found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Article
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Comment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/articles/${report.articleId}`}>{report.articleTitle}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.commentId ? (
                        <Link href={`/articles/${report.articleId}?comment=${report.commentId}`}>
                          {report.commentContent}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeTime(report.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
