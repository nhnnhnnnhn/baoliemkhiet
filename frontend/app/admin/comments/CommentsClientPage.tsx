"use client"

import { useState } from "react"
import { Check, X, Eye, AlertCircle, RefreshCw } from "lucide-react"

interface Comment {
  id: number
  author: {
    name: string
    username: string
  }
  content: string
  articleTitle: string
  date: string
  status: "PENDING" | "APPROVED" | "REJECTED_BY_AI" | "REJECTED_BY_REPORT"
}

export default function CommentsClientPage() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: {
        name: "Nguyễn Văn A",
        username: "nguyenvana",
      },
      content: "Bài viết rất hay và bổ ích. Tôi đã học được nhiều điều từ bài viết này.",
      articleTitle: "Việt Nam vô địch SEA Games 2023",
      date: "15/05/2023 - 10:30",
      status: "PENDING",
    },
    {
      id: 2,
      author: {
        name: "Trần Thị B",
        username: "tranthib",
      },
      content: "Tôi không đồng ý với quan điểm này. Cần phải xem xét kỹ hơn.",
      articleTitle: "Kinh tế Việt Nam tăng trưởng mạnh trong quý 2/2023",
      date: "14/05/2023 - 15:45",
      status: "PENDING",
    },
    {
      id: 3,
      author: {
        name: "Lê Văn C",
        username: "levanc",
      },
      content: "Cảm ơn tác giả đã chia sẻ thông tin hữu ích. Mong có thêm nhiều bài viết như thế này.",
      articleTitle: "Cách phòng tránh bệnh mùa hè hiệu quả",
      date: "13/05/2023 - 09:15",
      status: "PENDING",
    },
  ])

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "hide" | "delete" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalComments] = useState(24)
  const commentsPerPage = 10

  const handleView = (comment: Comment) => {
    setSelectedComment(comment)
    setIsViewModalOpen(true)
  }

  const handleAction = (comment: Comment, action: "approve" | "hide" | "delete") => {
    setSelectedComment(comment)
    setActionType(action)
    setIsConfirmModalOpen(true)
  }

  const confirmAction = () => {
    if (!selectedComment || !actionType) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (actionType === "delete") {
        setComments(comments.filter((c) => c.id !== selectedComment.id))
      } else if (actionType === "approve") {
        setComments(comments.map((c) => (c.id === selectedComment.id ? { ...c, status: "APPROVED" as const } : c)))
      } else if (actionType === "hide") {
        setComments(
          comments.map((c) => (c.id === selectedComment.id ? { ...c, status: "REJECTED_BY_REPORT" as const } : c)),
        )
      }

      setIsLoading(false)
      setIsConfirmModalOpen(false)
      setSelectedComment(null)
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
    } else if (direction === "next" && currentPage < Math.ceil(totalComments / commentsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý bình luận</h1>
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
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-center gap-4 rounded-md border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{comment.author.name}</div>
                    <div className="text-sm text-muted-foreground">@{comment.author.username}</div>
                    {comment.status === "PENDING" && (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Chờ duyệt
                      </span>
                    )}
                    {comment.status === "APPROVED" && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Đã duyệt
                      </span>
                    )}
                    {comment.status === "REJECTED_BY_AI" && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Từ chối (AI)
                      </span>
                    )}
                    {comment.status === "REJECTED_BY_REPORT" && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Từ chối (Báo cáo)
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm">{comment.content}</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Bình luận trên: <span className="font-medium">{comment.articleTitle}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{comment.date}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleView(comment)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Xem
                  </button>
                  {comment.status !== "APPROVED" && (
                    <button
                      className="inline-flex items-center justify-center rounded-md border border-green-500 bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
                      onClick={() => handleAction(comment, "approve")}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Duyệt
                    </button>
                  )}
                  {comment.status !== "REJECTED_BY_REPORT" && (
                    <button
                      className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleAction(comment, "hide")}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Ẩn
                    </button>
                  )}
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-destructive bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => handleAction(comment, "delete")}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * commentsPerPage + 1}-{Math.min(currentPage * commentsPerPage, totalComments)}{" "}
            của {totalComments} bình luận
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
              disabled={currentPage >= Math.ceil(totalComments / commentsPerPage)}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* View Comment Modal */}
      {isViewModalOpen && selectedComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">Chi tiết bình luận</h3>
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="font-medium">{selectedComment.author.name}</div>
                <div className="text-sm text-muted-foreground">@{selectedComment.author.username}</div>
              </div>
              <div className="mb-2 rounded-md border p-3 text-sm">{selectedComment.content}</div>
              <div className="text-xs text-muted-foreground">
                Bình luận trên: <span className="font-medium">{selectedComment.articleTitle}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{selectedComment.date}</div>
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
      {isConfirmModalOpen && selectedComment && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-medium">Xác nhận</h3>
            </div>
            <p className="mb-4 text-sm">
              {actionType === "approve" && "Bạn có chắc chắn muốn duyệt bình luận này?"}
              {actionType === "hide" && "Bạn có chắc chắn muốn ẩn bình luận này?"}
              {actionType === "delete" && "Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."}
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
                  actionType === "delete"
                    ? "bg-destructive hover:bg-destructive/90"
                    : actionType === "approve"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                onClick={confirmAction}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {actionType === "approve" && "Duyệt"}
                    {actionType === "hide" && "Ẩn"}
                    {actionType === "delete" && "Xóa"}
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
