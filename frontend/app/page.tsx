import Link from "next/link"
import { ArrowRightIcon, TrendingUpIcon, GlobeIcon, DollarSignIcon, MonitorIcon, ActivityIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import styles from "./page.module.css"

export default function Home() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className={styles.container}>
      <SiteHeader />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <span className={styles.heroCategory}>TIN NỔI BẬT</span>
            <h1 className={styles.heroTitle}>Hội nghị thượng đỉnh ASEAN khai mạc tại Hà Nội</h1>
            <p className={styles.heroDescription}>
              Lãnh đạo các nước ASEAN tập trung tại Hà Nội để thảo luận về hợp tác kinh tế và an ninh khu vực trong bối
              cảnh nhiều thách thức toàn cầu.
            </p>
            <Button className={styles.heroButton}>
              Đọc tiếp <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Breaking News Ticker */}
        <div className={styles.breakingNews}>
          <div className={styles.breakingNewsLabel}>MỚI NHẤT:</div>
          <div className={styles.breakingNewsContent}>
            Thủ tướng tiếp Đại sứ Hoa Kỳ • Giá vàng tăng mạnh phiên đầu tuần • Dự báo thời tiết: Miền Bắc đón không khí
            lạnh
          </div>
        </div>

        {/* Latest News Section */}
        <div className={styles.latestNewsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tin mới nhất</h2>
            <Link href="/tin-moi-nhat" className={styles.viewAllLink}>
              Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className={styles.newsGrid}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.newsCard}>
                <div className={styles.newsImage}>
                  <img
                    src={`/placeholder.svg?height=200&width=300&text=Tin ${item}`}
                    alt={`Tin ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={styles.newsContent}>
                  <span className={styles.newsCategory}>Thời sự</span>
                  <h3 className={styles.newsTitle}>
                    <Link href="/articles/1">Phát hiện loài động vật quý hiếm tại Vườn Quốc gia Cát Tiên</Link>
                  </h3>
                  <p className={styles.newsExcerpt}>
                    Các nhà khoa học đã ghi nhận sự xuất hiện của loài thú hiếm thuộc Sách Đỏ tại khu bảo tồn.
                  </p>
                  <span className={styles.newsTime}>2 giờ trước</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Sections */}
        <div className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <div className={styles.categoryIcon}>
              <TrendingUpIcon className="h-5 w-5" />
            </div>
            <h2 className={styles.categoryTitle}>Thời sự</h2>
            <Link href="/thoi-su" className={styles.viewAllLink}>
              Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className={styles.categoryGrid}>
            <div className={styles.categoryMainNews}>
              <div className={styles.categoryMainImage}>
                <img
                  src="/placeholder.svg?height=400&width=600&text=Thời sự"
                  alt="Tin thời sự chính"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className={styles.categoryMainTitle}>
                <Link href="/articles/2">Quốc hội thảo luận về dự án Luật Đất đai sửa đổi</Link>
              </h3>
              <p className={styles.categoryMainExcerpt}>
                Các đại biểu tập trung thảo luận về quyền sử dụng đất và chính sách bồi thường giải phóng mặt bằng.
              </p>
            </div>
            <div className={styles.categorySubNews}>
              {[1, 2, 3].map((item) => (
                <div key={item} className={styles.categorySubItem}>
                  <h4 className={styles.categorySubTitle}>
                    <Link href={`/articles/${item + 10}`}>Hà Nội mở rộng không gian đi bộ khu phố cổ</Link>
                  </h4>
                  <span className={styles.newsTime}>3 giờ trước</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <div className={styles.categoryIcon}>
              <GlobeIcon className="h-5 w-5" />
            </div>
            <h2 className={styles.categoryTitle}>Thế giới</h2>
            <Link href="/the-gioi" className={styles.viewAllLink}>
              Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className={styles.categoryGrid}>
            <div className={styles.categoryMainNews}>
              <div className={styles.categoryMainImage}>
                <img
                  src="/placeholder.svg?height=400&width=600&text=Thế giới"
                  alt="Tin thế giới chính"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className={styles.categoryMainTitle}>
                <Link href="/articles/3">Hội nghị thượng đỉnh G20 bàn về biến đổi khí hậu</Link>
              </h3>
              <p className={styles.categoryMainExcerpt}>
                Các nhà lãnh đạo cam kết giảm phát thải carbon và hỗ trợ các nước đang phát triển ứng phó với biến đổi
                khí hậu.
              </p>
            </div>
            <div className={styles.categorySubNews}>
              {[1, 2, 3].map((item) => (
                <div key={item} className={styles.categorySubItem}>
                  <h4 className={styles.categorySubTitle}>
                    <Link href={`/articles/${item + 20}`}>Căng thẳng địa chính trị gia tăng tại Trung Đông</Link>
                  </h4>
                  <span className={styles.newsTime}>5 giờ trước</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className={styles.twoColumnLayout}>
          <div className={styles.columnLeft}>
            {/* Kinh doanh Section */}
            <div className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  <DollarSignIcon className="h-5 w-5" />
                </div>
                <h2 className={styles.categoryTitle}>Kinh doanh</h2>
                <Link href="/kinh-doanh" className={styles.viewAllLink}>
                  Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className={styles.smallCategoryGrid}>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={styles.smallNewsCard}>
                    <div className={styles.smallNewsImage}>
                      <img
                        src={`/placeholder.svg?height=120&width=180&text=Kinh doanh ${item}`}
                        alt={`Tin kinh doanh ${item}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className={styles.smallNewsTitle}>
                      <Link href={`/articles/${item + 30}`}>Thị trường chứng khoán Việt Nam tăng điểm mạnh</Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.columnRight}>
            {/* Công nghệ Section */}
            <div className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  <MonitorIcon className="h-5 w-5" />
                </div>
                <h2 className={styles.categoryTitle}>Công nghệ</h2>
                <Link href="/cong-nghe" className={styles.viewAllLink}>
                  Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className={styles.smallCategoryGrid}>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={styles.smallNewsCard}>
                    <div className={styles.smallNewsImage}>
                      <img
                        src={`/placeholder.svg?height=120&width=180&text=Công nghệ ${item}`}
                        alt={`Tin công nghệ ${item}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className={styles.smallNewsTitle}>
                      <Link href={`/articles/${item + 40}`}>Công nghệ AI đang thay đổi ngành y tế Việt Nam</Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thể thao Section */}
        <div className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <div className={styles.categoryIcon}>
              <ActivityIcon className="h-5 w-5" />
            </div>
            <h2 className={styles.categoryTitle}>Thể thao</h2>
            <Link href="/the-thao" className={styles.viewAllLink}>
              Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className={styles.sportsGrid}>
            {[1, 2, 3].map((item) => (
              <div key={item} className={styles.sportsCard}>
                <div className={styles.sportsImage}>
                  <img
                    src={`/placeholder.svg?height=250&width=400&text=Thể thao ${item}`}
                    alt={`Tin thể thao ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={styles.sportsTitle}>
                  <Link href={`/articles/${item + 50}`}>Đội tuyển Việt Nam chuẩn bị cho vòng loại World Cup</Link>
                </h3>
                <p className={styles.sportsExcerpt}>
                  HLV Park Hang-seo công bố danh sách 30 cầu thủ cho đợt tập trung sắp tới.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Opinion Section */}
        <div className={styles.opinionSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Góc nhìn</h2>
            <Link href="/goc-nhin" className={styles.viewAllLink}>
              Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className={styles.opinionGrid}>
            <div className={styles.opinionCard}>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Nguyễn Thị Minh</h3>
                  <p className={styles.authorTitle}>Chuyên gia Kinh tế</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>Tương lai của giao thông đô thị Việt Nam</h4>
              <p className={styles.opinionExcerpt}>
                Các thành phố lớn cần tái cấu trúc hệ thống giao thông để giải quyết vấn đề ùn tắc và ô nhiễm.
              </p>
            </div>
            <div className={styles.opinionCard}>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Trần Văn Hùng</h3>
                  <p className={styles.authorTitle}>Biên tập viên Kinh tế</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>Cải tổ chuỗi cung ứng toàn cầu</h4>
              <p className={styles.opinionExcerpt}>
                Những biến động gần đây cho thấy sự cần thiết phải đa dạng hóa nguồn cung và giảm phụ thuộc.
              </p>
            </div>
            <div className={styles.opinionCard}>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Lê Thị Hương</h3>
                  <p className={styles.authorTitle}>Phóng viên Khoa học</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>Đạo đức trong ứng dụng AI y tế</h4>
              <p className={styles.opinionExcerpt}>
                Cân bằng giữa đổi mới và bảo vệ quyền riêng tư khi trí tuệ nhân tạo ngày càng phổ biến trong y học.
              </p>
            </div>
          </div>
        </div>

        {/* Trending Section */}
        <div className={styles.trendingSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Xu hướng</h2>
          </div>
          <div className={styles.trendingGrid}>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className={styles.trendingItem}>
                <span className={styles.trendingNumber}>{item}</span>
                <div className={styles.trendingContent}>
                  <h3 className={styles.trendingTitle}>
                    <Link href={`/articles/${item + 60}`}>Giá xăng dầu dự kiến tăng mạnh từ ngày mai</Link>
                  </h3>
                  <span className={styles.trendingViews}>2.5K lượt đọc</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton />
      </div>
    </div>
  )
}
