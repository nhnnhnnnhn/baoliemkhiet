"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import EditReportForm from "@/components/EditReportForm"

export default function TestEditReport() {
  const [isOpen, setIsOpen] = useState(false)
  const [reportId, setReportId] = useState(0)
  
  const handleOpenDialog = (id: number) => {
    setReportId(id)
    setIsOpen(true)
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Kiểm tra form chỉnh sửa báo cáo</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-medium mb-2">Báo cáo ID: 1</h2>
          <Button onClick={() => handleOpenDialog(1)}>
            Chỉnh sửa báo cáo
          </Button>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-lg font-medium mb-2">Báo cáo ID: 2</h2>
          <Button onClick={() => handleOpenDialog(2)}>
            Chỉnh sửa báo cáo
          </Button>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-lg font-medium mb-2">Báo cáo ID: 3</h2>
          <Button onClick={() => handleOpenDialog(3)}>
            Chỉnh sửa báo cáo
          </Button>
        </div>
      </div>
      
      {reportId > 0 && (
        <EditReportForm
          reportId={reportId}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            setReportId(0)
          }}
          onSuccess={() => {
            console.log("Cập nhật thành công")
          }}
        />
      )}
    </div>
  )
} 