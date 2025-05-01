"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/src/store"
import { handleChangePassword, handleLogout } from "@/src/thunks/auth/authThunk"
import { selectChangingPassword, selectChangePasswordError } from "@/src/thunks/auth/authSlice"
import { Calendar, CheckCircle, Save, Upload, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import styles from "../admin.module.css"

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const isChangingPassword = useSelector(selectChangingPassword);
  const changePasswordError = useSelector(selectChangePasswordError);
  const { toast } = useToast();
  
  // Mock user data
  const [user, setUser] = useState({
    id: "USR-001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0912345678",
    address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    role: "Quản trị viên",
    accountType: "Premium",
    status: "Hoạt động",
    created: "05/04/2025",
    lastLogin: "06/04/2025 15:30",
    bio: "Quản trị viên với hơn 5 năm kinh nghiệm trong lĩnh vực báo chí. Chuyên về quản lý nội dung và phát triển đội ngũ biên tập.",
    avatar: "/placeholder.svg?height=200&width=200",
  })

  // State for form values
  const [formValues, setFormValues] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    bio: user.bio,
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Update user data (in a real app, this would be an API call)
    setUser((prev) => ({
      ...prev,
      ...formValues,
    }))
    alert("Thông tin hồ sơ đã được cập nhật!")
  }

  // Handle avatar change
  const handleAvatarChange = () => {
    // In a real app, this would open a file picker and upload the image
    alert("Tính năng thay đổi ảnh đại diện sẽ được triển khai sau!")
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Hồ sơ cá nhân</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Hồ sơ cá nhân</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Thông tin tài khoản</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <button
                    onClick={handleAvatarChange}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                  {user.role}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">ID người dùng</div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    {user.id}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Loại tài khoản</div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.accountType}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Trạng thái</div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Ngày tạo tài khoản</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {user.created}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Đăng nhập gần nhất</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {user.lastLogin}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="md:col-span-2">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Chỉnh sửa thông tin</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" name="name" value={formValues.name} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" name="phone" value={formValues.phone} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formValues.address}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formValues.bio}
                    onChange={handleChange}
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Settings */}
          <div className={styles.chartCard + " mt-6"}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Bảo mật</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get('email') as string;
                  const oldPassword = formData.get('oldPassword') as string;
                  const newPassword = formData.get('newPassword') as string;
                  const confirmPassword = formData.get('confirmPassword') as string;

                  if (newPassword !== confirmPassword) {
                    toast({
                      title: "Lỗi",
                      description: "Mật khẩu xác nhận không khớp",
                      variant: "destructive"
                    });
                    return;
                  }

                  try {
                    await dispatch(handleChangePassword({ email, oldPassword, newPassword })).unwrap();
                    
                    // Hiển thị toast thông báo thành công
                    toast({
                      title: "Đổi mật khẩu thành công",
                      description: "Bạn sẽ được đăng xuất trong giây lát",
                      variant: "success",
                      duration: 3000,
                    });
                    
                    // Đặt timeout để tự động đăng xuất sau 3 giây
                    setTimeout(() => {
                      dispatch(handleLogout());
                    }, 3000);
                    
                    // Reset form
                    e.currentTarget.reset();
                    
                  } catch (error) {
                    // Error will be shown through changePasswordError
                  }
                }}>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="mt-1"
                      placeholder="Nhập email của bạn"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                    <Input
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      className="mt-1"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        className="mt-1"
                        placeholder="Nhập mật khẩu mới"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="mt-1"
                        placeholder="Nhập lại mật khẩu mới"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  {changePasswordError && (
                    <div className="mt-2 text-red-500 text-sm">
                      {changePasswordError}
                    </div>
                  )}
                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        const form = document.querySelector('form') as HTMLFormElement;
                        form?.reset();
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
