"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Calendar, Save, Upload, User, Eye, EyeOff } from "lucide-react"
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

  // State for form values
  const [formValues, setFormValues] = useState({
    fullname: currentUser?.fullname || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    bio: currentUser?.bio || "",
    avatar: currentUser?.avatar || "",
  })

  // Add validation state
  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // State for password visibility
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
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

  // Debug logs
  useEffect(() => {
    console.log('Current formValues:', formValues);
    console.log('Current user:', currentUser);
  }, [formValues, currentUser]);
  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Validate Vietnamese phone numbers
    const phoneRegex = /^(0|\+84)(\d{9,10})$/
    return phone === "" || phoneRegex.test(phone)
  }

  const validateFullname = (name: string): boolean => {
    return name.trim().length >= 2
  }

  const validateBio = (bio: string): boolean => {
    return bio.length <= 500
  }

  // Validate profile form
  const validateProfileForm = (): boolean => {
    const newErrors = {
      fullname: "",
      email: "",
      phone: "",
      address: "",
      bio: "",
      currentPassword: errors.currentPassword,
      newPassword: errors.newPassword,
      confirmPassword: errors.confirmPassword
    }
    
    let isValid = true
    
    if (!validateFullname(formValues.fullname)) {
      newErrors.fullname = "Họ và tên phải có ít nhất 2 ký tự"
      isValid = false
    }
    
    if (!validateEmail(formValues.email)) {
      newErrors.email = "Email không hợp lệ"
      isValid = false
    }
    
    if (!validatePhone(formValues.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
      isValid = false
    }
    
    if (!validateBio(formValues.bio)) {
      newErrors.bio = "Giới thiệu không được vượt quá 500 ký tự"
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }
  
  // Validate password form
  const validatePasswordForm = (): boolean => {
    const newErrors = {
      fullname: errors.fullname,
      email: errors.email,
      phone: errors.phone,
      address: errors.address,
      bio: errors.bio,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
    
    let isValid = true
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại"
      isValid = false
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới"
      isValid = false
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự"
      isValid = false
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
      isValid = false
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp"
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }

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
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }
  
  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateProfileForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin",
        variant: "destructive",
        duration: 3000
      })
      return
    }

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
      console.log('Starting file upload...', file);
      // Upload file
      const response = await fileApi.uploadFile(file);
      console.log('File upload response:', response);

      if (response.success && response.file) {
        // Lấy URL từ response
        const avatarUrl = response.file.url;
        console.log('Avatar URL from response:', avatarUrl);
        
        // Update profile với avatar là URL gốc từ backend
        console.log('Updating profile with avatar:', avatarUrl);
        const updateResult = await dispatch(handleUpdateProfile({
          avatar: avatarUrl
        }));
        console.log('Update profile result:', updateResult);

        if (handleUpdateProfile.fulfilled.match(updateResult)) {
          // Cập nhật state local
          setFormValues((prev) => {
            console.log('Updating formValues with new avatar:', avatarUrl);
            return {
              ...prev,
              avatar: avatarUrl
            };
          });
          
          // Force refresh profile
          console.log('Refreshing profile...');
          const profileResult = await dispatch(handleGetProfile() as any);
          console.log('Profile refresh result:', profileResult);
          
          if (handleGetProfile.fulfilled.match(profileResult)) {
            // Cập nhật lại formValues với dữ liệu mới từ profile
            const updatedUser = profileResult.payload.data;
            if (updatedUser) {
              console.log('Setting formValues from updated profile:', updatedUser);
              setFormValues({
                fullname: updatedUser.fullname || "",
                email: updatedUser.email || "",
                phone: updatedUser.phone || "",
                address: updatedUser.address || "",
                bio: updatedUser.bio || "",
                avatar: updatedUser.avatar || "",
              });
            }

            toast({
              title: "Thành công",
              description: "Cập nhật ảnh đại diện thành công",
              variant: "success",
              duration: 2000
            });
          } else {
            console.error('Profile refresh failed:', profileResult);
            throw new Error('Failed to refresh profile');
          }
        } else {
          console.error('Profile update failed:', updateResult);
          throw new Error('Failed to update profile');
        }
      } else {
        console.error('Upload response invalid:', response);
        throw new Error('Upload failed - invalid response');
      }
    } catch (error: any) {
      console.error('Error in handleFileChange:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật ảnh đại diện. Vui lòng thử lại",
        variant: "destructive",
        duration: 3000
      });
    }
  }

  // Helper function to get full image URL
  const getImageUrl = (path: string | null | undefined) => {
    console.log('getImageUrl input path:', path);
    if (!path) {
      console.log('No path provided, returning placeholder');
      return "/placeholder.svg";
    }
    if (path.startsWith('data:image')) {
      console.log('Path is base64 image data');
      return path;
    }
    if (path.startsWith('http')) {
      console.log('Path is already a full URL:', path);
      return path;
    }
    
    // For other paths, return placeholder
    console.log('Unknown path format, returning placeholder');
    return "/placeholder.svg";
  };

  // Handle password change submission
  const submitPasswordChange = async () => {
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
    if (!validatePasswordForm()) {
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
                    src={getImageUrl(formValues.avatar || currentUser?.avatar)}
                    alt={currentUser?.fullname}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      console.error('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAvatarChange();
                    }}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
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
                    <Label htmlFor="fullname">Họ và tên <span className="text-red-500">*</span></Label>
                    <Input 
                      id="fullname" 
                      name="fullname" 
                      value={formValues.fullname} 
                      onChange={handleChange} 
                      className={`mt-1 ${errors.fullname ? 'border-red-500' : ''}`} 
                    />
                    {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleChange}
                      className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formValues.phone} 
                      onChange={handleChange} 
                      className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`} 
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
                    className={`mt-1 ${errors.bio ? 'border-red-500' : ''}`}
                    rows={4}
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
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
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword.currentPassword ? "text" : "password"}
                      className={`mt-1 ${errors.currentPassword ? 'border-red-500' : ''}`}
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('currentPassword')}
                    >
                      {showPassword.currentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="newPassword">Mật khẩu mới <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword.newPassword ? "text" : "password"}
                        className={`mt-1 ${errors.newPassword ? 'border-red-500' : ''}`}
                        placeholder="Nhập mật khẩu mới"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('newPassword')}
                      >
                        {showPassword.newPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword.confirmPassword ? "text" : "password"}
                        className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Nhập lại mật khẩu mới"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                      >
                        {showPassword.confirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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
                      // Clear password errors
                      setErrors({
                        ...errors,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      })
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={submitPasswordChange}
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
