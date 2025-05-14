"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Edit } from "lucide-react"

interface EditButtonProps {
  reportId: number
  openEditDialog: (id: number) => void
}

export function EditReportMenuItem({ reportId, openEditDialog }: EditButtonProps) {
  console.log("EditReportMenuItem rendered", { reportId })
  
  const handleClick = () => {
    console.log("EditReportMenuItem clicked", { reportId })
    openEditDialog(reportId)
  }
  
  return (
    <DropdownMenuItem onClick={handleClick}>
      <Edit className="h-4 w-4 mr-2" />
      Chỉnh sửa báo cáo
    </DropdownMenuItem>
  )
} 