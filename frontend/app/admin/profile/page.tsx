"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Calendar, Save, Upload, User } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useToast } from "@/hooks/use-toast"
import fileApi from '@/src/apis/file'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import styles from "../admin.module.css"

import { AppDispatch } from "@/src/store"
import { handleChangePassword, handleLogout, handleGetProfile } from "@/src/thunks/auth/authThunk"
import { handleUpdateProfile } from "@/src/thunks/auth/authThunk"
import { selectCurrentUser, selectChangingPassword, selectChangePasswordError } from "@/src/thunks/auth/authSlice"
import { selectIsUpdatingProfile, selectUpdateProfileError, selectUpdateProfileSuccess } from "@/src/thunks/user/userSlice"

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const currentUser = useSelector(selectCurrentUser)
  const isChangingPassword = useSelector(selectChangingPassword)
  const changePasswordError = useSelector(selectChangePasswordError)
  const isUpdatingProfile = useSelector(selectIsUpdatingProfile)
  const updateProfileError = useSelector(selectUpdateProfileError)
  const updateProfileSuccess = useSelector(selectUpdateProfileSuccess)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = async () => {
    if (!currentUser?.email) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
        variant: "destructive",
        duration: 3000
      })
      return
    }

    // Validate passwords
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
        duration: 3000
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới không khớp",
        variant: "destructive",
        duration: 3000
      })
      return
    }

    const result = await dispatch(handleChangePassword({
      email: currentUser.email,
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    }))

    if (handleChangePassword.fulfilled.match(result)) {
      // Show success toast with new variant
      toast({
        title: "Thành công!",
        description: "Đổi mật khẩu thành công",
        variant: "success",
        duration: 2000,
      })

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })

      // Show warning toast with blue styling
      setTimeout(() => {
        toast({
          title: "Thông báo",
          description: "Đăng xuất trong 3 giây...",
          className: "bg-blue-50 border-blue-200 text-blue-900",
          duration: 3000,
        })
      }, 2500)

      // Logout after warning
      setTimeout(() => {
        dispatch(handleLogout())
      }, 4000)
    }
  }
  // Initialize form values from currentUser
  const [formValues, setFormValues] = useState({
    fullname: currentUser?.fullname || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    bio: currentUser?.bio || "",
    avatar: currentUser?.avatar || "",
  })

  useEffect(() => {
    if (currentUser) {
      setFormValues({
        fullname: currentUser.fullname || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        bio: currentUser.bio || "",
        avatar: currentUser.avatar || "",
      })
    }
  }, [currentUser])


  // State for password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await dispatch(handleUpdateProfile({
      fullname: formValues.fullname,
      email: formValues.email,
      phone: formValues.phone,
      address: formValues.address,
      bio: formValues.bio,
      avatar: formValues.avatar
    }))

    if (handleUpdateProfile.fulfilled.match(result)) {
      toast({
        title: "Thành công!",
        description: "Cập nhật thông tin thành công",
        variant: "success",
        className: "font-semibold",
        duration: 2000
      })
      // Refresh profile after update
      const profileAction = await dispatch(handleGetProfile() as any);
      // Cập nhật formValues bằng dữ liệu mới nhất từ currentUser
      if (handleGetProfile.fulfilled.match(profileAction)) {
        const updated = profileAction.payload.data || profileAction.payload;
        setFormValues({
          fullname: updated.fullname || "",
          email: updated.email || "",
          phone: updated.phone || "",
          address: updated.address || "",
          bio: updated.bio || "",
          avatar: updated.avatar || "",
        });
      }
    }
  }

  // Handle avatar change
  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Chỉ chấp nhận file ảnh",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    try {
      // Upload file
      const response = await fileApi.uploadFile(file);
      console.log('File upload response:', response);

      if (response.success && response.file) {
        // Lấy trực tiếp URL trả về từ backend
        const avatarUrl = response.file.url;
        // Update profile với avatar là URL
        const updateResult = await dispatch(handleUpdateProfile({
          avatar: avatarUrl
        }));

        if (handleUpdateProfile.fulfilled.match(updateResult)) {
          // Cập nhật luôn state formValues.avatar để hiển thị ngay
          setFormValues((prev) => ({
            ...prev,
            avatar: avatarUrl
          }));
          // Force refresh profile
          const profileResult = await dispatch(handleGetProfile() as any);
          if (handleGetProfile.fulfilled.match(profileResult)) {
            toast({
              title: "Thành công",
              description: "Cập nhật ảnh đại diện thành công",
              variant: "success",
              duration: 2000
            });
          }
        } else {
          throw new Error('Failed to update profile');
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật ảnh đại diện. Vui lòng thử lại",
        variant: "destructive",
        duration: 3000
      });
    }
  }

  // Helper function to get full image URL
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith('http')) return path;
    
    // Backend returns path like "images/filename"
    // Need to construct full URL: http://localhost:3000/images/filename
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}/${cleanPath}`;
  };

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
                    src={formValues.avatar || currentUser?.avatar || "/placeholder.svg"}
                    alt={currentUser?.fullname}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <button
                    onClick={handleAvatarChange}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <h2 className="text-xl font-semibold">{currentUser?.fullname}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                  {currentUser?.role}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">ID người dùng</div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    {currentUser?.id}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Loại tài khoản</div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {currentUser?.role}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Trạng thái</div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {currentUser?.is_online ? "Trực tuyến" : "Ngoại tuyến"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</div>
                  <div>{currentUser?.phone || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</div>
                  <div>{currentUser?.address || "-"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Giới thiệu</div>
                  <div>{currentUser?.bio || "-"}</div>
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
                {updateProfileError && (
                  <div className="text-sm text-red-500 mb-4">{updateProfileError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="fullname">Họ và tên</Label>
                    <Input id="fullname" name="fullname" value={formValues.fullname} onChange={handleChange} className="mt-1" />
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
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? (
                      <span>Đang xử lý...</span>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Settings */}
          {changePasswordError && (
            <div className="text-sm text-red-500 mb-4">{changePasswordError}</div>
          )}
          <div className={styles.chartCard + " mt-6"}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Bảo mật</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="mt-1"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="mt-1"
                      placeholder="Nhập mật khẩu mới"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="mt-1"
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      })
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                    type="button"
                  >
                    {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
