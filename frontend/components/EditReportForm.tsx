"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { 
  handleEditReport, 
  handleGetReportById 
} from "@/src/thunks/report/reportThunk"
import { 
  selectSelectedReport, 
  selectIsEditingReport, 
  selectEditReportError, 
  selectEditReportSuccess,
  clearEditReportState
} from "@/src/thunks/report/reportSlice"
import { Report } from "@/src/apis/report"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface EditReportFormProps {
  reportId: number
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Danh sách các lý do báo cáo cố định
const REPORT_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Quấy rối" },
  { value: "hate_speech", label: "Ngôn từ thù ghét" },
  { value: "misinformation", label: "Thông tin sai lệch" },
  { value: "inappropriate", label: "Nội dung không phù hợp" },
  { value: "violence", label: "Bạo lực" },
  { value: "copyright", label: "Vi phạm bản quyền" },
  { value: "personal_information", label: "Tiết lộ thông tin cá nhân" },
  { value: "other", label: "Lý do khác" },
]

export default function EditReportForm({ 
  reportId, 
  isOpen, 
  onClose,
  onSuccess 
}: EditReportFormProps) {
  const dispatch = useAppDispatch()
  
  console.log("EditReportForm rendered", { reportId, isOpen })
  
  // Redux selectors
  const report = useAppSelector(selectSelectedReport)
  const isLoading = useAppSelector(selectIsEditingReport)
  const error = useAppSelector(selectEditReportError)
  const success = useAppSelector(selectEditReportSuccess)
  
  // Local state
  const [reason, setReason] = useState("")
  const [reasonType, setReasonType] = useState<string>("other")
  const [customReason, setCustomReason] = useState("")
  
  // Fetch the report data when the form opens
  useEffect(() => {
    if (isOpen && reportId) {
      console.log("Fetching report data", reportId)
      dispatch(handleGetReportById(reportId))
    }
  }, [dispatch, isOpen, reportId])
  
  // Update local state when report is loaded
  useEffect(() => {
    console.log("Report loaded", report)
    if (report) {
      // Kiểm tra xem lý do báo cáo có thuộc các loại cố định không
      const foundReason = REPORT_REASONS.find(r => 
        r.value === report.reason.toLowerCase() || 
        r.label === report.reason
      )
      
      if (foundReason) {
        setReasonType(foundReason.value)
        setCustomReason("")
      } else {
        setReasonType("other")
        setCustomReason(report.reason)
      }
      
      setReason(report.reason)
    }
  }, [report])
  
  // Cập nhật reason khi reasonType hoặc customReason thay đổi
  useEffect(() => {
    if (reasonType === "other") {
      setReason(customReason)
    } else {
      const selectedReason = REPORT_REASONS.find(r => r.value === reasonType)
      setReason(selectedReason?.label || "")
    }
  }, [reasonType, customReason])
  
  // Handle success and error states
  useEffect(() => {
    if (success) {
      toast({
        title: "Thành công",
        description: "Đã cập nhật báo cáo thành công",
        variant: "success"
      })
      dispatch(clearEditReportState())
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    }
    
    if (error) {
      toast({
        title: "Lỗi",
        description: error,
        variant: "destructive"
      })
      dispatch(clearEditReportState())
    }
  }, [success, error, dispatch, onClose, onSuccess])
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reportId || !reason.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do báo cáo",
        variant: "destructive"
      })
      return
    }
    
    dispatch(handleEditReport({ id: reportId, reason }))
  }
  
  // Clean up when dialog closes
  const handleDialogClose = () => {
    dispatch(clearEditReportState())
    onClose()
  }
  
  return (
    <>
      {/* Force dialog to be open */}
      <Dialog open={true} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa báo cáo #{reportId}</DialogTitle>
            <DialogDescription>
              Cập nhật lý do báo cáo. Nhấn lưu khi bạn hoàn tất.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reasonType">Loại lý do báo cáo</Label>
                <Select
                  value={reasonType}
                  onValueChange={setReasonType}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lý do báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {reasonType === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="customReason">Lý do khác</Label>
                  <Textarea
                    id="customReason"
                    placeholder="Nhập lý do báo cáo cụ thể..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows={3}
                    required
                    className="resize-none"
                    disabled={isLoading}
                  />
                </div>
              )}
              
              {/* Hiển thị lý do đã chọn */}
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-muted-foreground">Lý do báo cáo:</p>
                  <p className="text-base font-medium mt-1">{reason}</p>
                </CardContent>
              </Card>
              
              {/* Display information about the reported content */}
              {report && (
                <div className="space-y-2 p-4 bg-slate-50 rounded-md">
                  <p className="text-sm font-medium">Thông tin báo cáo:</p>
                  <p className="text-sm">
                    <span className="font-medium">Người báo cáo:</span>{" "}
                    {report.reportedByUser?.fullname}
                  </p>
                  {report.article && (
                    <p className="text-sm">
                      <span className="font-medium">Bài viết:</span>{" "}
                      {report.article.title}
                    </p>
                  )}
                  {report.comment && (
                    <p className="text-sm">
                      <span className="font-medium">Bình luận:</span>{" "}
                      {report.comment.content.substring(0, 50)}
                      {report.comment.content.length > 50 ? "..." : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDialogClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !reason.trim() || (reasonType === "other" && !customReason.trim())}
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
} 