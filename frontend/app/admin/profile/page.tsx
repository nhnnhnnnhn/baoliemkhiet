"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetProfile, handleUpdateProfile, handleChangePassword, handleLogout } from "@/src/thunks/auth/authThunk"
import { selectCurrentUser, selectChangingPassword, selectChangePasswordError, selectUpdatingProfile } from "@/src/thunks/auth/authSlice"
import { Calendar, Upload, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import styles from "../admin.module.css"

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isChangingPassword = useAppSelector(selectChangingPassword);
  const isUpdatingProfile = useAppSelector(selectUpdatingProfile);
  const changePasswordError = useAppSelector(selectChangePasswordError);
  const { toast } = useToast();

  // Form state
  const [formValues, setFormValues] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // Load user data
  useEffect(() => {
    dispatch(handleGetProfile());
  }, [dispatch]);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormValues({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(handleUpdateProfile(formValues)).unwrap();
      toast({
        description: "Cập nhật thông tin thành công",
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString("vi-VN") : "N/A";
  const lastLogin = user.last_login ? new Date(user.last_login).toLocaleDateString("vi-VN", {
    hour: '2-digit',
    minute: '2-digit'
  }) : "N/A";

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
                    alt={user.fullname}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>
                <h2 className="text-xl font-semibold">{user.fullname}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                  {user.role === 'ADMIN' ? 'Quản trị viên' : 
                   user.role === 'EDITOR' ? 'Biên tập viên' : 
                   user.role === 'JOURNALIST' ? 'Nhà báo' : 'Người dùng'}
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
                  <div className="text-sm font-medium text-gray-500 mb-1">Trạng thái</div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status || "Hoạt động"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Ngày tạo tài khoản</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {joinDate}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Đăng nhập gần nhất</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {lastLogin}
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
                    <Label htmlFor="fullname">Họ và tên</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={formValues.fullname}
                      onChange={handleChange}
                      className="mt-1"
                    />
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
                    <Input
                      id="phone"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleChange}
                      className="mt-1"
                    />
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
                    {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
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
                  const email = user.email;
                  const oldPassword = formData.get('oldPassword') as string;
                  const newPassword = formData.get('newPassword') as string;
                  const confirmPassword = formData.get('confirmPassword') as string;

                  if (newPassword !== confirmPassword) {
                    toast({
                      title: "Lỗi",
                      description: "Mật khẩu xác nhận không khớp",
                      variant: "destructive",
                    });
                    return;
                  }

                  try {
                    await dispatch(handleChangePassword({ email, oldPassword, newPassword })).unwrap();
                    toast({
                      title: "Đổi mật khẩu thành công",
                      description: "Bạn sẽ được đăng xuất trong giây lát",
                      duration: 3000,
                    });
                    setTimeout(() => {
                      dispatch(handleLogout());
                    }, 3000);
                    e.currentTarget.reset();
                  } catch (error) {
                    // Error will be shown through changePasswordError
                  }
                }}>
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
                    <Button type="submit" disabled={isChangingPassword}>
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
  );
}
