"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { getUserById } from "@/src/thunks/user/userThunk"
import { selectSelectedUser, selectLoadingUserDetails, selectUserDetailsError } from "@/src/thunks/user/userSlice"

import { Button } from "@/components/ui/button"
import styles from "../../admin.module.css"

export default function UserDetailsPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectSelectedUser)
  const loading = useAppSelector(selectLoadingUserDetails)
  const error = useAppSelector(selectUserDetailsError)

  useEffect(() => {
    if (id) {
      dispatch(getUserById(Number(id)))
    }
  }, [dispatch, id])

  if (loading) return <div className="flex justify-center items-center p-8">Loading...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!user) return <div className="text-gray-500 p-4">Không tìm thấy người dùng</div>

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className="flex items-center space-x-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <h1 className={styles.pageTitle}>Chi tiết người dùng</h1>
        </div>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Người dùng</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>{user.id}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Thông tin cơ bản</h3>
            <Link href={`/admin/users/${user.id}/edit`}>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </Link>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-3xl font-medium overflow-hidden shadow-lg border-4 border-white">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullname} className="h-full w-full object-cover" />
                ) : (
                  user.fullname.charAt(0)
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{user.fullname}</h2>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${user.role === "ADMIN"
                    ? "bg-purple-100 text-purple-800"
                    : user.role === "JOURNALIST"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="border rounded-lg bg-gray-50">
              <dl>
                <div className="px-4 py-3 grid grid-cols-3 gap-4 border-b">
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{user.id}</dd>
                </div>
                
                <div className="px-4 py-3 grid grid-cols-3 gap-4 border-b">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{user.email}</dd>
                </div>
                
                <div className="px-4 py-3 grid grid-cols-3 gap-4 border-b">
                  <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </dd>
                </div>

                <div className="px-4 py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Tiểu sử</dt>
                  <dd className="text-sm text-gray-900 col-span-2 whitespace-pre-line">
                    {user.bio || "Chưa cập nhật"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Bài viết</h3>
          </div>
          <div className="p-6">
            {user.articles && user.articles.length > 0 ? (
              <div className="space-y-4">
                {user.articles.map((article: any) => (
                  <div key={article.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{article.title}</h4>
                    <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                      <span>Trạng thái: {article.status}</span>
                      <span>{article.views || 0} lượt xem</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">Chưa có bài viết nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
