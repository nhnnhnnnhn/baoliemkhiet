"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Activity, Calendar, Award, ChevronRight, Clock, User, ArrowRight, Trophy } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { formatDateTime, sortByLatest, sortByViews } from "@/src/utils/date-helpers"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/pagination-control"
import { SiteFooter } from "@/components/site-footer"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteHeader } from "@/components/site-header"
import { CategoryHeader } from "@/components/category-header"
import articleApi from "@/src/apis/article"
import { Article } from "@/src/apis/article"

// ID danh mục Thể thao - đã xác định từ cơ sở dữ liệu
const CATEGORY_ID = 6 // Xác nhận: category_id của Thể thao là 6

export default function TheThaoPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Format thời gian sử dụng hàm helper
  const formatTime = (dateString: string | null | undefined) => {
    return formatDateTime(dateString)
  }

  // Lấy bài viết nổi bật
  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        // Sử dụng API chuyên biệt để lấy bài viết theo danh mục
        const articles = await articleApi.getArticlesByCategory(CATEGORY_ID)
        
        // Lọc các bài viết đã xuất bản (isPublish=true)
        const publishedArticles = articles.filter(article => article.isPublish)
        
        // Sắp xếp theo lượt xem để lấy bài nổi bật sử dụng hàm helper
        const sortedArticles = sortByViews(publishedArticles)
        
        // Lấy bài nổi bật nhất
        const topArticle = sortedArticles.length > 0 ? [sortedArticles[0]] : []
        
        setFeaturedArticles(topArticle)
        
        // Ghi log để debug
        console.log(`Đã tìm thấy ${publishedArticles.length} bài viết thuộc danh mục Thể thao (ID: ${CATEGORY_ID})`)
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
        
        // Lấy 6 bài viết mới nhất
        const latestArticles = sortedArticles.slice(0, 6)
        
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

  // Lấy danh sách bài viết phân trang
  useEffect(() => {
    const fetchArticles = async () => {
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
        console.log(`Đang hiển thị ${paginatedArticles.length} bài viết Thể thao (trang ${page}/${Math.ceil(totalResults / limit) || 1})`)
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching articles:", error)
        setArticles([])
        setTotalPages(0)
        setLoading(false)
      }
    }
    
    fetchArticles()
  }, [page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/20 z-10"></div>
          {loading || featuredArticles.length === 0 ? (
            <div className="relative h-[70vh] overflow-hidden flex items-center justify-center bg-gray-300">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <div className="relative h-[70vh] overflow-hidden">
              <img
                src={featuredArticles[0]?.thumbnail || `https://placehold.co/1600x800/eee/999?text=Thể+Thao`}
                alt={featuredArticles[0]?.title || "Thể thao"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="max-w-2xl">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-24 w-full mb-6" />
                  <Skeleton className="h-12 w-40" />
                </div>
              ) : featuredArticles.length > 0 ? (
                <div className="max-w-2xl text-white">
                  <div className="flex items-center mb-4">
                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-sm mr-3">NỔI BẬT</span>
                    <span className="text-sm opacity-80">
                      {featuredArticles[0].published_at ? formatTime(featuredArticles[0].published_at) : formatTime(featuredArticles[0].created_at)}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {featuredArticles[0].title}
                  </h1>
                  <p className="text-xl mb-6 opacity-90">
                    {featuredArticles[0].content?.length > 200 ? 
                      featuredArticles[0].content.substring(0, 200) + '...' : 
                      featuredArticles[0].content}
                  </p>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <p className="font-medium">{featuredArticles[0].author?.name || 'Báo Liêm Khiết'}</p>
                      <p className="text-sm opacity-80">Phóng viên Thể thao</p>
                    </div>
                  </div>
                  <Link href={`/article/${featuredArticles[0].id}`}>
                    <Button className="bg-white text-red-600 hover:bg-gray-100">
                      Đọc tiếp <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="max-w-2xl text-white">
                  <p className="text-xl">Không có bài viết nổi bật</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Stories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3">Tin mới nhất</h2>
              <Link href="/the-thao" className="text-red-600 hover:text-red-700 flex items-center text-sm font-medium">
                Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="w-full aspect-video mb-4" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-8 w-full mb-2" />
                    <Skeleton className="h-24 w-full mb-3" />
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))
              ) : latestArticles.length > 0 ? (
                latestArticles.slice(0, 3).map((article, index) => (
                  <div key={article.id} className="group">
                    <div className="relative overflow-hidden mb-4">
                      <img
                        src={article.thumbnail || `https://placehold.co/500x300/eee/999?text=Thể+Thao+${index + 1}`}
                        alt={article.title}
                        className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      {index === 0 && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-xs font-bold">MỚI</div>
                      )}
                    </div>
                    <div className="flex items-center text-sm mb-2">
                      <span className="font-bold text-red-600 mr-2">THỂ THAO</span>
                      <span className="text-gray-500">
                        {article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">
                      <Link href={`/article/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {article.content?.length > 120 ? article.content.substring(0, 120) + '...' : article.content}
                    </p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                      <span className="text-sm text-gray-500">{article.author?.name || 'Báo Liêm Khiết'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">Không có bài viết nào</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Article List Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3 mb-6">Danh sách bài viết</h2>

              {loading ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="flex gap-4 mb-6 pb-6 border-b border-gray-200 last:border-0">
                    <div className="w-32 h-24 flex-shrink-0">
                      <Skeleton className="w-full h-full rounded" />
                    </div>
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))
              ) : articles.length > 0 ? (
                <div className="space-y-6">
                  {articles.map((article) => (
                    <div key={article.id} className="flex gap-4 group pb-6 border-b border-gray-200 last:border-0">
                      <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                        <img
                          src={article.thumbnail || `https://placehold.co/128x96/eee/999?text=Thể+Thao`}
                          alt={article.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <div className="flex items-center text-xs mb-1">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="text-gray-500">
                            {article.published_at ? formatTime(article.published_at) : formatTime(article.created_at)}
                          </span>
                        </div>
                        <h3 className="font-bold mb-1 group-hover:text-red-600 transition-colors">
                          <Link href={`/article/${article.id}`}>{article.title}</Link>
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span>{article.author?.name || 'Báo Liêm Khiết'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Không có bài viết nào.</p>
                </div>
              )}

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    page={page}
                    count={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Live Scores - Mock Data */}
        <section className="py-10 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-yellow-400" />
                Kết quả trận đấu
              </h2>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Xem tất cả
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  league: "Premier League",
                  team1: "Arsenal",
                  score1: 3,
                  team2: "Tottenham",
                  score2: 1,
                  status: "Kết thúc",
                },
                {
                  league: "La Liga",
                  team1: "Barcelona",
                  score1: 2,
                  team2: "Real Madrid",
                  score2: 2,
                  status: "Kết thúc",
                },
                { league: "Serie A", team1: "Inter", score1: 1, team2: "Juventus", score2: 0, status: "Kết thúc" },
                {
                  league: "Bundesliga",
                  team1: "Bayern Munich",
                  score1: 4,
                  team2: "Dortmund",
                  score2: 2,
                  status: "Kết thúc",
                },
                { league: "Ligue 1", team1: "PSG", score1: 3, team2: "Marseille", score2: 0, status: "Kết thúc" },
                { league: "V-League", team1: "Hà Nội FC", score1: 2, team2: "HAGL", score2: 1, status: "Kết thúc" },
              ].map((match, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">{match.league}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{match.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <span className="font-medium">{match.team1}</span>
                    </div>
                    <span className="text-xl font-bold">{match.score1}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <span className="font-medium">{match.team2}</span>
                    </div>
                    <span className="text-xl font-bold">{match.score2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Thể Thao Premium - Mock Section */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="flex items-center mb-3">
                  <Award className="h-6 w-6 text-yellow-400 mr-2" />
                  <h2 className="text-2xl font-bold">Thể Thao Premium</h2>
                </div>
                <p className="text-gray-300 mb-6 max-w-2xl">
                  Truy cập vào các bài viết chuyên sâu, phân tích chuyên môn và nội dung độc quyền từ các phóng viên
                  hàng đầu của chúng tôi. Nâng cao trải nghiệm thể thao của bạn với những góc nhìn sâu sắc và độc đáo.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">Đăng ký ngay</Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                    Tìm hiểu thêm
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/3 lg:w-1/4">
                <img
                  src="/placeholder.svg?height=300&width=300&text=Premium"
                  alt="Premium Subscription"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ChatbotButton />
    </div>
  )
}