"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/src/store"
import { handleChangePassword, handleLogout } from "@/src/thunks/auth/authThunk"
import { selectChangingPassword, selectChangePasswordError } from "@/src/thunks/auth/authSlice"
import { Bell, Globe, Lock, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function AuthorSettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const isChangingPassword = useSelector(selectChangingPassword);
  const changePasswordError = useSelector(selectChangePasswordError);
  const { toast } = useToast();
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp với mật khẩu mới",
        variant: "destructive"
      });
      return;
    }

    try {
      await dispatch(handleChangePassword({
        email: passwordFormData.email,
        oldPassword: passwordFormData.oldPassword,
        newPassword: passwordFormData.newPassword
      })).unwrap();
      
      setShowChangePasswordDialog(false);
      setPasswordFormData({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      // Hiển thị toast thông báo thành công
      toast({
        title: "Đổi mật khẩu thành công",
        description: "Bạn sẽ được đăng xuất trong giây lát",
        variant: "success",
        duration: 3000,
      });
      
      // Tự động đăng xuất sau 3 giây
      setTimeout(() => {
        dispatch(handleLogout());
      }, 3000);
      
    } catch (error) {
      // Error will be shown through changePasswordError
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-muted-foreground">Quản lý cài đặt tài khoản và tùy chọn của bạn.</p>
      </div>
      <Separator />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            Chung
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Sun className="h-4 w-4 mr-2" />
            Giao diện
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Bảo mật
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>Cài đặt chung cho tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Ngôn ngữ</Label>
                <Select defaultValue="vi">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Chọn ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">Tiếng Anh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Múi giờ</Label>
                <Select defaultValue="asia_ho_chi_minh">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Chọn múi giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia_ho_chi_minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                    <SelectItem value="asia_bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                    <SelectItem value="america_new_york">America/New_York (GMT-4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Tự động lưu bài viết</Label>
                  <p className="text-sm text-muted-foreground">Tự động lưu bài viết khi đang soạn thảo</p>
                </div>
                <Switch id="auto-save" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>Tùy chỉnh giao diện người dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chế độ hiển thị</Label>
                <RadioGroup defaultValue="light" className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <Label
                      htmlFor="light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <Sun className="h-5 w-5 mb-2" />
                      Sáng
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <Label
                      htmlFor="dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <Moon className="h-5 w-5 mb-2" />
                      Tối
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <Label
                      htmlFor="system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center space-x-1 mb-2">
                        <Sun className="h-5 w-5" />
                        <span>/</span>
                        <Moon className="h-5 w-5" />
                      </div>
                      Hệ thống
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Cỡ chữ</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Chọn cỡ chữ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Nhỏ</SelectItem>
                    <SelectItem value="medium">Vừa</SelectItem>
                    <SelectItem value="large">Lớn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
              <CardDescription>Quản lý cài đặt thông báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Thông báo qua email</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="comment-notifications">Thông báo bình luận</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo khi có người bình luận bài viết của bạn
                  </p>
                </div>
                <Switch id="comment-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="article-notifications">Thông báo bài viết</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo khi bài viết của bạn được duyệt</p>
                </div>
                <Switch id="article-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-notifications">Thông báo tiếp thị</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo về các tính năng và cập nhật mới</p>
                </div>
                <Switch id="marketing-notifications" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Quản lý cài đặt bảo mật tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Xác thực hai yếu tố</Label>
                  <p className="text-sm text-muted-foreground">Bảo vệ tài khoản của bạn với xác thực hai yếu tố</p>
                </div>
                <Switch id="two-factor" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session-timeout">Thời gian hết phiên</Label>
                  <p className="text-sm text-muted-foreground">
                    Tự động đăng xuất sau một khoảng thời gian không hoạt động
                  </p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger id="session-timeout" className="w-[180px]">
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 phút</SelectItem>
                    <SelectItem value="30">30 phút</SelectItem>
                    <SelectItem value="60">1 giờ</SelectItem>
                    <SelectItem value="never">Không bao giờ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Lịch sử đăng nhập</Label>
                <Button variant="outline" className="w-full">
                  Xem lịch sử đăng nhập
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Đổi mật khẩu</Label>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowChangePasswordDialog(true)}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Đổi mật khẩu Dialog */}
      <AlertDialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <AlertDialogContent className="max-w-md">
          <form onSubmit={handlePasswordChangeSubmit}>
            <AlertDialogHeader>
              <AlertDialogTitle>Đổi mật khẩu</AlertDialogTitle>
              <AlertDialogDescription>
                Vui lòng nhập thông tin dưới đây để đổi mật khẩu của bạn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={passwordFormData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  value={passwordFormData.oldPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={passwordFormData.newPassword}
                  onChange={handleInputChange}
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
                  placeholder="Xác nhận mật khẩu mới"
                  value={passwordFormData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>
              {changePasswordError && (
                <div className="text-red-500 text-sm mt-2">
                  {changePasswordError}
                </div>
              )}
            </div>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowChangePasswordDialog(false)}
                type="button"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
