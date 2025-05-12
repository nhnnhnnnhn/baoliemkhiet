"use client"

import { useState, useEffect } from "react"
import { Calendar, Save, Upload, User } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"

import { AppDispatch } from "@/src/store"
import { handleChangePassword, handleLogout, handleGetProfile } from "@/src/thunks/auth/authThunk"
import { handleUpdateProfile } from "@/src/thunks/user/userThunk"
import { selectCurrentUser, selectChangingPassword, selectChangePasswordError } from "@/src/thunks/auth/authSlice"
import { selectIsUpdatingProfile, selectUpdateProfileError, selectUpdateProfileSuccess } from "@/src/thunks/user/userSlice"

export default function UserProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const currentUser = useSelector(selectCurrentUser)
  const isChangingPassword = useSelector(selectChangingPassword)
  const changePasswordError = useSelector(selectChangePasswordError)
  const isUpdatingProfile = useSelector(selectIsUpdatingProfile)
  const updateProfileError = useSelector(selectUpdateProfileError)
  const updateProfileSuccess = useSelector(selectUpdateProfileSuccess)

  useEffect(() => {
    dispatch(handleGetProfile() as any)
  }, [dispatch])

  // Initialize form values from currentUser
  const [formValues, setFormValues] = useState({
    fullname: currentUser?.fullname || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    bio: currentUser?.bio || "",
  })

  // Update form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormValues({
        fullname: currentUser.fullname || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        bio: currentUser.bio || "",
      })
    }
  }, [currentUser])

  // State for password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

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

      setTimeout(() => {
        toast({
          title: "Thông báo",
          description: "Đăng xuất trong 3 giây...",
          className: "bg-blue-50 border-blue-200 text-blue-900",
          duration: 3000,
        })
      }, 2500)

      setTimeout(() => {
        dispatch(handleLogout())
      }, 4000)
    }
  }

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
    if (!currentUser?.id) return

    const result = await dispatch(handleUpdateProfile({
      id: currentUser.id,
      ...formValues
    }))

    if (handleUpdateProfile.fulfilled.match(result)) {
      toast({
        title: "Thành công!",
        description: "Cập nhật thông tin thành công",
        variant: "success",
        className: "font-semibold",
        duration: 2000
      })
    }
  }

  // Handle avatar change
  const handleAvatarChange = () => {
    alert("Tính năng thay đổi ảnh đại diện sẽ được triển khai sau!")
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SiteHeader variant="solid" />
      <div className="bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold tracking-tight">Hồ sơ của bạn</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="relative pb-0">
              <div className="h-32 w-full bg-gradient-to-r from-primary/80 to-primary rounded-lg"></div>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <img
                    src={currentUser.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-20 px-6 text-center">
              <h2 className="text-2xl font-semibold">{currentUser.fullname}</h2>
              <p className="text-muted-foreground text-sm mt-1">{currentUser.email}</p>
              <Separator className="my-6" />
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Trạng thái</div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      currentUser.is_online
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {currentUser.is_online ? "Trực tuyến" : "Ngoại tuyến"}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Ngày tham gia</div>
                    <div className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      {new Date(currentUser.created_at || "").toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Edit Profile */}
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md">
                  <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                  <TabsTrigger value="security">Bảo mật</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-6">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader>
                      <CardTitle>Thông tin cá nhân</CardTitle>
                      <CardDescription>
                        Cập nhật thông tin cá nhân của bạn
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                      <CardContent className="space-y-6 px-0">
                        {updateProfileError && (
                          <div className="text-sm text-red-500">{updateProfileError}</div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullname">Họ và tên</Label>
                            <Input id="fullname" name="fullname" value={formValues.fullname} onChange={handleChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formValues.email}
                              onChange={handleChange}
                              disabled
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input id="phone" name="phone" value={formValues.phone} onChange={handleChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input id="address" name="address" value={formValues.address} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Giới thiệu</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formValues.bio}
                            onChange={handleChange}
                            rows={4}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-4 px-0 pt-4">
                        <Button variant="outline" type="reset" className="hover:bg-muted/60">
                          Hủy
                        </Button>
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
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
                <TabsContent value="security" className="mt-6">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader>
                      <CardTitle>Bảo mật</CardTitle>
                      <CardDescription>
                        Thay đổi mật khẩu của bạn
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 px-0">
                      {changePasswordError && (
                        <div className="text-sm text-red-500">{changePasswordError}</div>
                      )}
                      <div className="space-y-2">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
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
                        <div className="space-y-2">
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
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 px-0 pt-4">
                      <Button
                        variant="outline"
                        className="hover:bg-muted/60"
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
                      >
                        {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}