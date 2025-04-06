import Link from "next/link"
import { ArrowRightIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "./page.module.css"

export default function TheThaoPagе() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>Thể Thao</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="#" className={styles.navLink}>
              Bóng đá
            </Link>
            <Link href="#" className={styles.navLink}>
              Bóng rổ
            </Link>
            <Link href="#" className={styles.navLink}>
              Quần vợt
            </Link>
            <Link href="#" className={styles.navLink}>
              Đua xe F1
            </Link>
            <Link href="#" className={styles.navLink}>
              Võ thuật
            </Link>
            <Link href="#" className={styles.navLink}>
              Esports
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button className="bg-black text-white hover:bg-gray-800">Đăng ký</Button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroGrid}>
            <div className={styles.heroImage}>
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Featured Sports Story"
                className="w-full h-full object-cover"
              />
              <div className={styles.premiumBadge}>PREMIUM</div>
            </div>
            <div className={styles.heroContent}>
              <div className={styles.categoryTag}>
                <span className={styles.categoryName}>BÓNG ĐÁ</span>
                <span className={styles.timestamp}>12 giờ trước</span>
              </div>
              <h1 className={styles.heroTitle}>Ronaldo ghi bàn quyết định, Al Nassr tiến vào chung kết</h1>
              <p className={styles.heroDescription}>
                Cristiano Ronaldo đã có pha lập công quan trọng ở phút 89, giúp Al Nassr giành chiến thắng 2-1 trước Al
                Hilal và tiến vào chung kết Saudi Pro League Cup.
              </p>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <p className={styles.authorName}>Nguyễn Văn A</p>
                  <p className={styles.authorTitle}>Phóng viên Bóng đá</p>
                </div>
              </div>
              <Button className="self-start flex items-center">
                Đọc tiếp <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Stories */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Tin nổi bật</h2>
          <div className={styles.featuredGrid}>
            {[1, 2, 3].map((item) => (
              <div key={item} className={styles.featuredCard}>
                <div className={styles.featuredImage}>
                  <img
                    src={`/placeholder.svg?height=300&width=400&text=Sports ${item}`}
                    alt={`Sports Story ${item}`}
                    className="w-full h-full object-cover"
                  />
                  {item === 1 && <div className={styles.premiumBadge}>PREMIUM</div>}
                </div>
                <div className={styles.featuredCategoryTag}>
                  <span className={styles.categoryName}>BÓNG RỔ</span>
                  <span className={styles.timestamp}>8 giờ trước</span>
                </div>
                <h3 className={styles.featuredTitle}>
                  Lakers giành chiến thắng kịch tính trước Warriors trong trận đấu overtime
                </h3>
                <p className={styles.featuredDescription}>
                  LeBron James ghi 32 điểm, 11 rebounds và 9 assists, dẫn dắt Lakers vượt qua Warriors với tỷ số 124-120
                  sau hiệp phụ.
                </p>
                <div className={styles.featuredAuthor}>
                  <div className={styles.featuredAuthorAvatar}></div>
                  <p className={styles.featuredAuthorName}>Trần Văn B</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sports Categories */}
        <section className={styles.categoriesSection}>
          <div className={styles.categoriesGrid}>
            {/* Football Section */}
            <div>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>Bóng đá</h2>
                <Link href="#" className={styles.viewAllLink}>
                  Xem tất cả <ArrowRightIcon className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className={styles.categoryStories}>
                {[1, 2, 3].map((item) => (
                  <div key={item} className={styles.storyCard}>
                    <div className={styles.storyImage}>
                      <img
                        src={`/placeholder.svg?height=100&width=100&text=Football ${item}`}
                        alt={`Football Story ${item}`}
                        className="w-full h-full object-cover"
                      />
                      {item === 2 && (
                        <div className="absolute top-1 left-1 bg-yellow-400 text-black px-1 py-0.5 text-[10px] font-bold">
                          PREMIUM
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className={styles.storyTitle}>Manchester City thắng áp đảo trước Newcastle với tỷ số 4-0</h3>
                      <p className={styles.storyTimestamp}>6 giờ trước</p>
                      <p className={styles.storyAuthor}>Lê Văn C</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Basketball Section */}
            <div>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>Bóng rổ</h2>
                <Link href="#" className={styles.viewAllLink}>
                  Xem tất cả <ArrowRightIcon className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className={styles.categoryStories}>
                {[1, 2, 3].map((item) => (
                  <div key={item} className={styles.storyCard}>
                    <div className={styles.storyImage}>
                      <img
                        src={`/placeholder.svg?height=100&width=100&text=Basketball ${item}`}
                        alt={`Basketball Story ${item}`}
                        className="w-full h-full object-cover"
                      />
                      {item === 1 && (
                        <div className="absolute top-1 left-1 bg-yellow-400 text-black px-1 py-0.5 text-[10px] font-bold">
                          PREMIUM
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className={styles.storyTitle}>
                        Boston Celtics tiếp tục duy trì mạch thắng với chiến thắng thứ 8 liên tiếp
                      </h3>
                      <p className={styles.storyTimestamp}>4 giờ trước</p>
                      <p className={styles.storyAuthor}>Phạm Thị D</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Premium Content Banner */}
        <section className={styles.premiumBanner}>
          <div className={styles.premiumBannerContent}>
            <div className={styles.premiumBannerText}>
              <div className={styles.premiumBannerTitle}>
                <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <h2 className={styles.premiumBannerTitleText}>Thể Thao Premium</h2>
              </div>
              <p className={styles.premiumBannerDescription}>
                Truy cập vào các bài viết chuyên sâu, phân tích chuyên môn và nội dung độc quyền từ các phóng viên hàng
                đầu của chúng tôi.
              </p>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Đăng ký ngay</Button>
            </div>
            <div className={styles.premiumBannerImage}>
              <img
                src="/placeholder.svg?height=160&width=160"
                alt="Premium Subscription"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className={styles.latestNewsSection}>
          <h2 className={styles.sectionTitle}>Tin mới nhất</h2>
          <div className={styles.latestNewsGrid}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.latestNewsCard}>
                <div className={styles.latestNewsImage}>
                  <img
                    src={`/placeholder.svg?height=180&width=320&text=News ${item}`}
                    alt={`Latest News ${item}`}
                    className="w-full h-full object-cover"
                  />
                  {item === 3 && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 text-xs font-bold">
                      PREMIUM
                    </div>
                  )}
                </div>
                <div className={styles.featuredCategoryTag}>
                  <span className={styles.categoryName}>TENNIS</span>
                  <span className={styles.timestamp}>2 giờ trước</span>
                </div>
                <h3 className={styles.latestNewsTitle}>
                  Novak Djokovic vào bán kết Roland Garros sau trận đấu kịch tính
                </h3>
                <p className={styles.storyAuthor}>Hoàng Văn E</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div>
              <h3 className={styles.footerLogo}>Thể Thao</h3>
              <p className={styles.footerDescription}>
                Thông tin thể thao chuyên sâu, phân tích chuyên môn và tin tức độc quyền từ các phóng viên hàng đầu.
              </p>
            </div>
            <div>
              <h4 className={styles.footerSectionTitle}>Môn thể thao</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Bóng đá
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Bóng rổ
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Quần vợt
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Đua xe F1
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Võ thuật
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Esports
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerSectionTitle}>Giải đấu</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    V-League
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Premier League
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Champions League
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    NBA
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Grand Slam
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    SEA Games
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerSectionTitle}>Tài khoản</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Đăng ký
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Quản lý tài khoản
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Gói Premium
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Hỗ trợ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Thể Thao. Tất cả các quyền được bảo lưu.</p>
            <div className={styles.footerBottomLinks}>
              <Link href="#" className={styles.footerBottomLink}>
                Điều khoản sử dụng
              </Link>
              <Link href="#" className={styles.footerBottomLink}>
                Chính sách bảo mật
              </Link>
              <Link href="#" className={styles.footerBottomLink}>
                Cookie
              </Link>
              <Link href="#" className={styles.footerBottomLink}>
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

