"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Calendar, Mail, MapPin, Phone, User as UserIcon, FileText, MessageSquare } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

import { handleChangePasswordAdmin, handleUpdateProfile } from "@/src/thunks/user/userThunk"
import { selectUpdateProfileSuccess, selectUpdateProfileError } from "@/src/thunks/user/userSlice"
import type { User } from "@/src/thunks/auth/authSlice"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { handleGetProfile } from "@/src/thunks/auth/authThunk"

export default function AuthorProfilePage() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector(selectCurrentUser)
  const updateSuccess = useSelector(selectUpdateProfileSuccess)
  const updateError = useSelector(selectUpdateProfileError)

  // Fetch user data when component mounts
  useEffect(() => {
    dispatch(handleGetProfile() as any)
  }, [dispatch])

  // Handle profile update success/error
  useEffect(() => {
    if (updateSuccess) {
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin thành công"
      })
    }
    if (updateError) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: updateError
      })
    }
  }, [updateSuccess, updateError, toast])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.target as HTMLFormElement
    const email = user?.email || ""
    const oldPassword = form.currentPassword.value
    const newPassword = form.newPassword.value
    const confirmPassword = form.confirmPassword.value

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mật khẩu mới không khớp"
      })
      setIsLoading(false)
      return
    }

    try {
      const resultAction = await dispatch(handleChangePasswordAdmin({
        email,
        oldPassword,
        newPassword
      }) as any)

      if (handleChangePasswordAdmin.fulfilled.match(resultAction)) {
        toast({
          title: "Thành công",
          description: "Đổi mật khẩu thành công"
        })
        form.reset()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: resultAction.payload as string
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đổi mật khẩu"
      })
    }

    setIsLoading(false)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const form = e.target as HTMLFormElement
    const firstName = form.firstName.value
    const lastName = form.lastName.value
    const phone = form.phone.value
    const address = form.address.value
    const bio = form.bio.value

    dispatch(handleUpdateProfile({
      id: user.id,
      fullname: `${lastName} ${firstName}`,
      phone,
      address,
      bio
    }) as any)
  }




  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <Card className="flex-1">
          <CardHeader className="relative pb-0">
            <div className="h-32 w-full bg-gradient-to-r from-red-500 to-red-700 rounded-t-lg"></div>
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={user.avatar || "/placeholder.svg?height=96&width=96"}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-16 text-center">
            <CardTitle>{user.fullname}</CardTitle>
            <CardDescription>{user.bio || "No bio available"}</CardDescription>
            <div className="flex justify-center mt-4 space-x-2">
              <Button variant="outline" size="sm">
                Chỉnh sửa hồ sơ
              </Button>
              <Button variant="outline" size="sm">
                Đổi mật khẩu
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.address || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Tham gia từ: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Chưa có thông tin"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Form */}
        <div className="flex-[2]">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="account">Tài khoản</TabsTrigger>
              <TabsTrigger value="preferences">Tùy chọn</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Tên</Label>
                        <Input id="firstName" defaultValue={user.fullname.split(" ").slice(-1)[0]} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Họ</Label>
                        <Input id="lastName" defaultValue={user.fullname.split(" ").slice(0, -1).join(" ")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" type="tel" defaultValue={user.phone || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input id="address" defaultValue={user.address || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Tiểu sử</Label>
                      <Textarea
                        id="bio"
                        defaultValue={user.bio || ""}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="account" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>Cập nhật thông tin đăng nhập của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={user.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                      <Input id="currentPassword" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input id="newPassword" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                      <Input id="confirmPassword" type="password" required />
                    </div>
                    <CardFooter className="flex justify-end px-0">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tùy chọn</CardTitle>
                  <CardDescription>Quản lý tùy chọn thông báo và hiển thị</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Thông báo email</p>
                        <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Thông báo trên trang web</p>
                        <p className="text-sm text-muted-foreground">Hiển thị thông báo trên trang web</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Thông báo bình luận mới</p>
                        <p className="text-sm text-muted-foreground">Nhận thông báo khi có bình luận mới</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Lưu tùy chọn</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng số bài viết</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <UserIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lượt xem</p>
                <p className="text-2xl font-bold">12.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bình luận</p>
                <p className="text-2xl font-bold">328</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bài viết tháng này</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
