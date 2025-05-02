'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import styles from "../../admin.module.css"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleCreateUser } from "@/src/thunks/user/userThunk"

export default function AddUserPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.user)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "",
    status: "",
    bio: ""
  })

  const handleChange = (field: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target?.value
    }))
  }

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
      })
      return
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      fullname: formData.fullname,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      role: formData.role || undefined,
      status: formData.status || undefined,
      bio: formData.bio || undefined
    }

    try {
      const resultAction = await dispatch(handleCreateUser(userData))
      if (handleCreateUser.fulfilled.match(resultAction)) {
        toast({
          description: "Tạo người dùng thành công",
        })
        router.push("/admin/users")
      } else if (handleCreateUser.rejected.match(resultAction)) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: resultAction.payload as string,
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo người dùng",
      })
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className={styles.pageTitle}>Thêm người dùng mới</h1>
            <div className={styles.pageBreadcrumb}>
              <div className={styles.breadcrumbItem}>Trang chủ</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Người dùng</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Thêm mới</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Thông tin người dùng</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input 
                    id="name"
                    value={formData.fullname}
                    onChange={handleChange('fullname')}
                    placeholder="Nhập họ và tên" 
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="Nhập địa chỉ email" 
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="Nhập mật khẩu" 
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    placeholder="Nhập lại mật khẩu" 
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input 
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    placeholder="Nhập số điện thoại" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input 
                    id="address"
                    value={formData.address}
                    onChange={handleChange('address')}
                    placeholder="Nhập địa chỉ" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Vai trò</Label>
                  <Select value={formData.role} onValueChange={handleSelectChange('role')}>
                    <SelectTrigger id="role" className="mt-1">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EDITOR">Biên tập viên</SelectItem>
                      <SelectItem value="JOURNALIST">Tác giả</SelectItem>
                      <SelectItem value="USER">Người dùng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={handleSelectChange('status')}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                      <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <Label htmlFor="bio">Giới thiệu</Label>
              <Textarea 
                id="bio"
                value={formData.bio}
                onChange={handleChange('bio')}
                placeholder="Nhập thông tin giới thiệu" 
                className="mt-1" 
                rows={4} 
              />
            </div>
            <div className="flex justify-end">
              <Link href="/admin/users">
                <Button type="button" variant="outline" className="mr-2">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
