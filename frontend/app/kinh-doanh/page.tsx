"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronRightIcon, TrendingUp, DollarSign, BarChart3 } from "lucide-react"
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

// ID danh mục Kinh doanh - cần thay thế bằng ID thực tế từ cơ sở dữ liệu
const CATEGORY_ID = 3 // Giả định ID danh mục Kinh doanh là 3

export default function KinhDoanhPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [realEstateArticles, setRealEstateArticles] = useState<Article[]>([])
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
          limit: 4,
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

  // Lấy bài viết về bất động sản (subcategory)
  useEffect(() => {
    const fetchRealEstateArticles = async () => {
      try {
        const response = await articleApi.getArticles({
          category_id: CATEGORY_ID,
          limit: 3,
          page: 1,
          status: "PUBLISHED",
          sort: "published_at",
          order: "desc",
          tag_id: 2 // Giả sử tag_id 2 là bất động sản
        })
        
        if (response && response.articles) {
          setRealEstateArticles(response.articles)
        } else {
          setRealEstateArticles([])
        }
      } catch (error) {
        console.error("Error fetching real estate articles:", error)
        setRealEstateArticles([])
      }
    }
    
    fetchRealEstateArticles()
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
        title="Kinh doanh"
        description="Thông tin kinh tế, tài chính, chứng khoán, bất động sản và các xu hướng kinh doanh mới nhất"
        icon={<DollarSign className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-amber-700 to-amber-500"
        textColor="text-amber-600"
      />

      {/* Market Overview */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Thị trường chứng khoán</h2>
            <span className="text-sm text-gray-500">Cập nhật: 15:30</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">VN-Index</span>
                <span className="text-green-600 font-bold">1,245.67</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-sm">+12.45 (+1.01%)</span>
                <TrendingUp className="h-4 w-4 ml-1 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">HNX-Index</span>
                <span className="text-green-600 font-bold">234.56</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-sm">+2.34 (+1.01%)</span>
                <TrendingUp className="h-4 w-4 ml-1 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">USD/VND</span>
                <span className="text-red-600 font-bold">23,450</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-red-600 text-sm">-50 (-0.21%)</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Vàng SJC</span>
                <span className="text-green-600 font-bold">7,450,000</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-sm">+50,000 (+0.67%)</span>
                <TrendingUp className="h-4 w-4 ml-1 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Featured Article */}
            <div className="mb-12">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="aspect-[16/9] w-full rounded-lg" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  {featuredArticles.length > 0 ? (
                    <div>
                      <div className="relative aspect-[16/9] mb-4">
                        <img
                          src={featuredArticles[0].thumbnail || "https://placehold.co/900x500/eee/999?text=Kinh+doanh"}
                          alt={featuredArticles[0].title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h2 className="text-3xl font-bold mb-3 hover:text-amber-600">
                        <Link href={`/articles/${featuredArticles[0].id}`}>{featuredArticles[0].title}</Link>
                      </h2>
                      <p className="text-gray-600 mb-4 text-lg">
                        {featuredArticles[0].content.substring(0, 200).replace(/<[^>]*>/g, '')}...
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-amber-600">{featuredArticles[0].category?.name || "Kinh doanh"}</span>
                        <span className="mx-2">•</span>
                        <span>{featuredArticles[0].published_at ? formatTime(featuredArticles[0].published_at) : formatTime(featuredArticles[0].created_at)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-bold mb-2">Chưa có bài viết nổi bật</h3>
                      <p className="text-gray-500">Bài viết nổi bật sẽ được cập nhật sớm.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Business News Grid */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Tin kinh doanh mới nhất</h3>
                <Button variant="ghost" className="text-sm flex items-center">
                  Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border-b pb-6 mb-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <Skeleton className="md:w-1/3 aspect-[4/3] rounded" />
                        <div className="md:w-2/3 space-y-2">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestArticles.length > 0 ? (
                    latestArticles.map((article, index) => (
                      <div key={article.id} className="border-b pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/3 aspect-[4/3]">
                            <img
                              src={article.thumbnail || `https://placehold.co/300x200/eee/999?text=Kinh+doanh+${index + 1}`}
                              alt={article.title}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <h4 className="text-lg font-bold mb-2 hover:text-amber-600">
                              <Link href={`/articles/${article.id}`}>
                                {article.title}
                              </Link>
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {article.content.substring(0, 120).replace(/<[^>]*>/g, '')}...
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="font-medium text-amber-600">{article.category?.name || "Kinh doanh"}</span>
                              <span className="mx-2">•</span>
                              <span>{article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-10 bg-gray-50 rounded-lg">
                      <DollarSign className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">Chưa có tin tức kinh doanh nào.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Real Estate Section */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-amber-600 mr-3"></div>
                <h3 className="text-xl font-bold">Bất động sản</h3>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border rounded-lg overflow-hidden">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {realEstateArticles.length > 0 ? (
                    realEstateArticles.map((article) => (
                      <div key={article.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-[4/3]">
                          <img
                            src={article.thumbnail || "/placeholder.svg?height=200&width=300&text=Real Estate"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold mb-2 hover:text-amber-600">
                            <Link href={`/articles/${article.id}`}>
                              {article.title}
                            </Link>
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {article.content.substring(0, 100).replace(/<[^>]*>/g, '')}...
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 bg-gray-50 rounded-lg">
                      <DollarSign className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">Chưa có tin tức bất động sản.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Stock Market */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                    Cổ phiếu nổi bật
                  </h3>
                  <Button variant="outline" size="sm" className="text-xs">
                    Xem thêm
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    { code: "VIC", price: "56.7", change: "+1.2", percent: "+2.16%", color: "text-green-600" },
                    { code: "VHM", price: "43.2", change: "+0.8", percent: "+1.89%", color: "text-green-600" },
                    { code: "FPT", price: "87.5", change: "+1.5", percent: "+1.74%", color: "text-green-600" },
                    { code: "MBB", price: "22.3", change: "-0.4", percent: "-1.76%", color: "text-red-600" },
                    { code: "VNM", price: "78.9", change: "+0.6", percent: "+0.77%", color: "text-green-600" },
                  ].map((stock, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <span className="font-bold">{stock.code}</span>
                        <p className="text-xs text-gray-500">HOSE</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{stock.price}</span>
                        <p className={`text-xs ${stock.color}`}>
                          {stock.change} ({stock.percent})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Currency Exchange */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-amber-600" />
                    Tỷ giá ngoại tệ
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    { code: "USD", name: "Đô la Mỹ", buy: "23,400", sell: "23,450" },
                    { code: "EUR", name: "Euro", buy: "25,600", sell: "25,900" },
                    { code: "JPY", name: "Yên Nhật", buy: "156", sell: "158" },
                    { code: "GBP", name: "Bảng Anh", buy: "29,800", sell: "30,200" },
                    { code: "CNY", name: "Nhân dân tệ", buy: "3,250", sell: "3,320" },
                  ].map((currency, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <span className="font-bold">{currency.code}</span>
                        <p className="text-xs text-gray-500">{currency.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex space-x-4">
                          <div>
                            <p className="text-xs text-gray-500">Mua</p>
                            <span>{currency.buy}</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Bán</p>
                            <span>{currency.sell}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton />
      </div>
    </div>
  )
}
