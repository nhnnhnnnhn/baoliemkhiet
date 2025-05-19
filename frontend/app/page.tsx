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
  
  // Các danh mục muốn hiển thị trên trang chủ (với ID chính xác từ database)
  const categories = [
    { id: 2, name: 'Thời sự', slug: 'thoi-su', icon: <TrendingUpIcon className="h-5 w-5" /> },
    { id: 8, name: 'Thế giới', slug: 'the-gioi', icon: <GlobeIcon className="h-5 w-5" /> },
    { id: 7, name: 'Kinh doanh', slug: 'kinh-doanh', icon: <DollarSignIcon className="h-5 w-5" /> },
    { id: 9, name: 'Công nghệ', slug: 'cong-nghe', icon: <MonitorIcon className="h-5 w-5" /> },
    { id: 10, name: 'Thể thao', slug: 'the-thao', icon: <ActivityIcon className="h-5 w-5" /> }
  ]
  
  // Lấy dữ liệu bài viết khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Lấy bài viết mới nhất từ danh mục "Thời sự" (ID: 2) làm bài nổi bật
        // Trước hết lấy tất cả bài viết thời sự rồi chọn bài mới nhất
        const thoiSuResponse = await articleApi.getArticlesByCategory(2)
        
        // Đặt bài viết thời sự mới nhất làm bài nổi bật
        if (thoiSuResponse && thoiSuResponse.articles && thoiSuResponse.articles.length > 0) {
          // Sắp xếp theo thời gian xuất bản mới nhất trước
          const sortedArticles = [...thoiSuResponse.articles].sort((a, b) => {
            const dateA = a.publishedAt || a.created_at;
            const dateB = b.publishedAt || b.created_at;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
          setFeaturedArticle(sortedArticles[0])
        } else if (Array.isArray(thoiSuResponse) && thoiSuResponse.length > 0) {
          // Sắp xếp theo thời gian xuất bản mới nhất trước
          const sortedArticles = [...thoiSuResponse].sort((a, b) => {
            const dateA = a.publishedAt || a.created_at;
            const dateB = b.publishedAt || b.created_at;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
          setFeaturedArticle(sortedArticles[0])
        }
        
        // Lấy các bài viết mới nhất cho phần tin mới nhất
        const latestResponse = await articleApi.getArticles({ 
          limit: 4, 
          page: 1, 
          status: 'PUBLISHED',
          sort: 'published_at',
          order: 'desc'
        })
        setLatestArticles(latestResponse.articles || [])
        
        console.log('Bắt đầu tải dữ liệu danh mục')
        // Lấy bài viết theo từng danh mục
        const categoryNews: Record<string, Article[]> = {}
        
        // Khởi tạo các danh mục với mảng rỗng
        categories.forEach(cat => {
          categoryNews[cat.slug] = []
        })
        
        // Lấy bài viết theo từng danh mục
        for (const category of categories) {
          try {
            console.log(`Đang lấy bài viết danh mục ${category.name} (ID: ${category.id})`)
            const response = await articleApi.getArticlesByCategory(category.id)
            
            // Kiểm tra và trích xuất bài viết từ response
            if (response && response.articles && Array.isArray(response.articles)) {
              console.log(`Tìm thấy ${response.articles.length} bài viết cho danh mục ${category.name}`)
              categoryNews[category.slug] = response.articles
            } else if (Array.isArray(response)) {
              console.log(`Tìm thấy ${response.length} bài viết cho danh mục ${category.name} (response là mảng)`)
              categoryNews[category.slug] = response
            } else {
              console.log(`Không có bài viết cho danh mục ${category.name} hoặc dữ liệu không đúng định dạng`, response)
              categoryNews[category.slug] = []
            }
          } catch (err) {
            console.error(`Lỗi khi lấy bài viết danh mục ${category.name}:`, err)
            categoryNews[category.slug] = []
          }
        }
        
        // Hiển thị tổng hợp số lượng bài viết theo danh mục
        Object.keys(categoryNews).forEach(slug => {
          console.log(`Danh mục ${slug}: ${categoryNews[slug].length} bài viết`)
        })
        
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
            // Truyền biến custom property cho background image
            // Biến này sẽ được sử dụng trong CSS module
            // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
            ['--bg-url' as any]: `url('${featuredArticle.thumbnail || 'https://placehold.co/1920x1080/eee/999?text=Báo+Liêm+Khiết'}')`
          }}
        >
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <span className={styles.heroCategory}>
                {featuredArticle.category?.name || 'THỜI SỰ'}
              </span>
              <h1 className={styles.heroTitle}>{featuredArticle.title}</h1>
              <div 
                className={styles.heroDescription}
                dangerouslySetInnerHTML={{
                  __html: featuredArticle.content.length > 200 
                    ? featuredArticle.content.substring(0, 200) + '...'
                    : featuredArticle.content
                }}
              />
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
                    <div 
                      className={styles.categoryMainExcerpt}
                      dangerouslySetInnerHTML={{
                        __html: newsByCategory[category.slug][0]?.content?.length > 150
                          ? newsByCategory[category.slug][0]?.content.substring(0, 150) + '...'
                          : newsByCategory[category.slug][0]?.content || `Không có nội dung cho tin ${category.name}`
                      }}
                    />
                  </div>
                  <div className={styles.categorySubNews}>
                    {newsByCategory[category.slug].slice(1, 4).map((article, index) => (
                      <div key={index} className={styles.categorySubItem}>
                        <h3 className={styles.categorySubTitle}>
                          <Link href={`/article/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <p className={styles.featuredMeta}>
                          <span>{article.category?.name || 'Tin tức'}</span> · 
                          <span>
                            {article.published_at 
                              ? (() => {
                                  try {
                                    const date = new Date(article.published_at);
                                    return !isNaN(date.getTime()) 
                                      ? date.toLocaleDateString('vi-VN')
                                      : 'Chưa xuất bản';
                                  } catch (error) {
                                    console.error('Lỗi định dạng ngày:', error);
                                    return 'Chưa xuất bản';
                                  }
                                })()
                              : 'Chưa xuất bản'
                            }
                          </span>
                        </p>
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
                {isLoading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className={styles.smallNewsCard}>
                      <div className={styles.smallNewsImage}>
                        <Skeleton className="w-full h-full" />
                      </div>
                      <Skeleton className="h-4 w-full mt-2" />
                    </div>
                  ))
                ) : newsByCategory['kinh-doanh']?.length ? (
                  newsByCategory['kinh-doanh'].slice(0, 4).map((article) => (
                    <div key={article.id} className={styles.smallNewsCard}>
                      <div className={styles.smallNewsImage}>
                        <img
                          src={article.thumbnail || `/kinh-doanh-concept.png?height=120&width=180&text=Kinh doanh`}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className={styles.smallNewsTitle}>
                        <Link href={`/article/${article.id}`}>{article.title}</Link>
                      </h4>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4">
                    <p>Không có bài viết nào trong danh mục Kinh doanh</p>
                  </div>
                )}
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
                {isLoading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className={styles.smallNewsCard}>
                      <div className={styles.smallNewsImage}>
                        <Skeleton className="w-full h-full" />
                      </div>
                      <Skeleton className="h-4 w-full mt-2" />
                    </div>
                  ))
                ) : newsByCategory['cong-nghe']?.length ? (
                  newsByCategory['cong-nghe'].slice(0, 4).map((article) => (
                    <div key={article.id} className={styles.smallNewsCard}>
                      <div className={styles.smallNewsImage}>
                        <img
                          src={article.thumbnail || `/placeholder-technology.png?height=120&width=180&text=Công nghệ`}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className={styles.smallNewsTitle}>
                        <Link href={`/article/${article.id}`}>{article.title}</Link>
                      </h4>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4">
                    <p>Không có bài viết nào trong danh mục Công nghệ</p>
                  </div>
                )}
              </div>
            </div>
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