"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, XCircle, Eye, RefreshCw } from "lucide-react"

interface Report {
  id: number
  reporter: {
    name: string
    username: string
  }
  content: string
  type: "ARTICLE" | "COMMENT" | "USER"
  targetId: number
  targetName: string
  date: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
}

export default function ReportsPageClient() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      reporter: {
        name: "Nguyễn Văn A",
        username: "nguyenvana",
      },
      content: "Báo cáo bài viết vì nội dung không chính xác",
      type: "ARTICLE",
      targetId: 123,
      targetName: "Việt Nam vô địch SEA Games 2023",
      date: "15/05/2023 - 10:30",
      status: "PENDING",
    },
    {
      id: 2,
      reporter: {
        name: "Trần Thị B",
        username: "tranthib",
      },
      content: "Báo cáo bình luận của người dùng @levanc vì vi phạm quy tắc cộng đồng",
      type: "COMMENT",
      targetId: 456,
      targetName: "Bình luận của @levanc",
      date: "14/05/2023 - 15:45",
      status: "PENDING",
    },
    {
      id: 3,
      reporter: {
        name: "Lê Văn C",
        username: "levanc",
      },
      content: "Báo cáo tài khoản vì spam và quấy rối",
      type: "USER",
      targetId: 789,
      targetName: "@phamthid",
      date: "13/05/2023 - 09:15",
      status: "PENDING",
    },
  ])

  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalReports] = useState(18)
  const reportsPerPage = 10

  const handleView = (report: Report) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleAction = (report: Report, action: "accept" | "reject") => {
    setSelectedReport(report)
    setActionType(action)
    setIsConfirmModalOpen(true)
  }

  const confirmAction = () => {
    if (!selectedReport || !actionType) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (actionType === "accept") {
        setReports(reports.map((r) => (r.id === selectedReport.id ? { ...r, status: "ACCEPTED" as const } : r)))
      } else if (actionType === "reject") {
        setReports(reports.map((r) => (r.id === selectedReport.id ? { ...r, status: "REJECTED" as const } : r)))
      }

      setIsLoading(false)
      setIsConfirmModalOpen(false)
      setSelectedReport(null)
      setActionType(null)
    }, 500)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call to refresh data
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handlePagination = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    } else if (direction === "next" && currentPage < Math.ceil(totalReports / reportsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý báo cáo</h1>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Làm mới
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center gap-4 rounded-md border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{report.reporter.name}</div>
                    <div className="text-sm text-muted-foreground">@{report.reporter.username}</div>
                    {report.status === "PENDING" && (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Chờ xử lý
                      </span>
                    )}
                    {report.status === "ACCEPTED" && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Đã chấp nhận
                      </span>
                    )}
                    {report.status === "REJECTED" && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Đã từ chối
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm">{report.content}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {report.type === "ARTICLE" && "Báo cáo bài viết: "}
                    {report.type === "COMMENT" && "Báo cáo bình luận: "}
                    {report.type === "USER" && "Báo cáo người dùng: "}
                    <span className="font-medium">{report.targetName}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{report.date}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleView(report)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Xem
                  </button>
                  {report.status === "PENDING" && (
                    <>
                      <button
                        className="inline-flex items-center justify-center rounded-md border border-green-500 bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
                        onClick={() => handleAction(report, "accept")}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Chấp nhận
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md border border-destructive bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleAction(report, "reject")}
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * reportsPerPage + 1}-{Math.min(currentPage * reportsPerPage, totalReports)} của{" "}
            {totalReports} báo cáo
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              onClick={() => handlePagination("prev")}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              onClick={() => handlePagination("next")}
              disabled={currentPage >= Math.ceil(totalReports / reportsPerPage)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* View Report Modal */}
      {isViewModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">Chi tiết báo cáo</h3>
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="font-medium">{selectedReport.reporter.name}</div>
                <div className="text-sm text-muted-foreground">@{selectedReport.reporter.username}</div>
              </div>
              <div className="mb-2 rounded-md border p-3 text-sm">{selectedReport.content}</div>
              <div className="text-xs text-muted-foreground">
                {selectedReport.type === "ARTICLE" && "Báo cáo bài viết: "}
                {selectedReport.type === "COMMENT" && "Báo cáo bình luận: "}
                {selectedReport.type === "USER" && "Báo cáo người dùng: "}
                <span className="font-medium">{selectedReport.targetName}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{selectedReport.date}</div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsViewModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && selectedReport && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-medium">Xác nhận</h3>
            </div>
            <p className="mb-4 text-sm">
              {actionType === "accept" &&
                "Bạn có chắc chắn muốn chấp nhận báo cáo này? Hành động này có thể ảnh hưởng đến nội dung được báo cáo."}
              {actionType === "reject" && "Bạn có chắc chắn muốn từ chối báo cáo này?"}
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${
                  actionType === "accept" ? "bg-green-500 hover:bg-green-600" : "bg-destructive hover:bg-destructive/90"
                }`}
                onClick={confirmAction}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {actionType === "accept" && "Chấp nhận"}
                    {actionType === "reject" && "Từ chối"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
