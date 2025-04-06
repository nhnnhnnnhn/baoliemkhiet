import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, Download, Edit, Eye, Filter, PenSquare, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import styles from "../../admin/admin.module.css"

export default function AuthorArticlesPage() {
  // Mock articles data
  const articles = [
    {
      id: "ART-001",
      title: "Đội tuyển Việt Nam giành chiến thắng ấn tượng tại vòng loại World Cup",
      status: "Đã xuất bản",
      category: "Thể thao",
      publishedAt: "04/04/2025",
      views: 10876,
      likes: 543,
      comments: 78,
    },
    {
      id: "ART-002",
      title: "Thị trường bất động sản phía Nam khởi sắc trong quý II",
      status: "Đã xuất bản",
      category: "Kinh doanh",
      publishedAt: "03/04/2025",
      views: 8932,
      likes: 421,
      comments: 56,
    },
    {
      id: "ART-003",
      title: "Dự báo tăng trưởng GDP Việt Nam năm 2025",
      status: "Chờ duyệt",
      category: "Kinh tế",
      publishedAt: "-",
      views: 0,
      likes: 0,
      comments: 0,
    },
    {
      id: "ART-004",
      title: "Những xu hướng thời trang nổi bật mùa hè 2025",
      status: "Bản nháp",
      category: "Thời trang",
      publishedAt: "-",
      views: 0,
      likes: 0,
      comments: 0,
    },
    {
      id: "ART-005",
      title: "Top 10 điểm du lịch hấp dẫn nhất Việt Nam trong mùa hè này",
      status: "Đã xuất bản",
      category: "Du lịch",
      publishedAt: "01/04/2025",
      views: 6789,
      likes: 321,
      comments: 45,
    },
    {
      id: "ART-006",
      title: "Cách phòng tránh các bệnh mùa hè thường gặp",
      status: "Đã xuất bản",
      category: "Sức khỏe",
      publishedAt: "28/03/2025",
      views: 5432,
      likes: 234,
      comments: 32,
    },
    {
      id: "ART-007",
      title: "Những món ăn giải nhiệt mùa hè được ưa chuộng",
      status: "Đã xuất bản",
      category: "Ẩm thực",
      publishedAt: "25/03/2025",
      views: 4567,
      likes: 198,
      comments: 27,
    },
    {
      id: "ART-008",
      title: "Công nghệ AI đang thay đổi ngành y tế như thế nào",
      status: "Từ chối",
      category: "Công nghệ",
      publishedAt: "-",
      views: 0,
      likes: 0,
      comments: 0,
      rejectionReason: "Nội dung cần bổ sung thêm dẫn chứng và nguồn tham khảo",
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý bài viết</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Báo Liêm Khiết</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Quản lý bài viết</div>
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
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
            <Link href="/author/articles/add">
              <Button size="sm">
                <PenSquare className="h-4 w-4 mr-2" />
                Viết bài mới
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
                <th className={styles.tableHeaderCell}>Trạng thái</th>
                <th className={styles.tableHeaderCell}>Chuyên mục</th>
                <th className={styles.tableHeaderCell}>Ngày xuất bản</th>
                <th className={styles.tableHeaderCell}>Lượt xem</th>
                <th className={styles.tableHeaderCell}>Tương tác</th>
                <th className={styles.tableHeaderCell}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{article.id}</td>
                  <td className={styles.tableCell}>
                    <div className="font-medium">{article.title}</div>
                    {article.rejectionReason && (
                      <div className="text-xs text-red-600 mt-1">Lý do từ chối: {article.rejectionReason}</div>
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === "Đã xuất bản"
                          ? "bg-green-100 text-green-800"
                          : article.status === "Chờ duyệt"
                            ? "bg-yellow-100 text-yellow-800"
                            : article.status === "Bản nháp"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{article.publishedAt}</td>
                  <td className={styles.tableCell}>{article.views.toLocaleString()}</td>
                  <td className={styles.tableCell}>
                    <div className="flex flex-col">
                      <span className="text-xs">
                        <span className="font-medium">{article.likes}</span> thích
                      </span>
                      <span className="text-xs">
                        <span className="font-medium">{article.comments}</span> bình luận
                      </span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className="flex space-x-2">
                      <Link href={`/author/articles/${article.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/author/articles/${article.id}/edit`}>
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
          <div className={styles.paginationInfo}>Hiển thị 1 đến 8 trong tổng số 15 bài viết</div>
          <div className={styles.paginationControls}>
            <button className={`${styles.paginationButton} ${styles.paginationButtonDisabled}`} disabled>
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button className={`${styles.paginationButton} ${styles.paginationButtonActive}`}>1</button>
            <button className={styles.paginationButton}>2</button>
            <button className={styles.paginationButton}>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

