"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Filter, Search, Trash2, UserPlus, Edit, Eye } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import styles from "../admin.module.css"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleDeleteUser, handleGetUsers } from "@/src/thunks/user/userThunk"
import { selectCurrentPage, selectError, selectIsLoading, selectTotalPages, selectTotalUsers, selectUsers } from "@/src/thunks/user/userSlice"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
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
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Tìm kiếm người dùng..." 
                className="pl-8 h-9 w-[200px] md:w-[300px]" 
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setRole(role ? undefined : 'ADMIN')}>
              <Filter className="h-4 w-4 mr-2" />
              {role ? `Lọc: ${role}` : 'Lọc'}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
            <Link href="/admin/users/add">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm người dùng
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles.tableContent}>
          {isLoading ? (
            <div className="p-4">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">Lỗi: {error}</div>
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">Không có dữ liệu người dùng</td>
                  </tr>
                ) : users.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.tableCell}>{user.id}</td>
                    <td className={styles.tableCell}>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-gray-600 font-medium overflow-hidden">
                          {user.fullname.charAt(0)}
                        </div>
                        {user.fullname}
                      </div>
                    </td>
                    <td className={styles.tableCell}>{user.email}</td>
                    <td className={styles.tableCell}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "EDITOR"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "JOURNALIST" 
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Quản trị viên" : 
                          user.role === "EDITOR" ? "Biên tập viên" : 
                          user.role === "JOURNALIST" ? "Nhà báo" : "Người dùng"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_online
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_online ? "Đang hoạt động" : "Không hoạt động"}
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
                >
                  {page}
                </button>
              );
            })}
            
            <button 
              className={`${styles.paginationButton} ${currentPage >= totalPages ? styles.paginationButtonDisabled : ''}`}
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  )
}
