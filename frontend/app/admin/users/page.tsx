'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Filter, Search, Trash2, UserPlus, Edit, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import styles from "../admin.module.css"
import userApi, { User, GetUsersResponse } from "@/src/apis/user"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await userApi.getUsers({
        search: searchQuery || undefined,
        page,
        limit
      })
      console.log('API Response:', response) // Debug log
      setUsers(response.users)
      setTotal(response.total)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, searchQuery])

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return

    try {
      await userApi.deleteUser(id)
      toast({
        description: "Đã xóa người dùng thành công",
      })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng",
        variant: "destructive",
      })
    }
  }

  const getRoleDisplay = (role: User['role']) => {
    switch (role) {
      case "ADMIN":
        return { text: "Admin", classes: "bg-purple-100 text-purple-800" }
      case "JOURNALIST":
        return { text: "Nhà báo", classes: "bg-blue-100 text-blue-800" }
      case "USER":
        return { text: "Người dùng", classes: "bg-gray-100 text-gray-800" }
      default:
        return { text: "Không xác định", classes: "bg-gray-100 text-gray-800" }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      console.log('Formatting date:', dateString) // Debug log
      if (!dateString) {
        console.log('Empty date string')
        return "Không có dữ liệu"
      }

      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.log('Invalid date:', dateString)
        return "Không có dữ liệu"
      }

      const formatter = new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh"
      })

      return formatter.format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Không có dữ liệu"
    }
  }

  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit + 1
  const endIndex = Math.min(startIndex + limit - 1, total)

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý người dùng</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Người dùng</div>
        </div>
      </div>

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
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
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>ID</th>
                <th className={styles.tableHeaderCell}>Tên</th>
                <th className={styles.tableHeaderCell}>Email</th>
                <th className={styles.tableHeaderCell}>Vai trò</th>
                <th className={styles.tableHeaderCell}>Ngày tạo</th>
                <th className={styles.tableHeaderCell}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Đang tải...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const role = getRoleDisplay(user.role)
                  return (
                    <tr key={user.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{user.id}</td>
                      <td className={styles.tableCell}>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-gray-600 font-medium overflow-hidden">
                            {user.fullname?.charAt(0) || '?'}
                          </div>
                          {user.fullname}
                        </div>
                      </td>
                      <td className={styles.tableCell}>{user.email}</td>
                      <td className={styles.tableCell}>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.classes}`}
                        >
                          {role.text}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        {formatDate(user.created_at)}
                      </td>
                      <td className={styles.tableCell}>
                        <div className="flex space-x-2">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/users/${user.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.tableFooter}>
          <div className={styles.paginationInfo}>
            {total > 0 ? `Hiển thị ${startIndex} đến ${endIndex} trong tổng số ${total} người dùng` : ""}
          </div>
          <div className={styles.paginationControls}>
            <button 
              className={`${styles.paginationButton} ${page === 1 ? styles.paginationButtonDisabled : ""}`}
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <button
                key={i + 1}
                className={`${styles.paginationButton} ${
                  page === i + 1 ? styles.paginationButtonActive : ""
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={`${styles.paginationButton} ${
                page === totalPages ? styles.paginationButtonDisabled : ""
              }`}
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}