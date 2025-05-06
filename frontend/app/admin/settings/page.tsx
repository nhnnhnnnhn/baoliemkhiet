import { Bell, Globe, Lock, Moon, Shield, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt hệ thống</h2>
        <p className="text-muted-foreground">Quản lý cài đặt hệ thống và tùy chọn của bạn.</p>
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
          <TabsTrigger value="system">
            <Shield className="h-4 w-4 mr-2" />
            Hệ thống
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>Cài đặt chung cho hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Tên trang web</Label>
                <div className="flex gap-2">
                  <input
                    id="site-name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Báo Liêm Khiết"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Mô tả trang web</Label>
                <textarea
                  id="site-description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="Trang tin tức uy tín hàng đầu Việt Nam"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Ngôn ngữ mặc định</Label>
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
                <Label htmlFor="timezone">Múi giờ mặc định</Label>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>Tùy chỉnh giao diện hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chế độ hiển thị mặc định</Label>
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
                <Label htmlFor="primary-color">Màu chủ đạo</Label>
                <div className="grid grid-cols-6 gap-2">
                  <div className="flex items-center justify-center">
                    <input type="radio" name="primary-color" id="color-red" className="sr-only" defaultChecked />
                    <label
                      htmlFor="color-red"
                      className="h-8 w-8 rounded-full bg-red-600 cursor-pointer ring-2 ring-red-600 ring-offset-2"
                      aria-label="Đỏ"
                    ></label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input type="radio" name="primary-color" id="color-blue" className="sr-only" />
                    <label
                      htmlFor="color-blue"
                      className="h-8 w-8 rounded-full bg-blue-600 cursor-pointer hover:ring-2 hover:ring-blue-600 hover:ring-offset-2"
                      aria-label="Xanh dương"
                    ></label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input type="radio" name="primary-color" id="color-green" className="sr-only" />
                    <label
                      htmlFor="color-green"
                      className="h-8 w-8 rounded-full bg-green-600 cursor-pointer hover:ring-2 hover:ring-green-600 hover:ring-offset-2"
                      aria-label="Xanh lá"
                    ></label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input type="radio" name="primary-color" id="color-purple" className="sr-only" />
                    <label
                      htmlFor="color-purple"
                      className="h-8 w-8 rounded-full bg-purple-600 cursor-pointer hover:ring-2 hover:ring-purple-600 hover:ring-offset-2"
                      aria-label="Tím"
                    ></label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input type="radio" name="primary-color" id="color-orange" className="sr-only" />
                    <label
                      htmlFor="color-orange"
                      className="h-8 w-8 rounded-full bg-orange-600 cursor-pointer hover:ring-2 hover:ring-orange-600 hover:ring-offset-2"
                      aria-label="Cam"
                    ></label>
                  </div>
                  <div className="flex items-center justify-center">
                    <input type="radio" name="primary-color" id="color-gray" className="sr-only" />
                    <label
                      htmlFor="color-gray"
                      className="h-8 w-8 rounded-full bg-gray-600 cursor-pointer hover:ring-2 hover:ring-gray-600 hover:ring-offset-2"
                      aria-label="Xám"
                    ></label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
              <CardDescription>Quản lý cài đặt thông báo hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-user-notifications">Thông báo người dùng mới</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo khi có người dùng mới đăng ký</p>
                </div>
                <Switch id="new-user-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-article-notifications">Thông báo bài viết mới</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo khi có bài viết mới cần duyệt</p>
                </div>
                <Switch id="new-article-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="comment-notifications">Thông báo bình luận</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo khi có bình luận mới cần duyệt</p>
                </div>
                <Switch id="comment-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-notifications">Thông báo hệ thống</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo về các sự kiện hệ thống quan trọng</p>
                </div>
                <Switch id="system-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Quản lý cài đặt bảo mật hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor-requirement">Yêu cầu xác thực hai yếu tố</Label>
                  <p className="text-sm text-muted-foreground">
                    Yêu cầu tất cả quản trị viên sử dụng xác thực hai yếu tố
                  </p>
                </div>
                <Switch id="two-factor-requirement" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-policy">Chính sách mật khẩu</Label>
                  <p className="text-sm text-muted-foreground">Yêu cầu mật khẩu mạnh cho tất cả người dùng</p>
                </div>
                <Switch id="password-policy" defaultChecked />
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
                <Label>Nhật ký bảo mật</Label>
                <Button variant="outline" className="w-full">
                  Xem nhật ký bảo mật
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt hệ thống</CardTitle>
              <CardDescription>Quản lý cài đặt nâng cao của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
                  <p className="text-sm text-muted-foreground">Đặt trang web vào chế độ bảo trì</p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cache-clear">Xóa bộ nhớ đệm</Label>
                  <p className="text-sm text-muted-foreground">Xóa bộ nhớ đệm của hệ thống</p>
                </div>
                <Button variant="outline">Xóa bộ nhớ đệm</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="backup">Sao lưu dữ liệu</Label>
                  <p className="text-sm text-muted-foreground">Tạo bản sao lưu dữ liệu hệ thống</p>
                </div>
                <Button variant="outline">Tạo bản sao lưu</Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Nhật ký hệ thống</Label>
                <Button variant="outline" className="w-full">
                  Xem nhật ký hệ thống
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
