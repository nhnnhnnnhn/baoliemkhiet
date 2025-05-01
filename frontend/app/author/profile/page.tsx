"use client"

import { Calendar, Mail, MapPin, Phone, User, FileText, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/src/store"
import { handleChangePassword, handleLogout } from "@/src/thunks/auth/authThunk"
import { selectChangingPassword, selectChangePasswordError, selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function AuthorProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const isChangingPassword = useSelector(selectChangingPassword);
  const changePasswordError = useSelector(selectChangePasswordError);
  const user = useSelector(selectCurrentUser);
  const { toast } = useToast();
  
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
                  src="/placeholder.svg?height=96&width=96"
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-16 text-center">
            <CardTitle>Trần Văn B</CardTitle>
            <CardDescription>Nhà báo chuyên mục Thể thao</CardDescription>
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
                <span>tranvanb@baolk.vn</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>0987654321</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Hà Nội, Việt Nam</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Tham gia từ: 01/01/2023</span>
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Tên</Label>
                      <Input id="firstName" defaultValue="Văn B" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Họ</Label>
                      <Input id="lastName" defaultValue="Trần" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="tranvanb@baolk.vn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" defaultValue="0987654321" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input id="address" defaultValue="Hà Nội, Việt Nam" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Tiểu sử</Label>
                    <Textarea
                      id="bio"
                      defaultValue="Nhà báo chuyên mục Thể thao với hơn 5 năm kinh nghiệm. Chuyên viết về bóng đá và các môn thể thao phổ biến tại Việt Nam."
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Lưu thay đổi</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="account" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>Cập nhật thông tin đăng nhập của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gmail">Gmail</Label>
                    <Input id="gmail" defaultValue="tranvanb@gmail.com" />
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
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
                      // Sử dụng email của người dùng từ trạng thái Redux
                      const email = user?.email || '';
                      
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
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                      <Input 
                        id="oldPassword" 
                        name="oldPassword"
                        type="password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input 
                        id="newPassword" 
                        name="newPassword"
                        type="password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                      <Input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    {changePasswordError && (
                      <div className="mt-2 text-red-500 text-sm">
                        {changePasswordError}
                      </div>
                    )}
                    
                    <CardFooter className="flex justify-end px-0 pt-4">
                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
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
                <User className="h-6 w-6 text-green-600" />
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
