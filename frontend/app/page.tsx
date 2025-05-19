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
        {/* Hiển thị Thời sự */}
        {(() => {
          const thoiSu = categories.find(c => c.slug === 'thoi-su');
          if (!thoiSu) return null;
          
          return (
            <div key={thoiSu.id} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  {thoiSu.icon}
                </div>
                <h2 className={styles.categoryTitle}>{thoiSu.name}</h2>
                <Link href={`/${thoiSu.slug}`} className={styles.viewAllLink}>
                  Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className={styles.categoryGrid}>
                {isLoading ? (
                  <>
                    {/* Skeleton cho cột trái - 2 tin với ảnh */}
                    <div className={styles.categorySideNews}>
                      {Array(2).fill(0).map((_, i) => (
                        <div key={i} className={styles.categorySideItem}>
                          <div className={styles.categorySideImage}>
                            <Skeleton className="w-full h-full" />
                          </div>
                          <Skeleton className="h-6 w-full mb-1" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Skeleton cho cột giữa - tin chính */}
                    <div className={styles.categoryMainNews}>
                      <div className={styles.categoryMainImage}>
                        <Skeleton className="w-full h-full" />
                      </div>
                      <Skeleton className="h-8 w-full mt-2 mb-2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                    
                    {/* Skeleton cho cột phải - 7 tin chỉ có tiêu đề */}
                    <div className={styles.categorySubNews}>
                      {Array(7).fill(0).map((_, i) => (
                        <div key={i} className={styles.categorySubItem}>
                          <Skeleton className="h-6 w-full mb-1" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : newsByCategory[thoiSu.slug]?.length ? (
                  <>
                    {/* Cột trái: 2 tin ở bên trái có ảnh và tiêu đề */}
                    <div className={styles.categorySideNews}>
                      {newsByCategory[thoiSu.slug].slice(1, 3).length > 0 && 
                        newsByCategory[thoiSu.slug].slice(1, 3).map((article, index) => (
                          <div key={index} className={styles.categorySideItem}>
                            <div className={styles.categorySideImage}>
                              <img
                                src={article.thumbnail || 
                                  `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(thoiSu.name)}`}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className={styles.categorySubTitle}>
                              <Link href={`/article/${article.id}`}>
                                {article.title}
                              </Link>
                            </h3>
                          </div>
                        ))
                      }
                    </div>
                    
                    {/* Cột giữa: Tin chính ở giữa */}
                    <div className={styles.categoryMainNews}>
                      <div className={styles.categoryMainImage}>
                        <img
                          src={newsByCategory[thoiSu.slug][0]?.thumbnail || 
                            `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(thoiSu.name)}`}
                          alt={newsByCategory[thoiSu.slug][0]?.title || `Tin ${thoiSu.name} chính`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className={styles.categoryMainTitle}>
                        <Link href={`/article/${newsByCategory[thoiSu.slug][0]?.id}`}>
                          {newsByCategory[thoiSu.slug][0]?.title || `Tin mới về ${thoiSu.name}`}
                        </Link>
                      </h3>
                      <div 
                        className={styles.categoryMainExcerpt}
                        dangerouslySetInnerHTML={{
                          __html: newsByCategory[thoiSu.slug][0]?.content?.length > 150
                            ? newsByCategory[thoiSu.slug][0]?.content.substring(0, 150) + '...'
                            : newsByCategory[thoiSu.slug][0]?.content || `Không có nội dung cho tin ${thoiSu.name}`
                        }}
                      />
                    </div>
                    
                    {/* Cột phải: 7 tin mới ở bên phải, chỉ có tiêu đề */}
                    <div className={styles.categorySubNews}>
                      {newsByCategory[thoiSu.slug].slice(3, 10).map((article, index) => (
                        <div key={index} className={styles.categorySubItem}>
                          <h3 className={styles.categorySubTitle}>
                            <Link href={`/article/${article.id}`}>
                              {article.title}
                            </Link>
                          </h3>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p>Không có bài viết nào trong danh mục {thoiSu.name}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        
        {/* Hiển thị Thế giới với layout đặc biệt */}
        {(() => {
          const theGioi = categories.find(c => c.slug === 'the-gioi');
          if (!theGioi) return null;
          
          return (
            <div className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  <GlobeIcon className="h-5 w-5" />
                </div>
                <h2 className={styles.categoryTitle}>{theGioi.name}</h2>
                <Link href="/the-gioi" className={styles.viewAllLink}>
                  Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className={styles.worldNewsGrid}>
                {isLoading ? (
                  <>
                    {/* Skeleton cho bài chính bên trái */}
                    <div className={styles.worldNewsMain}>
                      <div className={styles.worldNewsMainImage}>
                        <Skeleton className="w-full h-full" />
                      </div>
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    
                    {/* Skeleton cho 2 bài bên phải */}
                    <div className={styles.worldNewsRight}>
                      {Array(2).fill(0).map((_, i) => (
                        <div key={i} className={styles.worldNewsItem}>
                          <div className={styles.worldNewsItemImage}>
                            <Skeleton className="w-full h-full" />
                          </div>
                          <Skeleton className="h-6 w-full" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : newsByCategory['the-gioi']?.length ? (
                  <>
                    {/* Bài viết chính bên trái */}
                    <div className={styles.worldNewsMain}>
                      <div className={styles.worldNewsMainImage}>
                        <img
                          src={newsByCategory['the-gioi'][0]?.thumbnail || 
                            `https://placehold.co/800x400/eee/999?text=${encodeURIComponent('Thế giới')}`}
                          alt={newsByCategory['the-gioi'][0]?.title || 'Tin thế giới'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className={styles.worldNewsMainTitle}>
                        <Link href={`/article/${newsByCategory['the-gioi'][0]?.id}`}>
                          {newsByCategory['the-gioi'][0]?.title || 'Tin mới về thế giới'}
                        </Link>
                      </h3>
                      <div 
                        className={styles.worldNewsMainExcerpt}
                        dangerouslySetInnerHTML={{
                          __html: newsByCategory['the-gioi'][0]?.content?.length > 200
                            ? newsByCategory['the-gioi'][0]?.content.substring(0, 200) + '...'
                            : newsByCategory['the-gioi'][0]?.content || 'Không có nội dung cho tin thế giới'
                        }}
                      />
                    </div>
                    
                    {/* 2 bài viết bên phải */}
                    <div className={styles.worldNewsRight}>
                      {newsByCategory['the-gioi'].slice(1, 3).map((article, index) => (
                        <div key={index} className={styles.worldNewsItem}>
                          <div className={styles.worldNewsItemImage}>
                            <img
                              src={article.thumbnail || 
                                `https://placehold.co/600x300/eee/999?text=${encodeURIComponent('Thế giới')}`}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className={styles.worldNewsItemTitle}>
                            <Link href={`/article/${article.id}`}>
                              {article.title}
                            </Link>
                          </h3>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p>Không có bài viết nào trong danh mục Thế giới</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        
        {/* Hiển thị Kinh doanh với layout đặc biệt */}
        {(() => {
          const kinhDoanh = categories.find(c => c.slug === 'kinh-doanh');
          if (!kinhDoanh) return null;
          
          return (
            <div className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  <DollarSignIcon className="h-5 w-5" />
                </div>
                <h2 className={styles.categoryTitle}>{kinhDoanh.name}</h2>
                <Link href="/kinh-doanh" className={styles.viewAllLink}>
                  Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className={styles.businessGrid}>
                {isLoading ? (
                  <>
                    {/* Skeleton cho bài chính bên trái */}
                    <div className={styles.businessMainArticle}>
                      <div className={styles.businessMainContent}>
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                      <div className={styles.businessMainImage}>
                        <Skeleton className="w-full h-full" style={{ minHeight: '300px' }} />
                      </div>
                    </div>
                    
                    {/* Skeleton cho 3 bài bên phải */}
                    <div className={styles.businessSideList}>
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className={styles.businessSideItem}>
                          <div className={styles.businessSideContent}>
                            <Skeleton className="h-6 w-full mb-1" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                          <div className={styles.businessSideImage}>
                            <Skeleton className="w-full h-full" style={{ minHeight: '80px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : newsByCategory['kinh-doanh']?.length ? (
                  <>
                    {/* Bài viết chính bên trái */}
                    <div className={styles.businessMainArticle}>
                      <div className={styles.businessMainContent}>
                        <h3 className={styles.businessMainTitle}>
                          <Link href={`/article/${newsByCategory['kinh-doanh'][0]?.id}`}>
                            {newsByCategory['kinh-doanh'][0]?.title || 'Tin mới về kinh doanh'}
                          </Link>
                        </h3>
                        <div 
                          className={styles.businessMainExcerpt}
                          dangerouslySetInnerHTML={{
                            __html: newsByCategory['kinh-doanh'][0]?.content?.length > 200
                              ? newsByCategory['kinh-doanh'][0]?.content.substring(0, 200) + '...'
                              : newsByCategory['kinh-doanh'][0]?.content || 'Không có nội dung cho tin kinh doanh'
                          }}
                        />
                      </div>
                      <div className={styles.businessMainImage}>
                        <img
                          src={newsByCategory['kinh-doanh'][0]?.thumbnail || 
                            `https://placehold.co/800x400/eee/999?text=${encodeURIComponent('Kinh doanh')}`}
                          alt={newsByCategory['kinh-doanh'][0]?.title || 'Tin kinh doanh'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* 3 bài viết bên phải */}
                    <div className={styles.businessSideList}>
                      {newsByCategory['kinh-doanh'].slice(1, 4).map((article, index) => (
                        <div key={index} className={styles.businessSideItem}>
                          <div className={styles.businessSideContent}>
                            <h3 className={styles.businessSideTitle}>
                              <Link href={`/article/${article.id}`}>
                                {article.title}
                              </Link>
                            </h3>
                            <p className={styles.featuredMeta}>
                              <span>{article.publishedAt 
                                ? new Date(article.publishedAt).toLocaleDateString('vi-VN')
                                : 'Chưa xuất bản'}
                              </span>
                            </p>
                          </div>
                          <div className={styles.businessSideImage}>
                            <img
                              src={article.thumbnail || 
                                `https://placehold.co/600x300/eee/999?text=${encodeURIComponent('Kinh doanh')}`}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p>Không có bài viết nào trong danh mục Kinh doanh</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Hiển thị Công nghệ với layout đặc biệt */}
        {(() => {
          const congNghe = categories.find(c => c.slug === 'cong-nghe');
          if (!congNghe) return null;
          
          return (
            <div className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  <MonitorIcon className="h-5 w-5" />
                </div>
                <h2 className={styles.categoryTitle}>{congNghe.name}</h2>
                <Link href="/cong-nghe" className={styles.viewAllLink}>
                  Xem tất cả <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className={styles.techGrid}>
                {isLoading ? (
                  <>
                    {/* Skeleton cho cột trái - 2 tin với ảnh */}
                    <div className={styles.techSideNews}>
                      {Array(2).fill(0).map((_, i) => (
                        <div key={i} className={styles.techSideItem}>
                          <div className={styles.techSideImage}>
                            <Skeleton className="w-full h-full" />
                          </div>
                          <Skeleton className="h-6 w-full mb-1" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Skeleton cho cột giữa - tin chính */}
                    <div className={styles.techMainNews}>
                      <div className={styles.categoryMainImage}>
                        <Skeleton className="w-full h-full" />
                      </div>
                      <Skeleton className="h-8 w-full mt-2 mb-2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                    
                    {/* Skeleton cho cột phải - 3 tin có ảnh và tiêu đề */}
                    <div className={styles.techSubNews}>
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className={styles.techSubItem}>
                          <div className={styles.techSubImage}>
                            <Skeleton className="w-full h-full" />
                          </div>
                          <Skeleton className="h-6 w-full mb-1" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : newsByCategory['cong-nghe']?.length ? (
                  <>
                    {/* Cột trái: 2 tin ở bên trái có ảnh và tiêu đề */}
                    <div className={styles.techSideNews}>
                      {newsByCategory['cong-nghe'].slice(1, 3).length > 0 && 
                        newsByCategory['cong-nghe'].slice(1, 3).map((article, index) => (
                          <div key={index} className={styles.techSideItem}>
                            <div className={styles.techSideImage}>
                              <img
                                src={article.thumbnail || 
                                  `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(congNghe.name)}`}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className={styles.categorySubTitle}>
                              <Link href={`/article/${article.id}`}>
                                {article.title}
                              </Link>
                            </h3>
                          </div>
                        ))
                      }
                    </div>
                    
                    {/* Cột giữa: Tin chính ở giữa */}
                    <div className={styles.techMainNews}>
                      <div className={styles.categoryMainImage}>
                        <img
                          src={newsByCategory['cong-nghe'][0]?.thumbnail || 
                            `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(congNghe.name)}`}
                          alt={newsByCategory['cong-nghe'][0]?.title || `Tin ${congNghe.name} chính`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className={styles.categoryMainTitle}>
                        <Link href={`/article/${newsByCategory['cong-nghe'][0]?.id}`}>
                          {newsByCategory['cong-nghe'][0]?.title || `Tin mới về ${congNghe.name}`}
                        </Link>
                      </h3>
                      <div 
                        className={styles.categoryMainExcerpt}
                        dangerouslySetInnerHTML={{
                          __html: newsByCategory['cong-nghe'][0]?.content?.length > 150
                            ? newsByCategory['cong-nghe'][0]?.content.substring(0, 150) + '...'
                            : newsByCategory['cong-nghe'][0]?.content || `Không có nội dung cho tin ${congNghe.name}`
                        }}
                      />
                    </div>
                    
                    {/* Cột phải: 3 tin với ảnh và tiêu đề */}
                    <div className={styles.techSubNews}>
                      {newsByCategory['cong-nghe'].slice(3, 6).map((article, index) => (
                        <div key={index} className={styles.techSubItem}>
                          <div className={styles.techSubImage}>
                            <img
                              src={article.thumbnail || 
                                `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(congNghe.name)}`}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className={styles.techSubTitle}>
                            <Link href={`/article/${article.id}`}>
                              {article.title}
                            </Link>
                          </h3>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p>Không có bài viết nào trong danh mục {congNghe.name}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Hiển thị các danh mục còn lại */}
        {categories.filter(category => !['thoi-su', 'the-gioi', 'kinh-doanh', 'cong-nghe'].includes(category.slug)).map((category) => (
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
                <>
                  {/* Skeleton cho cột trái - 2 tin với ảnh */}
                  <div className={styles.categorySideNews}>
                    {Array(2).fill(0).map((_, i) => (
                      <div key={i} className={styles.categorySideItem}>
                        <div className={styles.categorySideImage}>
                          <Skeleton className="w-full h-full" />
                        </div>
                        <Skeleton className="h-6 w-full mb-1" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Skeleton cho cột giữa - tin chính */}
                  <div className={styles.categoryMainNews}>
                    <div className={styles.categoryMainImage}>
                      <Skeleton className="w-full h-full" />
                    </div>
                    <Skeleton className="h-8 w-full mt-2 mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                  
                  {/* Skeleton cho cột phải - 7 tin chỉ có tiêu đề */}
                  <div className={styles.categorySubNews}>
                    {Array(7).fill(0).map((_, i) => (
                      <div key={i} className={styles.categorySubItem}>
                        <Skeleton className="h-6 w-full mb-1" />
                      </div>
                    ))}
                  </div>
                </>
              ) : newsByCategory[category.slug]?.length ? (
                <>
                  {/* Cột trái: 2 tin ở bên trái có ảnh và tiêu đề */}
                  <div className={styles.categorySideNews}>
                    {newsByCategory[category.slug].slice(1, 3).length > 0 && 
                      newsByCategory[category.slug].slice(1, 3).map((article, index) => (
                        <div key={index} className={styles.categorySideItem}>
                          <div className={styles.categorySideImage}>
                            <img
                              src={article.thumbnail || 
                                `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(category.name)}`}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className={styles.categorySubTitle}>
                            <Link href={`/article/${article.id}`}>
                              {article.title}
                            </Link>
                          </h3>
                        </div>
                      ))
                    }
                  </div>
                  
                  {/* Cột giữa: Tin chính ở giữa */}
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
                  
                  {/* Cột phải: 4 tin mới ở bên phải, chỉ có tiêu đề */}
                  <div className={styles.categorySubNews}>
                    {newsByCategory[category.slug].slice(3, 10).map((article, index) => (
                      <div key={index} className={styles.categorySubItem}>
                        <h3 className={styles.categorySubTitle}>
                          <Link href={`/article/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="col-span-full text-center py-8">
                  <p>Không có bài viết nào trong danh mục {category.name}</p>
                </div>
              )}
            </div>
          </div>
        ))}
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