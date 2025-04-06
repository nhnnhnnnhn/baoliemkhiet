import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import styles from "../admin.module.css"

export default function ArticlesPage() {
  // Mock articles data
  const articles = [
    {
      id: "ART-001",
      title: "Chính phủ công bố kế hoạch phát triển kinh tế 5 năm tới",
      category: "Thời sự",
      author: "Nguyễn Văn A",
      status: "Đã xuất bản",
      views: 12543,
      comments: 45,
      publishedAt: "05/04/2025",
    },
    {
      id: "ART-002",
      title: "Đội tuyển Việt Nam giành chiến thắng ấn tượng tại vòng loại World Cup",
      category: "Thể thao",
      author: "Trần Thị B",
      status: "Đã xuất bản",
      views: 10876,
      comments: 78,
      publishedAt: "04/04/2025",
    },
    {
      id: "ART-003",
      title: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
      category: "Kinh doanh",
      author: "Lê Văn C",
      status: "Đã xuất bản",
      views: 8932,
      comments: 23,
      publishedAt: "03/04/2025",
    },
    {
      id: "ART-004",
      title: "Công nghệ AI đang thay đổi ngành y tế như thế nào",
      category: "Công nghệ",
      author: "Phạm Thị D",
      status: "Đã xuất bản",
      views: 7654,
      comments: 19,
      publishedAt: "02/04/2025",
    },
    {
      id: "ART-005",
      title: "10 điểm du lịch hấp dẫn nhất Việt Nam trong mùa hè này",
      category: "Du lịch",
      author: "Hoàng Văn E",
      status: "Đã xuất bản",
      views: 6789,
      comments: 34,
      publishedAt: "01/04/2025",
    },
    {
      id: "ART-006",
      title: "Dự báo tăng trưởng GDP Việt Nam năm 2025",
      category: "Kinh tế",
      author: "Ngô Thị F",
      status: "Chờ duyệt",
      views: 0,
      comments: 0,
      publishedAt: "-",
    },
    {
      id: "ART-007",
      title: "Những xu hướng thời trang nổi bật mùa hè 2025",
      category: "Thời trang",
      author: "Đỗ Văn G",
      status: "Chờ duyệt",
      views: 0,
      comments: 0,
      publishedAt: "-",
    },
    {
      id: "ART-008",
      title: "Cách phòng tránh các bệnh mùa hè thường gặp",
      category: "Sức khỏe",
      author: "Vũ Thị H",
      status: "Từ chối",
      views: 0,
      comments: 0,
      publishedAt: "-",
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý bài viết</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Trang chủ</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Bài viết</div>
        </div>
      </div>

      {/* Articles Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Tất cả bài viết</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input type="search" placeholder="Tìm kiếm bài viết..." className="pl-8 h-9 w-[200px] md:w-[300px]" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
            <Link href="/admin/articles/add">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm bài viết
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles.tableContent}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>ID</th>
                <th className={styles.tableHeaderCell}>Tiêu đề</th>
                <th className={styles.tableHeaderCell}>Chuyên mục</th>
                <th className={styles.tableHeaderCell}>Tác giả</th>
                <th className={styles.tableHeaderCell}>Trạng thái</th>
                <th className={styles.tableHeaderCell}>Lượt xem</th>
                <th className={styles.tableHeaderCell}>Bình luận</th>
                <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                <th className={styles.tableHeaderCell}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{article.id}</td>
                  <td className={styles.tableCell}>
                    <div className="font-medium">{article.title}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{article.author}</td>
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
                  <td className={styles.tableCell}>{article.comments}</td>
                  <td className={styles.tableCell}>{article.publishedAt}</td>
                  <td className={styles.tableCell}>
                    <div className="flex space-x-2">
                      <Link href={`/admin/articles/${article.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/articles/${article.id}/edit`}>
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
          <div className={styles.paginationInfo}>Hiển thị 1 đến 8 trong tổng số 42 bài viết</div>
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

