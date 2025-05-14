"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/src/store"
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
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import EditReportForm from "@/components/EditReportForm"
import { 
  Edit, 
  Trash2, 
  RefreshCw
} from "lucide-react"

// This is an example page showing how to use the report editing functionality
export default function ReportEditExample() {
  const dispatch = useAppDispatch()
  
  // Redux selectors
  const reports = useAppSelector(selectReports)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const deleteSuccess = useAppSelector(selectDeleteReportSuccess)
  
  // Local state
  const [selectedReports, setSelectedReports] = useState<number[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<number | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [reportToEdit, setReportToEdit] = useState<number | null>(null)
  
  // Fetch reports on component mount
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
      setIsDeleteDialogOpen(false)
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
  
  // Open delete dialog
  const handleOpenDeleteDialog = (reportId: number) => {
    setReportToDelete(reportId)
    setIsDeleteDialogOpen(true)
  }
  
  // Open edit dialog
  const handleOpenEditDialog = (reportId: number) => {
    setReportToEdit(reportId)
    setIsEditDialogOpen(true)
  }
  
  // Delete report
  const handleConfirmDelete = () => {
    if (reportToDelete !== null) {
      dispatch(handleDeleteReport(reportToDelete))
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý báo cáo</h1>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Đang tải...
                    </div>
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Không có dữ liệu báo cáo
                  </TableCell>
                </TableRow>
              ) : (
                reports.map(report => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>{report.reportedByUser?.fullname || "Không xác định"}</TableCell>
                    <TableCell>
                      {report.articleId ? "Bài viết" : "Bình luận"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={report.reason}>
                      {report.reason}
                    </TableCell>
                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(report.id)}
                          title="Chỉnh sửa báo cáo"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(report.id)}
                          title="Xóa báo cáo"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa báo cáo</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa báo cáo này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? "Đang xóa..." : "Xóa báo cáo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Report Form Dialog */}
      {reportToEdit && (
        <EditReportForm
          reportId={reportToEdit}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setReportToEdit(null)
          }}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  )
} 