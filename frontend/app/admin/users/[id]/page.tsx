"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "../../admin.module.css"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetUserById } from "@/src/thunks/user/userThunk"
import { selectIsLoading, selectSelectedUser } from "@/src/thunks/user/userSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectSelectedUser)
  const isLoading = useAppSelector(selectIsLoading)

  useEffect(() => {
    dispatch(handleGetUserById(Number(params.id)))
  }, [dispatch, params.id])

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
              <div className={styles.breadcrumbItem}>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : user ? (
                  user.fullname
                ) : (
                  'Không tìm thấy'
                )}
              </div>
            </div>
          </div>
        </div>
        {user && (
          <Link href={`/admin/users/${user.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
        )}
      </div>

      {/* User Profile */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <div className={styles.chartCard}>
              <div className="flex flex-col items-center p-6">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-40 mb-1" />
                <Skeleton className="h-4 w-20 mb-4" />
                <div className="w-full space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className={styles.chartCard}>
              <Skeleton className="h-6 w-40 m-6" />
              <Skeleton className="h-4 w-full mx-6 mb-4" />
              <Skeleton className="h-4 w-full mx-6 mb-4" />
              <Skeleton className="h-4 w-full mx-6 mb-4" />
            </div>
          </div>
        </div>
      ) : !user ? (
        <div className="text-center p-8 text-gray-500">
          Không tìm thấy thông tin người dùng
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <div className={styles.chartCard}>
              <div className="flex flex-col items-center p-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-600 text-4xl font-medium">
                  {user.fullname.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold mb-1">{user.fullname}</h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "EDITOR"
                        ? "bg-blue-100 text-blue-800"
                        : user.role === "JOURNALIST"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                  } mb-4`}
                >
                  {user.role === "ADMIN" ? "Quản trị viên" : 
                    user.role === "EDITOR" ? "Biên tập viên" : 
                    user.role === "JOURNALIST" ? "Nhà báo" : "Người dùng"}
                </span>
                <div className="w-full space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{user.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className={styles.chartCard}>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin chi tiết</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">ID</div>
                      <div>{user.id}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Vai trò</div>
                      <div>
                        {user.role === "ADMIN" ? "Quản trị viên" : 
                         user.role === "EDITOR" ? "Biên tập viên" : 
                         user.role === "JOURNALIST" ? "Nhà báo" : "Người dùng"}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Trạng thái</div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_online
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_online ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Ngày tạo</div>
                      <div>{format(parseISO(user.created_at), 'dd/MM/yyyy')}</div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Cập nhật lần cuối</div>
                      <div>{format(parseISO(user.updated_at), 'dd/MM/yyyy HH:mm')}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Số bài viết</div>
                      <div>{user.articles ? user.articles.length : 0}</div>
                    </div>
                  </div>
                </div>
                {user.bio && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Giới thiệu</div>
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Articles */}
      {!isLoading && user && user.articles && user.articles.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Bài viết gần đây</h3>
            <Link href={`/admin/articles?author=${user.id}`}>
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
                  <th className={styles.tableHeaderCell}>Lượt xem</th>
                  <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                  <th className={styles.tableHeaderCell}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {user.articles.map((article) => (
                  <tr key={article.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{article.id}</td>
                    <td className={styles.tableCell}>
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : article.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {article.status === "PUBLISHED" ? "Đã xuất bản" : 
                         article.status === "PENDING" ? "Chờ duyệt" : 
                         article.status === "DRAFT" ? "Bản nháp" : article.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>{article.views ? article.views.toLocaleString() : 0}</td>
                    <td className={styles.tableCell}>{article.publishedAt ? format(parseISO(article.publishedAt), 'dd/MM/yyyy') : '-'}</td>
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
    </div>
  )
}
