"use client";

import { useState, useEffect } from "react";
import { Check, X, Eye, AlertCircle, RefreshCw } from "lucide-react";
import commentApi from "@/src/apis/comment";
import type {
  Comment as ApiComment,
  GetCommentsResponse,
} from "@/src/apis/comment";
import { format } from "date-fns";

interface Comment
  extends Omit<
    ApiComment,
    "createdAt" | "updatedAt" | "articleId" | "userId" | "user"
  > {
  author: {
    name: string;
    username: string;
  };
  article: {
    id: number;
    title: string;
  };
  date: string;
}

export default function CommentsClientPage() {
  const [comments, setComments] = useState<Comment[]>([]);

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "delete" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const commentsPerPage = 10;

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await commentApi.getAllComments(
        currentPage,
        commentsPerPage
      );

      const AllComments = await commentApi.getAllComments(1, 9999);

      // Handle both array and paginated response formats
      const commentsData = Array.isArray(response)
        ? response
        : (response as GetCommentsResponse).comments || [];

      const total = Array.isArray(AllComments) ? AllComments.length : 0;

      const formattedComments: Comment[] = commentsData.map((comment) => ({
        id: comment.id,
        content: comment.content,
        status: comment.status,
        author: {
          name: comment.user?.fullname || "Unknown",
          username: comment.user?.email?.split("@")[0] || "unknown",
        },
        article: {
          id: comment.article?.id || 0,
          title: comment.article?.title || "Unknown Article",
        },
        date: format(new Date(comment.createdAt), "dd/MM/yyyy - HH:mm"),
      }));
      setComments(formattedComments);
      setTotalComments(total);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  const handleView = (comment: Comment) => {
    setSelectedComment(comment);
    setIsViewModalOpen(true);
  };

  const handleAction = (comment: Comment, action: "approve" | "delete") => {
    setSelectedComment(comment);
    setActionType(action);
    setIsConfirmModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedComment || !actionType) return;

    setIsLoading(true);
    try {
      if (actionType === "delete") {
        await commentApi.deleteComment(0, selectedComment.id); // articleId is not needed for delete
        setComments(comments.filter((c) => c.id !== selectedComment.id));
      } else if (actionType === "approve") {
        await commentApi.updateComment(0, selectedComment.id, {
          content: selectedComment.content,
          status: "APPROVED",
        });
        setComments(
          comments.map((c) =>
            c.id === selectedComment.id ? { ...c, status: "APPROVED" } : c
          )
        );
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }

    setIsLoading(false);
    setIsConfirmModalOpen(false);
    setSelectedComment(null);
    setActionType(null);
  };

  const handleRefresh = () => {
    fetchComments();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-black mb-6">
        Quản lý bình luận
      </h1>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Danh sách bình luận
        </h2>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Làm mới
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <div className="grid gap-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-center gap-4 rounded-md border p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-black">
                      {comment.author.name}
                    </div>
                    <div className="text-sm text-black">
                      @{comment.author.username}
                    </div>
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
                  <div className="mt-1 text-sm text-black">
                    {comment.content}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Bình luận trên:{" "}
                    <span className="font-medium">{comment.article.title}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {comment.date}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-input bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
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
            Hiển thị {(currentPage - 1) * commentsPerPage + 1}-
            {Math.min(currentPage * commentsPerPage, totalComments)} của{" "}
            {totalComments} bình luận
          </div>
          <div className="flex items-center gap-1">
            <button
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            {[...Array(Math.ceil(totalComments / commentsPerPage))]
              .map((_, index) => {
                const pageNumber = index + 1;
                const totalPages = Math.ceil(totalComments / commentsPerPage);

                // Always show first and last pages, current page, and ones next to current page
                const shouldShowPage =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(currentPage - pageNumber) <= 1;

                // Show ellipsis for gaps
                if (!shouldShowPage) {
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 &&
                      currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={pageNumber} className="px-1 text-sm">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    disabled={currentPage === pageNumber}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                      currentPage === pageNumber
                        ? "bg-primary text-primary-foreground"
                        : "border border-input hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })
              .filter(Boolean)}
            <button
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={
                currentPage >= Math.ceil(totalComments / commentsPerPage)
              }
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
                <div className="font-medium text-black">
                  {selectedComment.author.name}
                </div>
                <div className="text-sm text-black">
                  @{selectedComment.author.username}
                </div>
              </div>
              <div className="mb-2 rounded-md border p-3 text-sm text-black">
                {selectedComment.content}
              </div>
              <div className="text-xs text-muted-foreground">
                Bình luận trên:{" "}
                <span className="font-medium">
                  {selectedComment.article.title}
                </span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {selectedComment.date}
              </div>
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
              {actionType === "approve" &&
                "Bạn có chắc chắn muốn duyệt bình luận này?"}
              {actionType === "delete" &&
                "Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."}
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
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={confirmAction}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {actionType === "approve" && "Duyệt"}
                    {actionType === "delete" && "Xóa"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
