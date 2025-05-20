"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, MoreHorizontal, Trash, Eye, X, Flag, MessageSquare, FileText, Edit, Trash2, RefreshCw } from "lucide-react"

import reportApi, { Report } from "@/src/apis/report"
import { useAppSelector, useAppDispatch } from "@/src/store"
import { selectCurrentUser, selectIsLoggedIn } from "@/src/thunks/auth/authSlice"
import { 
  handleGetAllReports, 
  handleDeleteReport,
  handleDeleteMultipleReports
} from "@/src/thunks/report/reportThunk"
import { 
  selectReports, 
  selectIsLoading,
  selectError,
  selectDeleteReportSuccess,
  clearDeleteReportState
} from "@/src/thunks/report/reportSlice"
import EditReportForm from "@/components/EditReportForm"
import { EditReportMenuItem } from "./fix-edit-button"

export default function AdminReportsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  
  // Redux selectors
  const reports = useAppSelector(selectReports)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const deleteSuccess = useAppSelector(selectDeleteReportSuccess)
  
  // Local state
  const [activeTab, setActiveTab] = useState("all")
  const [selectedReports, setSelectedReports] = useState<number[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reportToView, setReportToView] = useState<Report | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteMultipleDialogOpen, setDeleteMultipleDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [reportToEdit, setReportToEdit] = useState<number | null>(null)

  // Authentication check
  const isAuthenticated = useAppSelector(selectIsLoggedIn)
  const currentUser = useAppSelector(selectCurrentUser)

  // Handle authentication
  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.role !== "ADMIN") {
      router.push("/auth/login")
    }
  }, [isAuthenticated, currentUser, router])

  // Load reports
  useEffect(() => {
    dispatch(handleGetAllReports())
  }, [dispatch])

  // Handle delete success notification
  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: "Thành công",
        description: "Báo cáo đã được xóa thành công",
        variant: "success"
      })
      dispatch(clearDeleteReportState())
      setDeleteDialogOpen(false)
    }
  }, [deleteSuccess, dispatch])
  
  // Handle error notification
  useEffect(() => {
    if (error) {
      toast({
        title: "Lỗi",
        description: error,
        variant: "destructive"
      })
    }
  }, [error])

  // Filter reports based on active tab
  const filteredReports = reports.filter((report) => {
    if (activeTab === "all") return true
    if (activeTab === "articles") return report.articleId !== null
    if (activeTab === "comments") return report.commentId !== null
    return true
  })

  // Handle report selection for bulk actions
  const handleSelectReport = (id: number) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((reportId) => reportId !== id) : [...prev, id]
    )
  }

  // Handle select all reports
  const handleSelectAllReports = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(filteredReports.map((report) => report.id))
    }
  }

  // Handle delete report
  const deleteReportHandler = async (id: number) => {
    dispatch(handleDeleteReport(id))
  }

  // Handle delete multiple reports
  const deleteMultipleReportsHandler = async () => {
    dispatch(handleDeleteMultipleReports(selectedReports))
    setSelectedReports([])
    setDeleteMultipleDialogOpen(false)
  }

  // Format report type for display
  const getReportType = (report: Report) => {
    if (report.articleId) return "Bài viết"
    if (report.commentId) return "Bình luận"
    return "Không xác định"
  }

  // Get report content
  const getReportContent = (report: Report) => {
    if (report.articleId && report.article) {
      return report.article.title.substring(0, 50) + (report.article.title.length > 50 ? "..." : "")
    }
    if (report.commentId && report.comment) {
      return report.comment.content.substring(0, 50) + (report.comment.content.length > 50 ? "..." : "")
    }
    return "Không có nội dung"
  }

  // Map report reason to Vietnamese
  const getReasonInVietnamese = (reason: string) => {
    const reasonMap: Record<string, string> = {
      spam: "Spam",
      harassment: "Quấy rối",
      hate_speech: "Ngôn từ thù ghét",
      misinformation: "Thông tin sai lệch",
      inappropriate: "Nội dung không phù hợp",
      violence: "Bạo lực",
      other: "Lý do khác",
    }
    
    return reasonMap[reason.toLowerCase()] || reason
  }

  // Open delete dialog
  const handleOpenDeleteDialog = (reportId: number) => {
    setReportToView(reports.find(report => report.id === reportId) || null)
    setDeleteDialogOpen(true)
  }

  // Open edit dialog
  const handleOpenEditDialog = (reportId: number) => {
    console.log("handleOpenEditDialog called", { reportId })
    setReportToEdit(reportId)
    setIsEditDialogOpen(true)
    console.log("Dialog state updated", { reportId, isEditDialogOpen: true })
  }

  // Delete report
  const handleConfirmDelete = () => {
    if (reportToView) {
      deleteReportHandler(reportToView.id)
      setDeleteDialogOpen(false)
      setReportToView(null)
    }
  }

  // Refresh reports
  const handleRefresh = () => {
    dispatch(handleGetAllReports())
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý báo cáo</h1>

        {selectedReports.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={() => setDeleteMultipleDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Xóa ({selectedReports.length})
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="articles">Bài viết</TabsTrigger>
          <TabsTrigger value="comments">Bình luận</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách báo cáo</CardTitle>
              <CardDescription>
                Tất cả các báo cáo từ người dùng.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Flag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Không có báo cáo nào.</p>
                </div>
              ) : (
                <div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                              onCheckedChange={handleSelectAllReports}
                              aria-label="Select all reports"
                            />
                          </TableHead>
                          <TableHead className="w-[100px]">ID</TableHead>
                          <TableHead className="w-[150px]">Loại</TableHead>
                          <TableHead className="w-[300px]">Nội dung</TableHead>
                          <TableHead className="w-[150px]">Lý do</TableHead>
                          <TableHead className="w-[200px]">Người báo cáo</TableHead>
                          <TableHead className="w-[180px]">Thời gian</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedReports.includes(report.id)}
                                onCheckedChange={() => handleSelectReport(report.id)}
                                aria-label={`Select report ${report.id}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell>
                              <Badge variant={report.articleId ? "default" : "secondary"}>
                                {report.articleId ? (
                                  <FileText className="h-3 w-3 mr-1" />
                                ) : (
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                )}
                                {getReportType(report)}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {getReportContent(report)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{getReasonInVietnamese(report.reason)}</Badge>
                            </TableCell>
                            <TableCell>
                              {report.reportedByUser?.fullname || "Thông tin người dùng"}
                            </TableCell>
                            <TableCell>
                              {formatDate(report.createdAt)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setReportToView(report)
                                    setViewDialogOpen(true)
                                  }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                  </DropdownMenuItem>
                                  <EditReportMenuItem 
                                    reportId={report.id} 
                                    openEditDialog={setReportToEdit} 
                                  />
                                  <DropdownMenuItem onClick={() => {
                                    handleOpenDeleteDialog(report.id)
                                  }}>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Xóa báo cáo
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo bài viết</CardTitle>
              <CardDescription>
                Các báo cáo liên quan đến bài viết.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Flag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Không có báo cáo nào về bài viết.</p>
                </div>
              ) : (
                <div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                              onCheckedChange={handleSelectAllReports}
                              aria-label="Select all reports"
                            />
                          </TableHead>
                          <TableHead className="w-[100px]">ID</TableHead>
                          <TableHead className="w-[300px]">Tiêu đề bài viết</TableHead>
                          <TableHead className="w-[150px]">Lý do</TableHead>
                          <TableHead className="w-[200px]">Người báo cáo</TableHead>
                          <TableHead className="w-[180px]">Thời gian</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedReports.includes(report.id)}
                                onCheckedChange={() => handleSelectReport(report.id)}
                                aria-label={`Select report ${report.id}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {report.article?.title || "Không có tiêu đề"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{getReasonInVietnamese(report.reason)}</Badge>
                            </TableCell>
                            <TableCell>
                              {report.reportedByUser?.fullname || "Thông tin người dùng"}
                            </TableCell>
                            <TableCell>
                              {formatDate(report.createdAt)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setReportToView(report)
                                    setViewDialogOpen(true)
                                  }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                  </DropdownMenuItem>
                                  <EditReportMenuItem 
                                    reportId={report.id} 
                                    openEditDialog={setReportToEdit} 
                                  />
                                  <DropdownMenuItem onClick={() => {
                                    handleOpenDeleteDialog(report.id)
                                  }}>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Xóa báo cáo
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo bình luận</CardTitle>
              <CardDescription>
                Các báo cáo liên quan đến bình luận.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Flag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Không có báo cáo nào về bình luận.</p>
                </div>
              ) : (
                <div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                              onCheckedChange={handleSelectAllReports}
                              aria-label="Select all reports"
                            />
                          </TableHead>
                          <TableHead className="w-[100px]">ID</TableHead>
                          <TableHead className="w-[300px]">Nội dung bình luận</TableHead>
                          <TableHead className="w-[150px]">Lý do</TableHead>
                          <TableHead className="w-[200px]">Người báo cáo</TableHead>
                          <TableHead className="w-[180px]">Thời gian</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedReports.includes(report.id)}
                                onCheckedChange={() => handleSelectReport(report.id)}
                                aria-label={`Select report ${report.id}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {report.comment?.content || "Không có nội dung"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{getReasonInVietnamese(report.reason)}</Badge>
                            </TableCell>
                            <TableCell>
                              {report.reportedByUser?.fullname || "Thông tin người dùng"}
                            </TableCell>
                            <TableCell>
                              {formatDate(report.createdAt)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <Link
                                    href={`/admin/comments?highlight=${report.comment?.id}`}
                                    className="w-full"
                                  >
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Xem trong trang quản trị
                                    </DropdownMenuItem>
                                  </Link>
                                  <EditReportMenuItem 
                                    reportId={report.id} 
                                    openEditDialog={setReportToEdit} 
                                  />
                                  <DropdownMenuItem onClick={() => {
                                    handleOpenDeleteDialog(report.id)
                                  }}>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Xóa báo cáo
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa báo cáo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa báo cáo này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete multiple confirmation dialog */}
      <AlertDialog open={deleteMultipleDialogOpen} onOpenChange={setDeleteMultipleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhiều báo cáo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedReports.length} báo cáo đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteMultipleReportsHandler}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa {selectedReports.length} báo cáo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View report dialog */}
      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-center">
              <span>Chi tiết báo cáo #{reportToView?.id}</span>
              <Button variant="ghost" size="icon" onClick={() => setViewDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          {reportToView && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Loại báo cáo</h3>
                  <p className="mt-1">
                    <Badge variant={reportToView.articleId ? "default" : "secondary"}>
                      {reportToView.articleId ? (
                        <FileText className="h-3 w-3 mr-1" />
                      ) : (
                        <MessageSquare className="h-3 w-3 mr-1" />
                      )}
                      {getReportType(reportToView)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Thời gian</h3>
                  <p className="mt-1">
                    {formatDate(reportToView.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Người báo cáo</h3>
                  <p className="mt-1 font-medium">
                    {reportToView.reportedByUser?.fullname || "Thông tin người dùng"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Lý do báo cáo</h3>
                  <p className="mt-1">
                    <Badge variant="outline">{getReasonInVietnamese(reportToView.reason)}</Badge>
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                {reportToView.articleId ? (
                  <>
                    <h3 className="text-sm font-medium text-gray-500">Bài viết bị báo cáo</h3>
                    <div className="mt-2 p-4 border rounded-md">
                      <h4 className="font-medium text-lg mb-2">{reportToView.article?.title || "Không có tiêu đề"}</h4>
                      <div className="text-gray-600 mt-2 line-clamp-4">
                        {reportToView.article?.content || "Không có nội dung"}
                      </div>
                      
                      {reportToView.article && (
                        <div className="mt-4">
                          <Link 
                            href={`/admin/articles?highlight=${reportToView.article.id}`}
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Xem bài viết trong trang quản trị
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                ) : reportToView.commentId ? (
                  <>
                    <h3 className="text-sm font-medium text-gray-500">Bình luận bị báo cáo</h3>
                    <div className="mt-2 p-4 border rounded-md">
                      <div className="flex items-start gap-3">
                        {reportToView.comment?.user?.avatar ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                              src={reportToView.comment.user.avatar} 
                              alt={reportToView.comment.user.fullname} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500 text-sm font-bold">
                              {reportToView.comment?.user?.fullname ? reportToView.comment.user.fullname.charAt(0).toUpperCase() : "?"}
                            </span>
                          </div>
                        )}
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-gray-900">
                            {reportToView.comment?.user?.fullname || "Thông tin người dùng"}
                          </p>
                          {reportToView.comment?.user?.email && (
                            <p className="text-xs text-gray-500 mb-2">
                              {reportToView.comment.user.email}
                            </p>
                          )}
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">{reportToView.comment?.content || "Không có nội dung"}</p>
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-2">
                            {reportToView.comment?.createdAt && formatDate(reportToView.comment.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      {reportToView.comment && (
                        <div className="mt-4">
                          <Link
                            href={`/admin/comments?highlight=${reportToView.comment?.id}`}
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Xem bình luận trong trang quản trị
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Không có thông tin chi tiết về nội dung bị báo cáo.</p>
                )}
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (reportToView) {
                  setViewDialogOpen(false)
                  setDeleteDialogOpen(true)
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa báo cáo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Report Form Dialog */}
      <div>
        <p className="hidden">Debug: reportToEdit={reportToEdit}, isEditDialogOpen={isEditDialogOpen.toString()}</p>
        {reportToEdit !== null && (
          <EditReportForm
            reportId={reportToEdit}
            isOpen={isEditDialogOpen}
            onClose={() => {
              console.log("EditReportForm onClose called")
              setIsEditDialogOpen(false)
              setReportToEdit(null)
            }}
            onSuccess={() => {
              console.log("EditReportForm onSuccess called")
              handleRefresh()
            }}
          />
        )}
      </div>
    </div>
  )
}
