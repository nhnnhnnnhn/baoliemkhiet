import Link from "next/link"
import { ArrowLeft, Edit, Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "../../admin.module.css"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  // Mock user data - in a real app, you would fetch this from an API
  const user = {
    id: params.id,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0912345678",
    address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    role: "Biên tập viên",
    status: "Hoạt động",
    created: "05/04/2025",
    lastLogin: "06/04/2025 15:30",
    bio: "Biên tập viên với hơn 5 năm kinh nghiệm trong lĩnh vực báo chí. Chuyên về các bài viết thời sự và kinh tế.",
    articles: [
      {
        id: "ART-001",
        title: "Chính phủ công bố kế hoạch phát triển kinh tế 5 năm tới",
        status: "Đã xuất bản",
        views: 12543,
        publishedAt: "05/04/2025",
      },
      {
        id: "ART-002",
        title: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
        status: "Đã xuất bản",
        views: 8932,
        publishedAt: "02/04/2025",
      },
      {
        id: "ART-003",
        title: "Dự báo tăng trưởng GDP Việt Nam năm 2025",
        status: "Chờ duyệt",
        views: 0,
        publishedAt: "-",
      },
    ],
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
              <div className={styles.breadcrumbItem}>{user.name}</div>
            </div>
          </div>
        </div>
        <Link href={`/admin/users/${user.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      {/* User Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <div className={styles.chartCard}>
            <div className="flex flex-col items-center p-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-600 text-4xl font-medium">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === "Admin"
                    ? "bg-purple-100 text-purple-800"
                    : user.role === "Biên tập viên"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                } mb-4`}
              >
                {user.role}
              </span>
              <div className="w-full space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <span>{user.address}</span>
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
                    <div>{user.id}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Trạng thái</div>
                    <div>
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
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Ngày tạo</div>
                    <div>{user.created}</div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Đăng nhập gần nhất</div>
                    <div>{user.lastLogin}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Số bài viết</div>
                    <div>{user.articles.length}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Giới thiệu</div>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Articles */}
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
                <th className={styles.tableHeaderCell}>Hành động</th>
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
                  <td className={styles.tableCell}>{article.views.toLocaleString()}</td>
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
    </div>
  )
}

