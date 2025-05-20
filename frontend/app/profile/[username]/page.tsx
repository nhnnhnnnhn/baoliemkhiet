"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, MapPinIcon, UserIcon, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { 
  handleGetFollowers, 
  handleGetFollowing,
  handleCheckFollowing
} from "@/src/thunks/follow/followThunk"
import { 
  selectFollowers, 
  selectFollowing
} from "@/src/thunks/follow/followSlice"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import userApi, { User } from "@/src/apis/user"
import articleApi, { Article } from "@/src/apis/article"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FollowButton } from "@/components/FollowButton"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

// Thay đổi hàm format date để tránh lỗi hydration
const formatJoinDate = (dateString: string) => {
  if (!dateString) return 'Không xác định';
  
  try {
    const date = new Date(dateString);
    // Sử dụng cách định dạng cố định không phụ thuộc vào locale
    return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  } catch (error) {
    return 'Không xác định';
  }
};

export default function ProfilePage() {
  // Sử dụng useParams hook từ next/navigation thay vì truy cập params trực tiếp
  const params = useParams();
  const username = Array.isArray(params.username) ? params.username[0] : params.username as string;
  
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)
  
  // Thêm state để kiểm soát client-side rendering
  const [isClient, setIsClient] = useState(false)
  
  // User profile state
  const [user, setUser] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Use real follow data from Redux
  const followers = useAppSelector(selectFollowers)
  const following = useAppSelector(selectFollowing)
  
  // Đánh dấu khi component đã được mount ở client
  useEffect(() => {
    setIsClient(true)
  }, []);
  
  // Tìm kiếm người dùng theo username và role
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true)
        setUserError(null)
        
        // Tìm kiếm người dùng theo username và role
        const users = await userApi.getUsers({
          search: username,
          role: username.toLowerCase() === 'admin' ? 'ADMIN' : undefined,
          limit: 5
        })
        
        // Tìm người dùng phù hợp nhất từ danh sách
        const matchedUser = users.users.find(u => 
          // Kiểm tra email trước vì username không có trong User interface
          (u.email && u.email.split('@')[0].toLowerCase() === username.toLowerCase()) ||
          // Hoặc kiểm tra tên đầy đủ không có khoảng cách
          u.fullname.replace(/\s+/g, '').toLowerCase() === username.toLowerCase()
        )
        
        if (!matchedUser) {
          setUserError('Không tìm thấy người dùng')
          return
        }
        
        setUser(matchedUser)
        
        // Sau khi có ID người dùng, lấy các bài viết của họ
        if (matchedUser.id) {
          fetchUserArticles(matchedUser.id)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUserError('Không thể tải thông tin người dùng')
      } finally {
        setUserLoading(false)
      }
    }
    
    if (isClient) {
      fetchUserData()
    }
  }, [username, isClient])
  
  // Lấy bài viết của người dùng
  // Xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    setPage(Math.min(Math.max(1, newPage), totalPages))
    // Cuộn lên đầu phần bài viết
    window.scrollTo({ top: document.getElementById('user-articles')?.offsetTop || 0, behavior: 'smooth' })
  }

  const fetchUserArticles = async (userId: number) => {
    try {
      setArticlesLoading(true)
      const response = await articleApi.getArticlesByAuthor(userId)
      
      // Lọc và sắp xếp bài viết đã xuất bản và được duyệt
      const sortedArticles = [...(response.articles || [])]
        .filter(article => 
          article.status === "APPROVED" && 
          article.publishedAt && 
          new Date(article.publishedAt) <= new Date()
        )
        .sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.created_at)
          const dateB = new Date(b.publishedAt || b.created_at)
          return dateB.getTime() - dateA.getTime()
        })

      // Lưu trữ toàn bộ bài viết đã sắp xếp
      setArticles(sortedArticles)
      
      // Tính toán số trang
      const articlesPerPage = 5
      setTotalPages(Math.ceil(sortedArticles.length / articlesPerPage) || 1)
    } catch (error) {
      console.error('Error fetching user articles:', error)
      setArticles([])
      setTotalPages(1)
    } finally {
      setArticlesLoading(false)
    }
  }
  
  // Fetch followers and following on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(handleGetFollowers(user.id))
      dispatch(handleGetFollowing(user.id))
      
      // Check follow status for this user if we have their ID
      dispatch(handleCheckFollowing(user.id))
    }
  }, [dispatch, user?.id])
  
  if (userLoading) {
    return (
      <>
        <SiteHeader />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="relative -mt-20 md:-mt-24">
                  <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <Skeleton className="h-8 w-40 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Skeleton className="h-4 w-full max-w-md mb-4" />
                <Skeleton className="h-4 w-full max-w-sm" />
              </div>
            </div>
          </div>
          <Skeleton className="h-10 w-56 mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
        <SiteFooter />
      </>
    )
  }
  
  if (userError || !user) {
    return (
      <>
        <SiteHeader />
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy người dùng</h1>
          <p className="text-gray-600 mb-6">{userError || 'Người dùng không tồn tại hoặc đã bị xóa'}</p>
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader variant="solid" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className="relative -mt-20 md:-mt-24">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden">
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.fullname}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{user.fullname}</h1>
                    <p className="text-gray-500">@{username}</p>
                  </div>
                  <div>
                    {user.id !== currentUser?.id && (
                      <FollowButton journalistId={user.id} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio and Stats */}
            <div className="mt-6">
              <p className="text-gray-700 mb-4">{user.bio || 'Chưa có thông tin giới thiệu'}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {user.role === "JOURNALIST" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Nhà báo
                  </span>
                )}
                {user.address && (
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {user.address}
                  </span>
                )}
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Tham gia {formatJoinDate(user.created_at)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t">
              <Link href={`/profile/${username}/followers`} className="flex items-center hover:text-blue-600">
                <Users className="h-5 w-5 mr-2" />
                <span className="font-bold">{isClient ? followers.length : 0}</span>
                <span className="ml-1">người theo dõi</span>
              </Link>
              <Link href={`/profile/${username}/following`} className="flex items-center hover:text-blue-600">
                <UserIcon className="h-5 w-5 mr-2" />
                <span className="font-bold">{isClient ? following.length : 0}</span>
                <span className="ml-1">đang theo dõi</span>
              </Link>
              <div className="flex items-center">
                <span className="font-bold">{isClient ? articles.length : 0}</span>
                <span className="ml-1">bài viết</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="articles" id="user-articles">
          <TabsList className="mb-6">
            <TabsTrigger value="articles">Bài viết ({articles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {articlesLoading ? (
              // Loading state for articles
              Array(3).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-48 w-full" />
              ))
            ) : articles.length === 0 ? (
              // No articles
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium">Chưa có bài viết nào</p>
                <p className="text-gray-500 mt-1">Người dùng này chưa đăng bài viết nào</p>
              </div>
            ) : (
              // Articles list with pagination
              // Calculate current page items
              articles.slice((page - 1) * 5, page * 5).map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto">
                      <Image
                        src={article.thumbnail || "/placeholder.svg"}
                        alt={article.title}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="font-medium text-blue-600">{article.category?.name || "Tin tức"}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(article.publishedAt || article.created_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}</span>
                      </div>
                      <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                        <Link href={`/article/${article.id}`}>{article.title}</Link>
                      </h2>
                      <p className="text-gray-600 mb-4">
                        <span dangerouslySetInnerHTML={{ 
                          __html: article.excerpt || 
                            (article.content ? article.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...' : '') 
                        }}></span>
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4">{article.view?.toLocaleString() || 0} lượt xem</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Trước
                </Button>
                
                <div className="text-sm text-gray-500">
                  Trang {page}/{totalPages}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Tiếp
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <SiteFooter />
    </>
  )
}
