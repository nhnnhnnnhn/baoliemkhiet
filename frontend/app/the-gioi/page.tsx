"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronRightIcon, Globe, Clock } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/pagination-control"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CategoryHeader } from "@/components/category-header"
import articleApi from "@/src/apis/article"
import { Article } from "@/src/apis/article"

// ID danh mục Thế giới - đã xác định từ cơ sở dữ liệu
const CATEGORY_ID = 3 // Xác nhận: category_id của Thế giới là 3

export default function TheGioiPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [breakingNews, setBreakingNews] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Lấy bài viết nổi bật
  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        // Sử dụng API chuyên biệt để lấy bài viết theo danh mục
        const articles = await articleApi.getArticlesByCategory(CATEGORY_ID)
        
        // Lọc các bài viết đã xuất bản (isPublish=true)
        const publishedArticles = articles.filter(article => article.isPublish)
        
        // Sắp xếp theo lượt xem để lấy bài nổi bật
        const sortedArticles = [...publishedArticles].sort((a, b) => (b.view || 0) - (a.view || 0))
        
        // Lấy 5 bài nổi bật nhất
        const topArticles = sortedArticles.slice(0, 5)
        
        setFeaturedArticles(topArticles)
        
        // Ghi log để debug
        console.log(`Đã tìm thấy ${publishedArticles.length} bài viết thuộc danh mục Thế giới (ID: ${CATEGORY_ID})`)
      } catch (error) {
        console.error("Error fetching featured articles:", error)
        setFeaturedArticles([])
      }
    }
    
    fetchFeaturedArticles()
  }, [])

  // Lấy bài viết mới nhất
  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true)
        // Sử dụng API chuyên biệt để lấy bài viết theo danh mục
        const articles = await articleApi.getArticlesByCategory(CATEGORY_ID)
        
        // Lọc các bài viết đã xuất bản (isPublish=true)
        const publishedArticles = articles.filter(article => article.isPublish)
        
        // Sắp xếp theo thời gian xuất bản mới nhất
        const sortedArticles = [...publishedArticles].sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at)
          const dateB = new Date(b.published_at || b.created_at)
          return dateB.getTime() - dateA.getTime()
        })
        
        // Lấy 5 bài viết mới nhất
        const latestArticles = sortedArticles.slice(0, 5)
        
        setLatestArticles(latestArticles)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching latest articles:", error)
        setLatestArticles([])
        setLoading(false)
      }
    }
    
    fetchLatestArticles()
  }, [])

  // Lấy tin tức Breaking/mới nhận
  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const response = await articleApi.getArticles({
          category_id: CATEGORY_ID,
          limit: 3,
          page: 1,
          status: "PUBLISHED",
          sort: "published_at",
          order: "desc"
        })
        
        if (response && response.articles) {
          setBreakingNews(response.articles)
        } else {
          setBreakingNews([])
        }
      } catch (error) {
        console.error("Error fetching breaking news:", error)
        setBreakingNews([])
      }
    }
    
    fetchBreakingNews()
  }, [])

  // Lấy bài viết theo tab và phân trang
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        
        // Sử dụng API chuyên biệt để lấy bài viết theo danh mục
        const articles = await articleApi.getArticlesByCategory(CATEGORY_ID)
        
        // Lọc các bài viết đã xuất bản (isPublish=true)
        let filteredArticles = articles.filter(article => article.isPublish)
        
        // Lọc theo tab nếu không phải "all"
        if (activeTab !== "all") {
          filteredArticles = filteredArticles.filter(article => {
            // Lọc theo tag nếu có
            if (article.tags && article.tags.length > 0) {
              return article.tags.some(tag => tag.slug === activeTab)
            }
            return false
          })
        }
        
        // Sắp xếp theo thời gian xuất bản mới nhất
        const sortedArticles = [...filteredArticles].sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at)
          const dateB = new Date(b.published_at || b.created_at)
          return dateB.getTime() - dateA.getTime()
        })
        
        // Tính toán phân trang thủ công
        const limit = 10
        const start = (page - 1) * limit
        const end = start + limit
        const paginatedArticles = sortedArticles.slice(start, end)
        
        // Cập nhật state với dữ liệu đã lọc
        const totalResults = sortedArticles.length
        setArticles(paginatedArticles || [])
        setTotalPages(Math.ceil(totalResults / limit) || 1)
        
        // Ghi log để debug
        console.log(`Đang hiển thị ${paginatedArticles.length} bài viết (trang ${page}/${Math.ceil(totalResults / limit) || 1})`)
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching articles:", error)
        setArticles([])
        setTotalPages(0)
        setLoading(false)
      }
    }
    
    fetchArticles()
  }, [activeTab, page])

  // Format thời gian từ now
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy HH:mm", { locale: vi })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setPage(1) // Reset về trang 1 khi chuyển tab
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <CategoryHeader
        title="Thế giới"
        description="Tin tức quốc tế, phân tích chuyên sâu và góc nhìn đa chiều về các sự kiện toàn cầu"
        icon={<Globe className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-green-700 to-green-500"
        textColor="text-green-600"
      />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* World Map Section */}
        <div className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Globe className="h-6 w-6 mr-2 text-green-600" />
            Tin tức theo khu vực
          </h2>
          <div className="aspect-[16/9] bg-blue-50 rounded-lg relative overflow-hidden">
            <img
              src="/placeholder.svg?height=500&width=1000&text=World Map"
              alt="World Map"
              className="w-full h-full object-cover"
            />
            {/* Interactive map would go here in a real implementation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-medium bg-white/80 p-4 rounded-lg">Bản đồ tương tác tin tức thế giới</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Featured Articles */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Tin nổi bật</h3>

              {loading ? (
                <div className="space-y-8">
                  {/* Loading skeleton cho tin nổi bật chính */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[1, 2].map((item) => (
                      <div key={item} className="space-y-4">
                        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Loading skeleton cho tin nổi bật nhỏ */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="space-y-3">
                        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {featuredArticles.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {featuredArticles.slice(0, 2).map((article) => (
                          <div key={article.id}>
                            <div className="aspect-[4/3] mb-4">
                              <img
                                src={article.thumbnail || "/news-fallback.jpg"}
                                alt={article.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <span className="font-medium text-green-600">{article.category?.name || "Thế giới"}</span>
                              <span className="mx-2">•</span>
                              <span>{article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}</span>
                            </div>
                            <h4 className="text-xl font-bold mb-2 hover:text-green-600">
                              <Link href={`/articles/${article.id}`}>{article.title}</Link>
                            </h4>
                            <p className="text-gray-600">
                              {article.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredArticles.slice(2, 5).map((article) => (
                          <div key={article.id}>
                            <div className="aspect-[4/3] mb-3">
                              <img
                                src={article.thumbnail || "/news-fallback.jpg"}
                                alt={article.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <span className="font-medium text-green-600">{article.category?.name || "Thế giới"}</span>
                              <span className="mx-2">•</span>
                              <span>{article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}</span>
                            </div>
                            <h5 className="font-bold hover:text-green-600">
                              <Link href={`/articles/${article.id}`}>{article.title}</Link>
                            </h5>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h4 className="text-xl font-bold mb-2">Chưa có tin nổi bật</h4>
                      <p className="text-gray-500">Các tin nổi bật sẽ được cập nhật sớm.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Latest News */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Tin mới nhất</h3>
                <Button variant="ghost" className="text-sm flex items-center">
                  Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex gap-4 pb-6 border-b border-gray-200">
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <Skeleton className="w-32 h-24 rounded shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {latestArticles.length > 0 ? (
                    latestArticles.map((article) => (
                      <div key={article.id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="font-medium text-green-600">{article.category?.name || "Thế giới"}</span>
                            <span className="mx-2">•</span>
                            <span>{article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}</span>
                          </div>
                          <h4 className="text-xl font-bold mb-2 hover:text-green-600">
                            <Link href={`/articles/${article.id}`}>
                              {article.title}
                            </Link>
                          </h4>
                          <p className="text-gray-600">
                            {article.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
                          </p>
                        </div>
                        <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                          <img
                            src={article.thumbnail || "/news-fallback.jpg"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Clock className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                      <h4 className="text-lg font-bold mb-1">Chưa có tin mới nhất</h4>
                      <p className="text-gray-500">Hãy quay lại sau để xem các tin mới nhất.</p>
                    </div>
                  )}
                </div>
              )}      
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Breaking News */}
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-green-600 flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                  Tin mới nhận
                </h3>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="pb-4 border-b border-green-100 last:border-0 last:pb-0">
                        <Skeleton className="h-3 w-20 mb-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {breakingNews.length > 0 ? (
                      breakingNews.map((article, index) => (
                        <div key={article.id} className="pb-4 border-b border-green-100 last:border-0 last:pb-0">
                          <span className="text-xs font-medium text-green-500 block mb-1">
                            {index === 0 ? "Vừa cập nhật" : article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}
                          </span>
                          <h4 className="font-medium hover:text-green-600">
                            <Link href={`/articles/${article.id}`}>{article.title}</Link>
                          </h4>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500">Chưa có tin tức mới.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* World Economy */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">Kinh tế thế giới</h3>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <Skeleton className="w-16 h-16 rounded shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {latestArticles.slice(0, 4).map((article) => (
                      <div key={article.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                          <img
                            src={article.thumbnail || "/econ-placeholder.png"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium hover:text-green-600">
                            <Link href={`/articles/${article.id}`}>{article.title}</Link>
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>{article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Global Issues */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">Vấn đề toàn cầu</h3>
                <div className="space-y-4">
                  {["Biến đổi khí hậu", "An ninh mạng", "Di cư", "Dịch bệnh", "Khủng bố"].map((issue, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <h4 className="font-medium hover:text-green-600 mb-2">
                        <Link href="#">{issue}</Link>
                      </h4>
                      <p className="text-sm text-gray-600">
                        Các tin tức và phân tích mới nhất về {issue.toLowerCase()} và tác động toàn cầu.
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscribe */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Nhận tin thế giới hàng ngày</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Đăng ký nhận bản tin điện tử với những tin tức quan trọng nhất từ khắp nơi trên thế giới.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Đăng ký
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Phân trang */}
        {!loading && articles.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              page={page}
              count={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Hiển thị danh sách bài viết theo tab và trang */}
        {!loading && articles.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">
              {activeTab === "all" ? "Tất cả bài viết" : `Bài viết ${activeTab.replace(/-/g, " ")}`}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-[16/9]">
                    <img
                      src={article.thumbnail || "/news-fallback.jpg"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="font-medium text-green-600">{article.category?.name || "Thế giới"}</span>
                      <span className="mx-2">•</span>
                      <span>{article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}</span>
                    </div>
                    <h4 className="text-lg font-bold mb-2 hover:text-green-600">
                      <Link href={`/articles/${article.id}`}>{article.title}</Link>
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {article.content.substring(0, 120).replace(/<[^>]*>/g, '')}...
                    </p>
                    <Link 
                      href={`/articles/${article.id}`}
                      className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center"
                    >
                      Đọc tiếp <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trạng thái loading cho danh sách bài viết */}
        {loading && (
          <div className="mt-12">
            <Skeleton className="h-8 w-72 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border border-gray-100 rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[16/9] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hiển thị khi không có bài viết */}
        {!loading && articles.length === 0 && (
          <div className="mt-12 bg-gray-50 p-8 rounded-lg text-center">
            <Globe className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-600 mb-6">
              Hiện tại chưa có bài viết nào trong danh mục này. Vui lòng quay lại sau hoặc tìm kiếm với các từ khóa khác.
            </p>
            <Button 
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => setActiveTab("all")}
            >
              Xem tất cả bài viết
            </Button>
          </div>
        )}
      </main>

      <SiteFooter />

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton />
      </div>
    </div>
  )
}
