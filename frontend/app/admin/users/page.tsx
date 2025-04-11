import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Filter, Search, Trash2, UserPlus, Edit, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import styles from "../admin.module.css"

export default function UsersPage() {
  // Mock user data
  const users = [
    {
      id: "USR-001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: "Admin",
      status: "Hoạt động",
      articles: 45,
      created: "05/04/2025",
    },
    {
      id: "USR-002",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      role: "Biên tập viên",
      status: "Hoạt động",
      articles: 78,
      created: "03/04/2025",
    },
    {
      id: "USR-003",
      name: "Lê Văn C",
      email: "levanc@example.com",
      role: "Tác giả",
      status: "Không hoạt động",
      articles: 23,
      created: "28/03/2025",
    },
    {
      id: "USR-004",
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      role: "Biên tập viên",
      status: "Hoạt động",
      articles: 56,
      created: "25/03/2025",
    },
    {
      id: "USR-005",
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      role: "Tác giả",
      status: "Chờ duyệt",
      articles: 12,
      created: "20/03/2025",
    },
    {
      id: "USR-006",
      name: "Ngô Thị F",
      email: "ngothif@example.com",
      role: "Tác giả",
      status: "Hoạt động",
      articles: 34,
      created: "18/03/2025",
    },
    {
      id: "USR-007",
      name: "Đỗ Văn G",
      email: "dovang@example.com",
      role: "Tác giả",
      status: "Hoạt động",
      articles: 19,
      created: "15/03/2025",
    },
    {
      id: "USR-008",
      name: "Vũ Thị H",
      email: "vuthih@example.com",
      role: "Biên tập viên",
      status: "Hoạt động",
      articles: 42,
      created: "12/03/2025",
    },
  ]

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
              <Input type="search" placeholder="Tìm kiếm người dùng..." className="pl-8 h-9 w-[200px] md:w-[300px]" />
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
                <th className={styles.tableHeaderCell}>Trạng thái</th>
                <th className={styles.tableHeaderCell}>Bài viết</th>
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
                      <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-gray-600 font-medium">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className={styles.tableCell}>{user.email}</td>
                  <td className={styles.tableCell}>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "Biên tập viên"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "Hoạt động"
                          ? "bg-green-100 text-green-800"
                          : user.status === "Không hoạt động"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{user.articles}</td>
                  <td className={styles.tableCell}>{user.created}</td>
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
          <div className={styles.paginationInfo}>Hiển thị 1 đến 8 trong tổng số 50 người dùng</div>
          <div className={styles.paginationControls}>
            <button className={`${styles.paginationButton} ${styles.paginationButtonDisabled}`} disabled>
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button className={`${styles.paginationButton} ${styles.paginationButtonActive}`}>1</button>
            <button className={styles.paginationButton}>2</button>
            <button className={styles.paginationButton}>3</button>
            <button className={styles.paginationButton}>4</button>
            <button className={styles.paginationButton}>5</button>
            <button className={styles.paginationButton}>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
