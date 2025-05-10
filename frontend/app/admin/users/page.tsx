"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Filter, Search, Trash2, UserPlus, Edit, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import styles from "../admin.module.css"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleCreateUser, handleDeleteUser, handleGetUsers } from "@/src/thunks/user/userThunk"
import { selectCurrentPage, selectError, selectIsLoading, selectTotalPages, selectTotalUsers, selectUsers } from "@/src/thunks/user/userSlice"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { User } from "@/src/apis/user"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const totalUsers = useAppSelector(selectTotalUsers)
  const currentPage = useAppSelector(selectCurrentPage)
  const totalPages = useAppSelector(selectTotalPages)
  
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<string | undefined>(undefined)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  
  // Form state cho thêm người dùng mới
  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    phone: "",
    address: "",
    bio: "",
    status: "ACTIVE"  // Chữ hoa để phù hợp với enum của backend
  })

  // Fetch users on mount and when search/filter changes
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: search || undefined,
      role: role || undefined
    }
    
    dispatch(handleGetUsers(params))
  }, [dispatch, currentPage, search, role])

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = {
      page,
      limit: 10,
      search: search || undefined,
      role: role || undefined
    }
    
    dispatch(handleGetUsers(params))
  }
  
  // Xử lý lọc theo vai trò
  const handleRoleFilter = (selectedRole: string | undefined) => {
    setRole(selectedRole)
  }
  
  // Xử lý thêm người dùng mới
  const handleAddUser = async () => {
    try {
      // Kiểm tra trường bắt buộc
      if (!newUser.fullname || !newUser.email || !newUser.password) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu",
          variant: "destructive",
        })
        return
      }
      
      // Kiểm tra mật khẩu
      if (newUser.password !== newUser.confirmPassword) {
        toast({
          title: "Mật khẩu không khớp",
          description: "Mật khẩu và xác nhận mật khẩu phải giống nhau",
          variant: "destructive",
        })
        return
      }
      
      // Gọi API tạo người dùng
      const userData = {
        fullname: newUser.fullname,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        phone: newUser.phone || null,
        address: newUser.address || null,
        bio: newUser.bio || null,
        status: newUser.status  // Sử dụng ACTIVE thay vì active
      }
      
      await dispatch(handleCreateUser(userData)).unwrap()
      
      toast({
        title: "Đã thêm người dùng",
        description: `Người dùng ${newUser.fullname} đã được tạo thành công.`,
        variant: "default",
      })
      
      // Reset form và đóng dialog
      setNewUser({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        phone: "",
        address: "",
        bio: "",
        status: "ACTIVE"
      })
      setAddUserDialogOpen(false)
      
      // Tải lại danh sách người dùng
      dispatch(handleGetUsers({
        page: currentPage,
        limit: 10,
        search: search || undefined,
        role: role || undefined
      }))
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error || "Không thể tạo người dùng mới",
        variant: "destructive",
      })
    }
  }
  
  // Xử lý thay đổi giá trị form thêm người dùng
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser(prev => ({ ...prev, [name]: value }))
  }

  // Handle user deletion
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await dispatch(handleDeleteUser(userToDelete.id)).unwrap()
      toast({
        title: "Xóa người dùng thành công",
        description: `Người dùng ${userToDelete.fullname} đã được xóa thành công.`,
        variant: "default",
      })
      
      // Refresh user list
      dispatch(handleGetUsers({
        page: currentPage,
        limit: 10,
        search: search || undefined,
        role: role || undefined
      }))
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý người dùng</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Người dùng</div>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Tất cả người dùng</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                className="w-64 pl-8"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="relative">
              <Select 
                value={role || "all"} 
                onValueChange={(value) => handleRoleFilter(value === "all" ? undefined : value)}
              >
                <SelectTrigger 
                  id="role-filter" 
                  className="w-[180px]" 
                  aria-label="Lọc theo vai trò"
                >
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Lọc theo vai trò" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                  <SelectItem value="EDITOR">Biên tập viên</SelectItem>
                  <SelectItem value="JOURNALIST">Nhà báo</SelectItem>
                  <SelectItem value="USER">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              size="sm"
              onClick={() => setAddUserDialogOpen(true)}
              aria-label="Thêm người dùng mới"
              title="Thêm người dùng mới"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </div>
        </div>
        <div className={styles.tableContent}>
          {isLoading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              Không tìm thấy người dùng nào
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>ID</th>
                  <th className={styles.tableHeaderCell}>Tên</th>
                  <th className={styles.tableHeaderCell}>Email</th>
                  <th className={styles.tableHeaderCell}>Vai trò</th>
                  <th className={styles.tableHeaderCell}>Trạng thái</th>
                  <th className={styles.tableHeaderCell}>Bài viết</th>
                  <th className={styles.tableHeaderCell}>Ngày tạo</th>
                  <th className={styles.tableHeaderCell}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{user.id}</td>
                    <td className={styles.tableCell}>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullname} className="h-8 w-8 rounded-full" />
                          ) : (
                            <span className="text-xs font-medium">{user.fullname.charAt(0)}</span>
                          )}
                        </div>
                        <div className="font-medium">{user.fullname}</div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>{user.email}</td>
                    <td className={styles.tableCell}>
                      <span className="capitalize">
                        {user.role === "ADMIN" ? "Quản trị viên" : 
                         user.role === "EDITOR" ? "Biên tập viên" : 
                         user.role === "JOURNALIST" ? "Nhà báo" : "Người dùng"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          !user.status || user.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : user.status === "BLOCKED"
                              ? "bg-red-100 text-red-800"
                              : user.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {!user.status || user.status === "ACTIVE" ? "Hoạt động" : 
                         user.status === "BLOCKED" ? "Bị chặn" : 
                         user.status === "PENDING" ? "Chưa xác thực" :
                         user.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>{user.articles ? user.articles.length : 0}</td>
                    <td className={styles.tableCell}>{format(new Date(user.created_at), 'dd/MM/yyyy')}</td>
                    <td className={styles.tableCell}>
                      <div className="flex space-x-2">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            aria-label="Xem chi tiết người dùng"
                            title="Xem chi tiết người dùng"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/users/${user.id}/edit`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            aria-label="Sửa thông tin người dùng"
                            title="Sửa thông tin người dùng"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(user)}
                          aria-label="Xóa người dùng"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className={styles.tableFooter}>
          <div className={styles.paginationInfo}>
            {isLoading ? (
              <Skeleton className="h-4 w-[300px]" />
            ) : (
              `Hiển thị ${users.length > 0 ? (currentPage - 1) * 10 + 1 : 0} đến ${Math.min(currentPage * 10, totalUsers)} trong tổng số ${totalUsers} người dùng`
            )}
          </div>
          <div className={styles.paginationControls}>
            <button 
              className={`${styles.paginationButton} ${currentPage <= 1 ? styles.paginationButtonDisabled : ''}`} 
              disabled={currentPage <= 1 || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Trang trước"
              title="Trang trước"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button 
                  key={page}
                  className={`${styles.paginationButton} ${currentPage === page ? styles.paginationButtonActive : ''}`}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  aria-label={`Trang ${page}`}
                  title={`Trang ${page}`}
                >
                  {page}
                </button>
              );
            })}
            
            <button 
              className={`${styles.paginationButton} ${currentPage >= totalPages ? styles.paginationButtonDisabled : ''}`}
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Trang tiếp theo"
              title="Trang tiếp theo"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng {userToDelete?.fullname} không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      

      
      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-6">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname" className="text-sm">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={newUser.fullname}
                      onChange={handleNewUserChange}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm">
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={handleNewUserChange}
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={handleNewUserChange}
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm">
                      Vai trò <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                        <SelectItem value="EDITOR">Biên tập viên</SelectItem>
                        <SelectItem value="JOURNALIST">Nhà báo</SelectItem>
                        <SelectItem value="USER">Người dùng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm">
                      Trạng thái
                    </Label>
                    <Select 
                      value={newUser.status} 
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                        <SelectItem value="PENDING">Chưa xác thực</SelectItem>
                        <SelectItem value="BLOCKED">Bị chặn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newUser.phone}
                      onChange={handleNewUserChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm">
                      Địa chỉ
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={newUser.address}
                      onChange={handleNewUserChange}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm">
                    Giới thiệu
                  </Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={newUser.bio}
                    onChange={handleNewUserChange}
                    placeholder="Mô tả ngắn về người dùng"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleAddUser}>Tạo người dùng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
