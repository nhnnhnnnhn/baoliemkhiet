"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Mail, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetUserById, handleDeleteUser } from "@/src/thunks/auth/authThunk"
import { 
  selectLoadingUserDetails, 
  selectSelectedUser, 
  selectUserDetailsError, 
  selectDeletingUser,
  selectDeleteUserError,
  selectDeleteUserSuccess
} from "@/src/thunks/auth/authSlice"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import styles from "../../admin.module.css"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const user = useAppSelector(selectSelectedUser)
  const loading = useAppSelector(selectLoadingUserDetails)
  const error = useAppSelector(selectUserDetailsError)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Thêm selectors cho thao tác xóa
  const deleting = useAppSelector(selectDeletingUser)
  const deleteError = useAppSelector(selectDeleteUserError)
  const deleteSuccess = useAppSelector(selectDeleteUserSuccess)

  useEffect(() => {
    if (params.id) {
      // Thêm timeout để đảm bảo token đã được load từ localStorage
      setTimeout(() => {
        dispatch(handleGetUserById(parseInt(params.id)))
      }, 300)
    }
  }, [params.id, dispatch])

  // Xử lý sau khi xóa thành công
  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: "Xóa người dùng thành công",
        description: `Người dùng với ID ${params.id} đã được xóa.`,
      })
      // Điều hướng về trang danh sách người dùng
      router.push('/admin/users')
    }
  }, [deleteSuccess, router, params.id, toast])

  // Xử lý hiển thị lỗi khi xóa
  useEffect(() => {
    if (deleteError) {
      toast({
        title: "Lỗi khi xóa người dùng",
        description: deleteError,
        variant: "destructive",
      })
    }
  }, [deleteError, toast])

  // Hàm xử lý xóa người dùng
  const handleDelete = () => {
    if (user && user.id) {
      dispatch(handleDeleteUser(user.id))
    }
    setShowDeleteDialog(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-lg font-medium">Đang tải thông tin người dùng...</h2>
          <div className="mt-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách người dùng
            </Button>
          </Link>
        </div>
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-medium text-red-800 mb-2">Lỗi khi tải thông tin người dùng</h2>
          <p className="text-red-600">{error}</p>
          
          <div className="mt-4">
            <Button onClick={() => dispatch(handleGetUserById(parseInt(params.id)))}>
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="mb-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách người dùng
            </Button>
          </Link>
        </div>
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">Không tìm thấy thông tin người dùng</p>
          <div className="mt-4">
            <Button onClick={() => dispatch(handleGetUserById(parseInt(params.id)))}>
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Format user data for display with type safety
  const userData = {
    id: user.id.toString(),
    name: user.fullname || "Chưa cập nhật",
    email: user.email,
    role: user.role === "ADMIN" ? "Quản trị viên" : 
          user.role === "JOURNALIST" ? "Biên tập viên" : "Người dùng",
    status: user.is_online ? "Đang hoạt động" : "Không hoạt động",
    created: user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : "Chưa cập nhật",
    bio: user.bio || "Chưa cập nhật",
    articles: user.articles && Array.isArray(user.articles) ? user.articles.map(article => ({
      id: article.id.toString(),
      title: article.title,
      status: article.status === "PUBLISHED" ? "Đã xuất bản" : 
              article.status === "PENDING" ? "Chờ duyệt" : "Nháp",
      views: 0, // Không có thông tin views từ API
      publishedAt: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : "-"
    })) : []
  }

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
            <h1 className={styles.pageTitle}>Chi tiết người dùng</h1>
            <div className={styles.pageBreadcrumb}>
              <div className={styles.breadcrumbItem}>Trang chủ</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>Người dùng</div>
              <div className={styles.breadcrumbDivider}>/</div>
              <div className={styles.breadcrumbItem}>{userData.name}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/users/${userData.id}/edit`}>
            <Button className="mr-2">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            disabled={user.role === "ADMIN" || deleting}>
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </>
            )}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <div className={styles.chartCard}>
            <div className="flex flex-col items-center p-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-600 text-4xl font-medium">
                {user.avatar ? (
                  <img src={user.avatar} alt={userData.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  userData.name.charAt(0)
                )}
              </div>
              <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === "ADMIN"
                    ? "bg-purple-100 text-purple-800"
                    : user.role === "JOURNALIST"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                } mb-4`}
              >
                {userData.role}
              </span>
              <div className="w-full space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{userData.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Thông tin người dùng</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">ID</div>
                    <div>{userData.id}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Trạng thái</div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.status === "Đang hoạt động"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {userData.status}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Ngày tạo</div>
                    <div>{userData.created}</div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Số bài viết</div>
                    <div>{userData.articles.length}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Vai trò</div>
                    <div>{userData.role}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Giới thiệu</div>
                <p className="text-gray-700">{userData.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Articles */}
      {userData.articles.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Bài viết gần đây</h3>
            <Link href={`/admin/articles?author=${userData.id}`}>
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </div>
          <div className={styles.tableContent}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>ID</th>
                  <th className={styles.tableHeaderCell}>Tiêu đề</th>
                  <th className={styles.tableHeaderCell}>Trạng thái</th>
                  <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                  <th className={styles.tableHeaderCell}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {userData.articles.map((article) => (
                  <tr key={article.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{article.id}</td>
                    <td className={styles.tableCell}>
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === "Đã xuất bản"
                            ? "bg-green-100 text-green-800"
                            : article.status === "Chờ duyệt"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>{article.publishedAt}</td>
                    <td className={styles.tableCell}>
                      <div className="flex space-x-2">
                        <Link href={`/admin/articles/${article.id}`}>
                          <Button variant="ghost" size="sm">
                            Xem
                          </Button>
                        </Link>
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Sửa
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Xác nhận xóa người dùng
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-4">
            <p>Bạn có chắc chắn muốn xóa người dùng <strong>{userData.name}</strong> không?</p>
            <p className="mt-2">Hành động này không thể hoàn tác và tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.</p>
            <p className="mt-2 text-red-500">Nếu người dùng là tác giả của các bài viết, những bài viết đó cũng sẽ bị xóa!</p>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa người dùng"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
