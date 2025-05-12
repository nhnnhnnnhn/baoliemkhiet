"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { CalendarIcon, ChevronRightIcon, Cpu, Smartphone, Laptop, Wifi } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/pagination-control"
import { SiteHeader } from "@/components/site-header"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { CategoryHeader } from "@/components/category-header"
import articleApi from "@/src/apis/article"
import { Article } from "@/src/apis/article"

// ID danh mục Công nghệ
const CATEGORY_ID = 4 

export default function CongNghePage() {
  const [activeTab, setActiveTab] = useState("all")
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Format thời gian
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy HH:mm", { locale: vi })
  }

  // Lấy bài viết nổi bật
  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const response = await articleApi.getArticles({
          category_id: CATEGORY_ID,
          limit: 1,
          page: 1,
          status: "PUBLISHED",
          sort: "view_count",
          order: "desc"
        })
        
        if (response && response.articles) {
          setFeaturedArticles(response.articles)
        } else {
          setFeaturedArticles([])
        }
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
        const response = await articleApi.getArticles({
          category_id: CATEGORY_ID,
          limit: 6,
          page: 1,
          status: "PUBLISHED",
          sort: "published_at",
          order: "desc"
        })
        
        if (response && response.articles) {
          setLatestArticles(response.articles)
        } else {
          setLatestArticles([])
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching latest articles:", error)
        setLatestArticles([])
        setLoading(false)
      }
    }
    
    fetchLatestArticles()
  }, [])

  // Lấy bài viết theo tab và phân trang
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        
        const params: any = {
          category_id: CATEGORY_ID,
          page,
          limit: 10,
          status: "PUBLISHED",
          sort: "published_at",
          order: "desc"
        }
        
        if (activeTab !== "all") {
          params.tag = activeTab
        }
        
        const response = await articleApi.getArticles(params)
        
        if (response && response.articles) {
          setArticles(response.articles)
          setTotalPages(Math.ceil((response.totalArticles || 0) / 10))
        } else {
          setArticles([])
          setTotalPages(0)
        }
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
        title="Công nghệ"
        description="Tin tức công nghệ, sản phẩm mới, đánh giá thiết bị và xu hướng công nghệ mới nhất"
        icon={<Cpu className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-purple-700 to-purple-500"
        textColor="text-purple-600"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Featured Article */}
            {featuredArticles.length > 0 ? (
              <div className="mb-12">
                <div className="relative aspect-[16/9] mb-4">
                  <img
                    src={featuredArticles[0].thumbnail || "https://placehold.co/900x500/eee/999?text=Công+nghệ"}
                    alt={featuredArticles[0].title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-3 hover:text-purple-600">
                  <Link href={`/bai-viet/${featuredArticles[0].id}`}>
                    {featuredArticles[0].title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 text-lg">
                  {featuredArticles[0].content?.substring(0, 150)?.replace(/<[^>]*>/g, '') || ''}...
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-purple-600">Công nghệ</span>
                  <span className="mx-2">•</span>
                  <span>{formatTime(featuredArticles[0].published_at || featuredArticles[0].created_at)}</span>
                </div>
              </div>
            ) : loading ? (
              <div className="mb-12">
                <Skeleton className="aspect-[16/9] mb-4 rounded-lg" />
                <Skeleton className="h-9 w-3/4 mb-3" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ) : (
              <div className="mb-12 text-center py-8 bg-gray-50 rounded-lg">
                <Cpu className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-lg font-medium">Không có bài viết nổi bật nào.</p>
              </div>
            )}

            {/* Tech News Grid */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Tin công nghệ mới nhất</h3>
                <Button variant="ghost" className="text-sm flex items-center">
                  Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  // Loading skeletons
                  Array(4).fill(0).map((_, index) => (
                    <div key={`skeleton-${index}`} className="border-b pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3">
                          <Skeleton className="aspect-[4/3] rounded" />
                        </div>
                        <div className="md:w-2/3">
                          <Skeleton className="h-5 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : latestArticles.length > 0 ? (
                  // Bài viết đã tải
                  latestArticles.slice(0, 4).map((article) => (
                    <div key={article.id} className="border-b pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3 aspect-[4/3]">
                          <img
                            src={article.thumbnail || `https://placehold.co/300x200/eee/999?text=Tech`}
                            alt={article.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <h4 className="text-lg font-bold mb-2 hover:text-purple-600">
                            <Link href={`/bai-viet/${article.id}`}>{article.title}</Link>
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {article.content?.substring(0, 100)?.replace(/<[^>]*>/g, '') || ''}...
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="font-medium text-purple-600">Công nghệ</span>
                            <span className="mx-2">•</span>
                            <span>{formatTime(article.published_at || article.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Không có bài viết
                  <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
                    <Cpu className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">Chưa có tin tức công nghệ nào.</p>
                  </div>
                )}
              </div>
            </div>

            {/* More Articles with Pagination */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-purple-600 mr-3"></div>
                <h3 className="text-xl font-bold">Tin tức công nghệ khác</h3>
              </div>

              {loading ? (
                // Loading skeletons
                <div className="space-y-6">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={`skeleton-list-${index}`} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                      <Skeleton className="h-16 w-24 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-full mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : articles.length > 0 ? (
                // Articles list with pagination
                <>
                  <div className="space-y-6">
                    {articles.map((article) => (
                      <div key={article.id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <div className="flex-shrink-0 w-24 h-16 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={article.thumbnail || `https://placehold.co/96x64/eee/999?text=${article.id}`}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1 hover:text-purple-600">
                            <Link href={`/bai-viet/${article.id}`}>{article.title}</Link>
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{formatTime(article.published_at || article.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      page={page}
                      count={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                // Không có bài viết
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Cpu className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Không tìm thấy bài viết nào phù hợp với tiêu chí hiện tại.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div>
            {/* Popular Tags */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Chủ đề phổ biến</h3>
              <div className="flex flex-wrap gap-2">
                {["AI", "iPhone", "Android", "5G", "Machine Learning", "Cloud", "Cybersecurity", "Blockchain", "VR/AR", "Smart Home"].map((tag) => (
                  <Link
                    key={tag}
                    href="#"
                    className="bg-white px-3 py-1 rounded-full text-sm border hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="mb-8 bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Đăng ký nhận tin</h3>
              <p className="text-sm text-gray-600 mb-4">
                Cập nhật tin tức công nghệ mới nhất qua email của bạn
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Đăng ký</Button>
              </div>
            </div>

            {/* Related Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Có thể bạn quan tâm</h3>
              <div className="space-y-4">
                {["Hướng dẫn mua sắm smartphone", "So sánh các dòng laptop", "Review tai nghe không dây", "Thủ thuật sử dụng Windows 11", "Bảo mật thông tin cá nhân"].map((item, index) => (
                  <Link key={index} href="#" className="flex items-start gap-3 group">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-sm font-bold text-purple-600">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium group-hover:text-purple-600">{item}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <ChatbotButton />
    </div>
  )
}
