"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import styles from "../../../admin.module.css"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetUserById, handleUpdateProfile } from "@/src/thunks/user/userThunk"
import { selectIsLoading, selectSelectedUser, selectUpdateProfileError, selectUpdateProfileSuccess } from "@/src/thunks/user/userSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { User } from "@/src/apis/user"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectSelectedUser)
  const isLoading = useAppSelector(selectIsLoading)
  const updateSuccess = useAppSelector(selectUpdateProfileSuccess)
  const updateError = useAppSelector(selectUpdateProfileError)

  const [formData, setFormData] = useState<Partial<User>>({
    fullname: "",
    email: "",
    role: "USER",
    bio: "",
    phone: "",
    address: "",
    status: "ACTIVE"
  })

  useEffect(() => {
    dispatch(handleGetUserById(Number(params.id)))
  }, [dispatch, params.id])

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        role: user.role || "USER",
        bio: user.bio || "",
        phone: user.phone || "",
        address: user.address || "",
        status: user.status || "ACTIVE"
      })
    }
  }, [user])

  useEffect(() => {
    if (updateSuccess) {
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin người dùng đã được cập nhật thành công.",
        variant: "default",
      })
      router.push(`/admin/users/${params.id}`)
    }

    if (updateError) {
      toast({
        title: "Lỗi cập nhật",
        description: updateError,
        variant: "destructive",
      })
    }
  }, [updateSuccess, updateError, params.id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    // Xử lý dữ liệu trước khi gửi lên API
    // Chuyển đổi null thành undefined để tránh lỗi kiểu dữ liệu
    const payload = {
      id: user.id,
      fullname: formData.fullname,
      email: formData.email,
      role: formData.role,
      bio: formData.bio || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      status: formData.status
    }

    dispatch(handleUpdateProfile(payload))
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <Link href={`/admin/users/${params.id}`}>
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Chỉnh sửa người dùng</h1>
            <div className={styles.pageBreadcrumb}>
              <div className={styles.breadcrumbItem}>Trang chủ</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Người dùng</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <Link href={`/admin/users/${params.id}`} className={styles.breadcrumbItem}>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : user ? (
                  user.fullname
                ) : (
                  'Không tìm thấy'
                )}
              </Link>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Chỉnh sửa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isLoading ? (
        <div className={styles.tableCard}>
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      ) : !user ? (
        <div className="text-center p-8 text-gray-500">
          Không tìm thấy thông tin người dùng
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>Thông tin cơ bản</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input 
                    id="fullname" 
                    name="fullname" 
                    value={formData.fullname} 
                    onChange={handleInputChange}
                    placeholder="Họ và tên người dùng"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="Email người dùng"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Select 
                    value={formData.role as string} 
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                      <SelectItem value="EDITOR">Biên tập viên</SelectItem>
                      <SelectItem value="JOURNALIST">Nhà báo</SelectItem>
                      <SelectItem value="USER">Người dùng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={formData.status as string} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="BLOCKED">Bị chặn</SelectItem>
                      <SelectItem value="PENDING">Chưa xác thực</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tableCard + " mt-6"}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>Thông tin liên hệ</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone || ""} 
                    onChange={handleInputChange}
                    placeholder="Số điện thoại liên hệ"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address || ""} 
                    onChange={handleInputChange}
                    placeholder="Địa chỉ liên hệ"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Giới thiệu</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio || ""} 
                  onChange={handleInputChange}
                  placeholder="Thông tin giới thiệu về người dùng"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Link href={`/admin/users/${params.id}`}>
              <Button type="button" variant="outline">Hủy</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang lưu...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
