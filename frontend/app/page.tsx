"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRightIcon, TrendingUpIcon, GlobeIcon, DollarSignIcon, MonitorIcon, ActivityIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Skeleton } from "@/components/ui/skeleton"
import styles from "./page.module.css"
import articleApi from "@/src/apis/article"
import { Article } from "@/src/apis/article"

export default function Home() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  
  // State cho dữ liệu bài viết
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [newsByCategory, setNewsByCategory] = useState<Record<string, Article[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Các danh mục muốn hiển thị trên trang chủ
  const categories = [
    { id: 1, name: 'Thời sự', slug: 'thoi-su', icon: <TrendingUpIcon className="h-5 w-5" /> },
    { id: 2, name: 'Thế giới', slug: 'the-gioi', icon: <GlobeIcon className="h-5 w-5" /> },
    { id: 3, name: 'Kinh doanh', slug: 'kinh-doanh', icon: <DollarSignIcon className="h-5 w-5" /> },
    { id: 4, name: 'Công nghệ', slug: 'cong-nghe', icon: <MonitorIcon className="h-5 w-5" /> }
  ]
  
  // Lấy dữ liệu bài viết khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Lấy bài viết mới nhất
        const latestResponse = await articleApi.getArticles({ 
          limit: 4, 
          page: 1, 
          status: 'PUBLISHED',
          sort: 'published_at',
          order: 'desc'
        })
        setLatestArticles(latestResponse.articles || [])
        
        // Nếu có bài viết mới nhất thì đặt bài đầu tiên làm bài nổi bật
        if (latestResponse.articles && latestResponse.articles.length > 0) {
          setFeaturedArticle(latestResponse.articles[0])
        }
        
        // Lấy bài viết theo từng danh mục
        const categoryNews: Record<string, Article[]> = {}
        for (const category of categories) {
          try {
            const response = await articleApi.getArticlesByCategory(category.id)
            categoryNews[category.slug] = response || []
          } catch (err) {
            console.error(`Lỗi khi lấy bài viết danh mục ${category.name}:`, err)
            categoryNews[category.slug] = []
          }
        }
        setNewsByCategory(categoryNews)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu bài viết:', err)
        setError('Không thể tải dữ liệu bài viết. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className={styles.container}>
      <SiteHeader />

      {/* Hero Section */}
      {isLoading ? (
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      ) : featuredArticle ? (
        <div 
          className={styles.heroSection}
          style={{ 
            backgroundImage: `url("${featuredArticle.thumbnail || 'https://placehold.co/1920x1080/eee/999?text=Báo+Liêm+Khiết'}")`
          }}
        >
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <span className={styles.heroCategory}>
                {featuredArticle.category?.name || 'TIN NỔI BẬT'}
              </span>
              <h1 className={styles.heroTitle}>{featuredArticle.title}</h1>
              <p className={styles.heroDescription}>
                {featuredArticle.content.length > 200 
                  ? featuredArticle.content.substring(0, 200) + '...'
                  : featuredArticle.content}
              </p>
              <Link href={`/article/${featuredArticle.id}`}>
                <Button className={styles.heroButton}>
                  Đọc tiếp <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <span className={styles.heroCategory}>TIN NỔI BẬT</span>
              <h1 className={styles.heroTitle}>Chào mừng đến với Báo Liêm Khiết</h1>
              <p className={styles.heroDescription}>
                Cập nhật tin tức mới nhất về thời sự, kinh tế, chính trị và nhiều lĩnh vực khác.
              </p>
              <Button className={styles.heroButton}>
                Khám phá ngay <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

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
            {isLoading ? (
              // Hiển thị skeleton loading
              Array(4).fill(0).map((_, index) => (
                <div key={index} className={styles.newsCard}>
                  <div className={styles.newsImage}>
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className={styles.newsContent}>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))
            ) : latestArticles.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p>Không có bài viết nào.</p>
              </div>
            ) : (
              latestArticles.map((article) => (
                <div key={article.id} className={styles.newsCard}>
                  <div className={styles.newsImage}>
                    <img
                      src={article.thumbnail || `/placeholder.svg?height=200&width=300&text=Bài+viết`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={styles.newsContent}>
                    <span className={styles.newsCategory}>{article.category?.name || 'Tin tức'}</span>
                    <h3 className={styles.newsTitle}>
                      <Link href={`/article/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p className={styles.newsExcerpt}>
                      {article.content.length > 100 
                        ? article.content.substring(0, 100) + '...'
                        : article.content}
                    </p>
                    <span className={styles.newsTime}>
                      {article.published_at 
                        ? new Date(article.published_at).toLocaleDateString('vi-VN')
                        : new Date(article.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Sections */}
        {categories.map((category) => (
          <div key={category.id} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <div className={styles.categoryIcon}>
                {category.icon}
              </div>
              <h2 className={styles.categoryTitle}>{category.name}</h2>
              <Link href={`/${category.slug}`} className={styles.viewAllLink}>
                Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className={styles.categoryGrid}>
              {isLoading ? (
                <div>
                  <div className={styles.categoryMainNews}>
                    <div className={styles.categoryMainImage}>
                      <Skeleton className="w-full h-full" />
                    </div>
                    <Skeleton className="h-8 w-full mt-2 mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                  <div className={styles.categorySubNews}>
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className={styles.categorySubItem}>
                        <Skeleton className="h-6 w-full mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                </div>
              </div>
              ) : newsByCategory[category.slug]?.length ? (
                <div>
                  <div className={styles.categoryMainNews}>
                    <div className={styles.categoryMainImage}>
                      <img
                        src={newsByCategory[category.slug][0]?.thumbnail || 
                          `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(category.name)}`}
                        alt={newsByCategory[category.slug][0]?.title || `Tin ${category.name} chính`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className={styles.categoryMainTitle}>
                      <Link href={`/article/${newsByCategory[category.slug][0]?.id}`}>
                        {newsByCategory[category.slug][0]?.title || `Tin mới về ${category.name}`}
                      </Link>
                    </h3>
                    <p className={styles.categoryMainExcerpt}>
                      {newsByCategory[category.slug][0]?.content?.length > 150
                        ? newsByCategory[category.slug][0]?.content.substring(0, 150) + '...'
                        : newsByCategory[category.slug][0]?.content || `Không có nội dung cho tin ${category.name}`}
                    </p>
                  </div>
                  <div className={styles.categorySubNews}>
                    {newsByCategory[category.slug].slice(1, 4).map((article, index) => (
                      <div key={index} className={styles.categorySubItem}>
                        <h3 className={styles.categorySubTitle}>
                          <Link href={`/article/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <span className={styles.categorySubDate}>
                          {article.published_at 
                            ? new Date(article.published_at).toLocaleDateString('vi-VN')
                            : new Date(article.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="col-span-full text-center py-8">
                  <p>Không có bài viết nào trong danh mục {category.name}</p>
                </div>
              )}
            </div>
          </div>
        ))}

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
                        src={`/kinh-doanh-concept.png?height=120&width=180&text=Kinh doanh ${item}`}
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
                        src={`/placeholder-technology.png?height=120&width=180&text=Công nghệ ${item}`}
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
                    src={`/the-thao-collage.png?height=250&width=400&text=Thể thao ${item}`}
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
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className={styles.opinionCard}>
                  <div className={styles.authorBox}>
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : latestArticles.length >= 3 ? (
              latestArticles.slice(0, 3).map((article, index) => (
                <div key={article.id} className={styles.opinionCard}>
                  <div className={styles.authorBox}>
                    <div className={styles.authorAvatar}></div>
                    <div>
                      <h3 className={styles.authorName}>{article.author?.name || 'Tác giả'}</h3>
                      <p className={styles.authorTitle}>{article.category?.name || 'Biên tập viên'}</p>
                    </div>
                  </div>
                  <h4 className={styles.opinionTitle}>
                    <Link href={`/article/${article.id}`}>{article.title}</Link>
                  </h4>
                  <p className={styles.opinionExcerpt}>
                    {article.content?.length > 120 ? article.content.substring(0, 120) + '...' : article.content}
                  </p>
                </div>
              ))
            ) : (
              <div className={styles.noContent}>
                <p>Không có bài viết nào trong mục Góc nhìn</p>
              </div>
            )}
          </div>
        </div>

        {/* Trending Section */}
        <div className={styles.trendingSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Xu hướng</h2>
          </div>
          <div className={styles.trendingGrid}>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <div key={index} className={styles.trendingItem}>
                  <span className={styles.trendingNumber}>{index + 1}</span>
                  <div className={styles.trendingContent}>
                    <Skeleton className="h-6 w-full mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))
            ) : (
              latestArticles.slice(0, 5).map((article, index) => (
                <div key={article.id} className={styles.trendingItem}>
                  <span className={styles.trendingNumber}>{index + 1}</span>
                  <div className={styles.trendingContent}>
                    <h3 className={styles.trendingTitle}>
                      <Link href={`/article/${article.id}`}>{article.title}</Link>
                    </h3>
                    <span className={styles.trendingViews}>{article.view_count || 0} lượt đọc</span>
                  </div>
                </div>
              ))
            )}
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
