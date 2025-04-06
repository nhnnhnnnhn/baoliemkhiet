import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import styles from "../../admin.module.css"

export default function AddUserPage() {
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
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" placeholder="Nhập họ và tên" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Nhập địa chỉ email" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" placeholder="Nhập mật khẩu" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" className="mt-1" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="Nhập số điện thoại" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" placeholder="Nhập địa chỉ" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="role">Vai trò</Label>
                  <Select>
                    <SelectTrigger id="role" className="mt-1">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Biên tập viên</SelectItem>
                      <SelectItem value="author">Tác giả</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <Label htmlFor="bio">Giới thiệu</Label>
              <Textarea id="bio" placeholder="Nhập thông tin giới thiệu" className="mt-1" rows={4} />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2">
                Hủy
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Lưu
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

