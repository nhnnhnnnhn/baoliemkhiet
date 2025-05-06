"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Filter, Search, Trash2, UserPlus, Edit, Eye } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { fetchUsers, deleteUser } from "@/src/thunks/user/userThunk"
import { selectUsers, selectLoading, selectError, selectTotal, selectPage, selectLimit, setPage } from "@/src/thunks/user/userSlice"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import styles from "../admin.module.css"

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const loading = useAppSelector(selectLoading)
  const error = useAppSelector(selectError)
  const total = useAppSelector(selectTotal)
  const currentPage = useAppSelector(selectPage)
  const limit = useAppSelector(selectLimit)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchUsers({
      page: currentPage,
      limit: limit,
      search: searchTerm || undefined
    }))
  }, [dispatch, currentPage, limit, searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      await dispatch(deleteUser(id))
      dispatch(fetchUsers({
        page: currentPage,
        limit: limit,
        search: searchTerm || undefined
      }))
    }
  }

  if (loading) return <div className="flex justify-center items-center p-8">Loading...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>

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
                value={searchTerm}
                onChange={handleSearch}
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
              {users.map((user) => (
                <tr key={user.id} className={styles.tableRow}>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.role === "ADMIN" 
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "JOURNALIST"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
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
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <div className={styles.paginationInfo}>
            Hiển thị {(currentPage - 1) * limit + 1} đến {Math.min(currentPage * limit, total)} trong tổng số {total} người dùng
          </div>
          <div className={styles.paginationControls}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => dispatch(setPage(currentPage - 1))}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setPage(page))}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= Math.ceil(total / limit)}
              onClick={() => dispatch(setPage(currentPage + 1))}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
