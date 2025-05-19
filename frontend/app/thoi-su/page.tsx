"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronRightIcon, FileText } from "lucide-react"
import { format, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CategoryHeader } from "@/components/category-header"
import articleApi, { Article, CategoryArticlesResponse } from "@/src/apis/article"
import commentApi, { Comment } from "@/src/apis/comment"

export default function ThoiSuPage() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // State cho dữ liệu bài viết
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [currentTab, setCurrentTab] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)
  const [recentComments, setRecentComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  
  // ID của danh mục Thời sự
  const CATEGORY_ID = 2 // Thông tin xác nhận: category_id của Thời sự là 2
  
  // Helper function để định dạng ngày tháng an toàn
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Lỗi định dạng ngày tháng:', error);
      return '';
    }
  }
  
  // Lấy dữ liệu bài viết khi component được mount hoặc tab thay đổi
  // Lấy dữ liệu bài viết và bình luận khi component được mount hoặc tab thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setLoadingComments(true)
        
        // Sử dụng API chuyên biệt để lấy bài viết theo danh mục
        // Đảm bảo chỉ lấy những bài viết đã được xuất bản (isPublish=true)
        const response = await articleApi.getArticlesByCategory(CATEGORY_ID)
        
        // Truy cập đúng thuộc tính articles từ response
        const articleList = response.articles || []
        
        // Lọc các bài viết đã xuất bản (isPublish=true)
        const publishedArticles = articleList.filter(article => article.isPublish)
        
        // Tính toán phân trang thủ công
        const limit = 10
        const start = (page - 1) * limit
        const end = start + limit
        const paginatedArticles = publishedArticles.slice(start, end)
        
        // Cập nhật state với dữ liệu đã lọc
        const totalResults = publishedArticles.length
        setArticles(paginatedArticles || [])
        setTotalPages(Math.ceil(totalResults / limit) || 1)
        setTotalArticles(totalResults || 0)
        
        // Lấy bài viết nổi bật (bài đầu tiên)
        if (paginatedArticles.length > 0 && page === 1) {
          setFeaturedArticle(paginatedArticles[0])
          
          // Loại bỏ bài nổi bật khỏi danh sách bài viết thường
          setArticles(paginatedArticles.slice(1))
        } else if (page === 1) {
          setFeaturedArticle(null)
        }
        
        // Ghi log để debug
        console.log(`Đã tìm thấy ${publishedArticles.length} bài viết thuộc danh mục Thời sự (ID: ${CATEGORY_ID})`)
        
        // Lấy danh sách ID của các bài viết thuộc danh mục Thời sự 
        const articleIds = publishedArticles.map(article => article.id)
        
        // Lấy tất cả bình luận và lọc theo bài viết thuộc danh mục Thời sự
        try {
          const commentsResponse = await commentApi.getAllComments(1, 20)
          let allComments: Comment[] = []
          
          if (Array.isArray(commentsResponse)) {
            allComments = commentsResponse
          } else if (commentsResponse && 'comments' in commentsResponse) {
            allComments = commentsResponse.comments
          }
          
          // Lọc các bình luận đã được phê duyệt từ các bài viết thuộc danh mục Thời sự
          const filteredComments = allComments
            .filter(comment => 
              comment.status === "APPROVED" && 
              comment.article && 
              articleIds.includes(comment.articleId))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)  // Chỉ lấy 5 bình luận gần nhất
          
          setRecentComments(filteredComments)
          console.log('Recent comments:', filteredComments)
        } catch (commentErr) {
          console.error('Lỗi khi lấy bình luận:', commentErr)
          setRecentComments([])
        } finally {
          setLoadingComments(false)
        }
        
        setError(null)
      } catch (err) {
        console.error('Lỗi khi lấy bài viết:', err)
        setError('Không thể tải dữ liệu bài viết. Vui lòng thử lại sau.')
        setLoadingComments(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [currentTab, page])
  
  // Xử lý thay đổi tab
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    setPage(1) // Reset về trang 1 khi chuyển tab
  }
  
  // Xử lý phân trang
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }
  
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <CategoryHeader
        title="Thời sự"
        description="Cập nhật tin tức mới nhất về tình hình chính trị, xã hội, kinh tế và các vấn đề thời sự nóng hổi trong nước"
        icon={<FileText className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-red-700 to-red-500"
        textColor="text-red-600"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Featured Article */}
            {isLoading ? (
              <div className="mb-12">
                <div className="relative aspect-[16/9] mb-4">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Skeleton className="w-20 h-6" />
                    <span className="mx-2 text-gray-400">|</span>
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ) : featuredArticle ? (
              <div className="mb-12">
                <div className="relative aspect-[16/9] mb-4">
                  <img
                    src={featuredArticle.thumbnail || "/placeholder.svg?height=500&width=900&text=Bài+viết+nổi+bật"}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                      {featuredArticle.category?.name || 'Thời sự'}
                    </span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-gray-600">
                      {formatDate(featuredArticle.publishedAt || featuredArticle.created_at)}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold">
                    <Link href={`/article/${featuredArticle.id}`} className="hover:text-red-600 transition-colors">
                      {featuredArticle.title}
                    </Link>
                  </h1>
                  <div 
                    className="text-gray-600 text-lg"
                    dangerouslySetInnerHTML={{
                      __html: featuredArticle.content.length > 200 
                        ? featuredArticle.content.substring(0, 200) + '...'
                        : featuredArticle.content
                    }}
                  />
                  <div className="flex items-center pt-2">
                    <Button variant="outline" className="gap-1 text-red-600 border-red-200 hover:bg-red-50" asChild>
                      <Link href={`/article/${featuredArticle.id}`}>
                        Đọc tiếp <ChevronRightIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-12 text-center py-8">
                <p className="text-gray-500">Không có bài viết nổi bật nào.</p>
              </div>
            )}

            {/* Article List */}
            {isLoading ? (
              <div className="space-y-8">
                {Array(5).fill(0).map((_, index) => (
                  <article key={index} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-200">
                    <div className="md:w-1/3">
                      <Skeleton className="aspect-video rounded-lg" />
                    </div>
                    <div className="md:w-2/3 space-y-3">
                      <div className="flex items-center text-sm">
                        <Skeleton className="w-20 h-6" />
                        <span className="mx-2 text-gray-400">|</span>
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </article>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Không có bài viết nào trong danh mục này.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {articles.map((article) => (
                  <article key={article.id} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-200">
                    <div className="md:w-1/3">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={article.thumbnail || `/placeholder.svg?height=200&width=300&text=Bài+viết`}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3 space-y-3">
                      <div className="flex items-center text-sm">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                          {article.category?.name || 'Thời sự'}
                        </span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-gray-600">
                          {formatDate(article.publishedAt || article.created_at)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold">
                        <Link href={`/article/${article.id}`} className="hover:text-red-600 transition-colors">
                          {article.title}
                        </Link>
                      </h2>
                      <div 
                        className="text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: article.content.length > 150 
                            ? article.content.substring(0, 150) + '...'
                            : article.content
                        }}
                      />
                      <Button variant="link" className="px-0 gap-1 text-red-600" asChild>
                        <Link href={`/article/${article.id}`}>
                          Đọc tiếp <ChevronRightIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* More News - Đáng chú ý */}
            <div>
              <h3 className="text-xl font-bold mb-6">Đáng chú ý</h3>

              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Skeleton className="w-16 h-4" />
                          <span className="mx-2">•</span>
                          <Skeleton className="w-20 h-4" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <Skeleton className="w-32 h-24 shrink-0 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {totalArticles > 0 ? (
                    articles.slice(0, 5).map((article) => (
                      <div key={article.id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="font-medium text-red-600">{article.category?.name || 'Thời sự'}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(article.publishedAt || article.created_at)}</span>
                          </div>
                          <h4 className="text-xl font-bold mb-2 hover:text-red-600">
                            <Link href={`/article/${article.id}`}>
                              {article.title}
                            </Link>
                          </h4>
                          <div 
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: article.content && article.content.length > 100 
                                ? article.content.substring(0, 100) + '...'
                                : article.content || ''
                            }}
                          />
                        </div>
                        <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                          <img
                            src={article.thumbnail || `https://placehold.co/300x200/eee/999?text=Thời+sự`}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Không có bài viết nào trong danh mục này.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Most Read */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">Đọc nhiều nhất</h3>
                <div className="space-y-4">
                  {isLoading ? (
                    Array(5).fill(0).map((_, index) => (
                      <div key={`skeleton-most-read-${index}`} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="text-2xl font-bold text-gray-300 shrink-0">{index + 1}</div>
                        <div className="w-full">
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {articles && articles.length > 0 ? (
                        articles.slice(0, 5).map((article, index) => (
                          <div key={`most-read-${article.id}`} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="text-2xl font-bold text-gray-300 shrink-0">{index + 1}</div>
                            <div>
                              <h4 className="font-medium hover:text-red-600">
                                <Link href={`/article/${article.id}`}>{article.title}</Link>
                              </h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span>{formatDate(article.publishedAt || article.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Chưa có bài viết nào.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bình luận gần đây */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">Bình luận gần đây</h3>
                <div className="space-y-4">
                  {loadingComments ? (
                    Array(3).fill(0).map((_, index) => (
                      <div key={`skeleton-comment-${index}`} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-center mb-2">
                          <Skeleton className="w-10 h-10 rounded-full mr-3" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))
                  ) : (
                    recentComments && recentComments.length > 0 ? (
                      recentComments.map((comment) => (
                        <div key={`comment-${comment.id}`} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                              {comment.user?.avatar ? (
                                <img 
                                  src={comment.user.avatar} 
                                  alt={comment.user.fullname} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <span className="text-gray-400 font-bold">
                                  {comment.user?.fullname?.charAt(0) || '?'}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h5 className="font-medium">{comment.user?.fullname || 'Người dùng ẩn danh'}</h5>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                              <Link 
                                href={`/article/${comment.articleId}`} 
                                className="text-xs text-red-600 hover:underline mt-1"
                              >
                                {comment.article?.title ? comment.article.title : 'Bài viết'}
                              </Link>
                            </div>
                          </div>
                          <div 
                            className="text-sm text-gray-600 pl-12" 
                            dangerouslySetInnerHTML={{ 
                              __html: comment.content.length > 120 
                                ? comment.content.substring(0, 120) + '...' 
                                : comment.content 
                            }} 
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">Chưa có bình luận nào.</p>
                      </div>
                    )
                  )}
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
