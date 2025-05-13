"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetComments, handleCreateComment, handleUpdateComment, handleDeleteComment } from "@/src/thunks/comment/commentThunk"
import { 
  selectComments, 
  selectCommentsLoading, 
  selectCommentError, 
  selectCommentPagination,
  selectCreateCommentLoading,
  selectCreateCommentSuccess,
  selectUpdateCommentLoading,
  selectUpdateCommentSuccess,
  selectUpdateCommentError,
  clearCreateCommentState,
  clearUpdateCommentState
} from "@/src/thunks/comment/commentSlice"
import { selectCurrentUser, selectIsLoggedIn } from "@/src/thunks/auth/authSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, ThumbsUp, Share2, Bookmark, Facebook, Twitter, AlertTriangle, Edit, Trash2, XCircle, CheckCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ChatbotButton } from "@/components/chatbot-button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Comment } from "@/src/apis/comment"
import articleApi from "@/src/apis/article"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Helper function để định dạng ngày tháng an toàn
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Lỗi định dạng ngày:', error);
    return '';
  }
};

// Helper function để định dạng giờ an toàn
const formatTime = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Lỗi định dạng giờ:', error);
    return '';
  }
};

// Cấu trúc dữ liệu bài viết cho giao diện
interface ArticleUI {
  id: string | number;
  title: string;
  publishDate: string;
  publishTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    username: string;
    id?: number;
  };
  content: Array<{type: string; value: string; url?: string; caption?: string}>;
  stats: {
    views: number;
    shares: number;
    likes: number;
    comments: number;
  };
  tags: Array<{id: number; name: string}>;
  comments: Array<{
    id: number;
    content: string;
    articleId: number;
    userId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    user?: {
      id: number;
      fullname: string;
      email: string;
      avatar?: string;
    };
  }>;
  relatedArticles: Array<{
    slug: string;
    title: string;
    publishDate: string;
    category: string;
    thumbnail: string;
  }>;
}

// Hàm tạo bài viết demo khi chưa có dữ liệu từ API hoặc lỗi
const createEmptyArticle = (): ArticleUI => {
  return {
    id: "",
    title: "Bài viết đang được tải...",
    publishDate: formatDate(new Date().toISOString()),
    publishTime: formatTime(new Date().toISOString()),
    category: "Tin tức",
    author: {
      name: "Tác giả",
      avatar: "/placeholder.svg?height=80&width=80",
      bio: "Báo Liêm Khiết",
      username: "tacgia",
    },
    content: [
      {
        type: "text",
        value: "Nội dung bài viết đang được tải, vui lòng đợi trong giây lát...",
      }
    ],
    stats: {
      views: 0,
      shares: 0,
      likes: 0,
      comments: 0,
    },
    tags: [],
    comments: [],
    relatedArticles: []
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<ArticleUI>(createEmptyArticle())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState("")
  
  // States for editing comments
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState("")
  const editCommentRef = useRef<HTMLTextAreaElement>(null)
  
  // States for delete comment dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null)
  
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  
  // Comment selectors
  const comments = useAppSelector(selectComments)
  const commentsLoading = useAppSelector(selectCommentsLoading)
  const commentError = useAppSelector(selectCommentError)
  const { totalComments } = useAppSelector(selectCommentPagination)
  const isCreatingComment = useAppSelector(selectCreateCommentLoading)
  const createCommentSuccess = useAppSelector(selectCreateCommentSuccess)
  const isUpdatingComment = useAppSelector(selectUpdateCommentLoading)
  const updateCommentSuccess = useAppSelector(selectUpdateCommentSuccess)
  const updateCommentError = useAppSelector(selectUpdateCommentError)
  
  // User authentication
  const isAuthenticated = useAppSelector(selectIsLoggedIn)
  const currentUser = useAppSelector(selectCurrentUser)
  
  // Fetch dữ liệu bài viết từ API
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true)
        // Yêu cầu API lấy bài viết theo ID (nếu là số) hoặc theo slug
        const articleId = !isNaN(Number(params.slug)) ? Number(params.slug) : null
        if (!articleId) {
          throw new Error('ID bài viết không hợp lệ')
        }
        
        const response = await articleApi.getArticleById(articleId)
        
        // Kiểm tra trạng thái xuất bản của bài viết (isPublish)
        if (!response.isPublish) {
          setError('Bài viết này chưa được xuất bản hoặc không tồn tại.')
          setIsLoading(false)
          return
        }
        
        // Xử lý nội dung bài viết
        const processedContent = [];
        if (response.content) {
          // Tách nội dung HTML thành các đoạn văn và hình ảnh
          const contentParts = response.content.split(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g);
          
          for (let i = 0; i < contentParts.length; i++) {
            if (contentParts[i].trim()) {
              processedContent.push({
                type: 'text',
                value: contentParts[i].trim()
              });
            }
            
            // Nếu có image URL và caption (tương ứng với các nhóm bắt trong regex)
            if (i+1 < contentParts.length && contentParts[i+1]?.includes('http')) {
              processedContent.push({
                type: 'image',
                value: '', // Thêm trường value trống để phù hợp với interface
                url: contentParts[i+1] || '/placeholder.svg?height=500&width=800',
                caption: contentParts[i+2] || 'Hình minh họa'
              });
              i += 2; // Bỏ qua 2 phần tử đã sử dụng (url và caption)
            }
          }
        } else {
          // Nếu không có nội dung, thêm một thông báo mặc định
          processedContent.push({
            type: 'text',
            value: 'Nội dung bài viết đang được cập nhật...'
          });
        }
        
        // Tạo bài viết với dữ liệu từ API
        const articleData: ArticleUI = {
          id: response.id.toString(),
          title: response.title,
          publishDate: formatDate(response.published_at) || new Date().toLocaleDateString('vi-VN'),
          publishTime: formatTime(response.published_at) || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          category: response.category?.name || 'Tin tức',
          content: processedContent.length > 0 ? processedContent : [{ type: 'text', value: response.content || 'Nội dung đang được cập nhật' }],
          author: {
            id: response.author_id,
            name: response.author?.name || 'Tác giả',
            avatar: response.author?.avatar || '/placeholder.svg?height=80&width=80',
            bio: response.author?.fullname ? `${response.author.fullname} - Phóng viên Báo Liêm Khiết` : 'Phóng viên Báo Liêm Khiết',
            username: response.author?.name?.toLowerCase().replace(/\s+/g, '') || 'tacgia'
          },
          stats: {
            views: response.view || 0,
            likes: 0, // Chưa có API
            shares: 0, // Chưa có API
            comments: 0  // Chưa có API
          },
          tags: response.tags || [], 
          comments: comments || [], // Sử dụng comments từ Redux
          relatedArticles: [] // Sẽ triển khai API bài viết liên quan sau
        };
        
        // Tạm thời thêm dữ liệu mẫu cho phần bình luận và bài viết liên quan
        // Remove temporary comment data as we're using Redux now
        articleData.comments = [];
        
        // Gọi API để lấy các bài viết liên quan trong cùng danh mục
        try {
          const relatedArticlesData = await articleApi.getArticlesByCategory(response.category_id || 1);
          
          // Lọc chỉ lấy các bài viết khác (không lấy bài viết hiện tại)
          const otherArticles = relatedArticlesData
            .filter(item => item.id !== response.id && item.isPublish)
            .slice(0, 3); // Chỉ lấy tối đa 3 bài
          
          articleData.relatedArticles = otherArticles.map(item => ({
            slug: item.id.toString(),
            title: item.title,
            publishDate: formatDate(item.published_at) || '',
            category: item.category?.name || 'Tin tức', 
            thumbnail: item.thumbnail || '/placeholder.svg?height=200&width=300'
          }));
        } catch (error) {
          console.log('Không thể lấy bài viết liên quan:', error);
        }
        
        setArticle(articleData)
        setError(null)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu bài viết:', err)
        setError('Không thể tải bài viết. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchArticle()

    // Fetch comments when article ID is available
    if (params.slug && !isNaN(Number(params.slug))) {
      dispatch(handleGetComments({ articleId: Number(params.slug) }))
    }
  }, [params.slug, dispatch])

  // Handle comment submission success and reset state
  useEffect(() => {
    if (createCommentSuccess) {
      toast({
        title: "Bình luận thành công",
        description: "Bình luận của bạn đã được gửi.",
        variant: "default"
      })
      
      // Reset comment form
      setCommentContent("")
      
      // Clear create comment state
      dispatch(clearCreateCommentState())
      
      // Refresh comments to show newly added comment if it's approved
      dispatch(handleGetComments({ articleId: Number(params.slug) }))
    }
  }, [createCommentSuccess, dispatch, params.slug, toast])

  // Handle comment update success and reset state
  useEffect(() => {
    if (updateCommentSuccess) {
      toast({
        title: "Cập nhật bình luận thành công",
        description: "Bình luận của bạn đã được cập nhật.",
        variant: "default"
      })
      
      // Reset edit state
      setEditingCommentId(null)
      setEditingCommentContent("")
      
      // Clear update comment state
      dispatch(clearUpdateCommentState())
      
      // Refresh comments
      dispatch(handleGetComments({ articleId: Number(params.slug) }))
    }
    
    if (updateCommentError) {
      toast({
        title: "Lỗi cập nhật bình luận",
        description: updateCommentError,
        variant: "destructive"
      })
      
      dispatch(clearUpdateCommentState())
    }
  }, [updateCommentSuccess, updateCommentError, dispatch, params.slug, toast])

  // Focus on edit textarea when starting edit
  useEffect(() => {
    if (editingCommentId && editCommentRef.current) {
      editCommentRef.current.focus()
    }
  }, [editingCommentId])

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return
    
    // Check if user is authenticated
    if (!isAuthenticated || !currentUser?.id) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để bình luận.",
        variant: "destructive"
      })
      router.push('/auth/login')
      return
    }

    try {
      await dispatch(handleCreateComment({
        content: commentContent,
        article_id: Number(article.id),
        author_id: currentUser.id,
        status: 'PENDING' // Default status, will be auto-approved by DeepSeek if appropriate
      })).unwrap()
    } catch (error) {
      console.error("Failed to post comment:", error)
      toast({
        title: "Lỗi",
        description: "Không thể gửi bình luận. Vui lòng thử lại sau.",
        variant: "destructive"
      })
    }
  }
  
  // Handle starting edit of a comment
  const handleEditComment = (comment: Comment) => {
    if (!isAuthenticated || !currentUser) return
    
    // Only allow editing own comments
    if (comment.userId !== currentUser.id) {
      toast({
        title: "Không thể chỉnh sửa",
        description: "Bạn chỉ có thể chỉnh sửa bình luận của mình.",
        variant: "destructive"
      })
      return
    }
    
    setEditingCommentId(comment.id)
    setEditingCommentContent(comment.content)
  }
  
  // Handle saving edited comment
  const handleSaveComment = async () => {
    if (!editingCommentId || !editingCommentContent.trim() || !isAuthenticated) return
    
    try {
      await dispatch(handleUpdateComment({
        articleId: Number(article.id),
        commentId: editingCommentId,
        data: {
          content: editingCommentContent
        }
      })).unwrap()
    } catch (error) {
      console.error("Failed to update comment:", error)
    }
  }
  
  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingCommentContent("")
  }
  
  // Handle deleting a comment
  const handleDeleteCommentClick = async (commentId: number) => {
    if (!isAuthenticated || !currentUser) return
    
    // Find the comment
    const comment = comments.find(c => c.id === commentId)
    if (!comment) return
    
    // Check if user is the author
    if (comment.userId !== currentUser.id) {
      toast({
        title: "Không thể xóa",
        description: "Bạn chỉ có thể xóa bình luận của mình.",
        variant: "destructive"
      })
      return
    }
    
    try {
      await dispatch(handleDeleteComment({
        articleId: Number(article.id),
        commentId
      })).unwrap()
      
      toast({
        title: "Đã xóa bình luận",
        description: "Bình luận của bạn đã được xóa thành công.",
        variant: "default"
      })
      
      // Refresh comments
      dispatch(handleGetComments({ articleId: Number(params.slug) }))
      
      // Close the dialog
      setDeleteDialogOpen(false)
      setCommentToDelete(null)
    } catch (error) {
      console.error("Failed to delete comment:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa bình luận. Vui lòng thử lại sau.",
        variant: "destructive"
      })
      
      // Close the dialog even on error
      setDeleteDialogOpen(false)
      setCommentToDelete(null)
    }
  }

  return (
    <>
      <SiteHeader variant="solid" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">
            Trang chủ
          </Link>{" "}
          &gt;{" "}
          <Link href={`/${article.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:underline">
            {article.category}
          </Link>{" "}
          &gt; <span className="text-gray-700">Bài viết hiện tại</span>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>{article.publishDate}</span>
            <span className="mx-2">•</span>
            <span>{article.publishTime}</span>
            <span className="mx-2">•</span>
            <Link
              href={`/${article.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-blue-600 hover:underline"
            >
              {article.category}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{article.title}</h1>

          {/* Social Share */}
          <div className="flex space-x-4 mb-6">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Facebook size={16} />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Twitter size={16} />
              <span className="hidden sm:inline">Tweet</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 size={16} />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bookmark size={16} />
              <span className="hidden sm:inline">Lưu</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <Link href={`/user/reports/add?articleId=${article.id}`}>Báo cáo</Link>
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-10">
          {article.content.map((block, index) => {
            if (block.type === "text") {
              return (
                <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                  {block.value}
                </p>
              )
            } else if (block.type === "image") {
              return (
                <figure key={index} className="my-8">
                  <div className="relative w-full h-[400px]">
                    <Image
                      src={block.url || "/placeholder.svg"}
                      alt={block.caption || ""}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <figcaption className="text-sm text-gray-500 mt-2 text-center italic">{block.caption}</figcaption>
                </figure>
              )
            }
            return null
          })}
        </div>

        {/* Author Info */}
        <div className="bg-gray-50 p-6 rounded-lg mb-10">
          <Link href={`/profile/${article.author.username}`} className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold mb-1">Tác giả: {article.author.name}</h3>
              <p className="text-gray-600 mb-3">{article.author.bio}</p>
              <Button variant="outline" size="sm">
                Xem tất cả bài viết
              </Button>
            </div>
          </Link>
        </div>

        <Separator className="my-10" />

        {/* Comments Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Bình luận ({totalComments})</h2>

          {/* Comment Form */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8 mt-10 comment-form">
            <h3 className="text-lg font-semibold mb-4">Để lại bình luận</h3>
            {isAuthenticated ? (
              <>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Viết bình luận của bạn..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={!commentContent.trim() || isCreatingComment}
                  >
                    {isCreatingComment ? "Đang gửi..." : "Gửi bình luận"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Bình luận của bạn sẽ được hiển thị ngay.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">Bạn cần đăng nhập để bình luận</p>
                <Button onClick={() => router.push('/auth/login')}>
                  Đăng nhập
                </Button>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {commentsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2">Đang tải bình luận...</p>
              </div>
            ) : commentError ? (
              <div className="text-center text-red-500 py-4 bg-red-50 rounded-lg p-4">
                <p className="font-medium">Có lỗi khi tải bình luận</p>
                <p className="text-sm mt-1">{commentError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => dispatch(handleGetComments({ articleId: Number(params.slug) }))}
                >
                  Thử lại
                </Button>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg p-6">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-lg font-medium">Chưa có bình luận nào</p>
                <p className="text-gray-400 mt-1 mb-4">Hãy là người đầu tiên bình luận về bài viết này!</p>
                {isAuthenticated ? (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Cuộn đến phần form bình luận
                      document.querySelector('.comment-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Viết bình luận
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/auth/login')}>
                    Đăng nhập để bình luận
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Các bình luận ({totalComments})</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => dispatch(handleGetComments({ articleId: Number(params.slug) }))}
                  >
                    Làm mới
                  </Button>
                </div>
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    {/* Chế độ xem */}
                    {editingCommentId !== comment.id ? (
                      <>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={comment.user?.avatar || "/placeholder.svg"} alt={comment.user?.fullname || ""} />
                              <AvatarFallback>{(comment.user?.fullname || "U")[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium block">{comment.user?.fullname || "Người dùng ẩn danh"}</span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)} • {formatTime(comment.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Nút chỉnh sửa/xóa chỉ hiển thị cho người viết bình luận */}
                          {isAuthenticated && currentUser && comment.userId === currentUser.id && (
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditComment(comment)}
                                className="h-8 w-8"
                              >
                                <Edit size={16} className="text-gray-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setDeleteDialogOpen(true)
                                  setCommentToDelete(comment)
                                }}
                                className="h-8 w-8"
                              >
                                <Trash2 size={16} className="text-gray-500" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 my-3 whitespace-pre-line">{comment.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <ThumbsUp size={16} />
                            <span>Thích</span>
                          </button>
                          {isAuthenticated && (
                            <button className="flex items-center gap-1 hover:text-blue-600">
                              <MessageSquare size={16} />
                              <span>Trả lời</span>
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Chế độ chỉnh sửa */
                      <div className="p-2">
                        <div className="flex justify-between mb-3">
                          <h4 className="font-medium">Chỉnh sửa bình luận</h4>
                        </div>
                        <textarea
                          ref={editCommentRef}
                          className="w-full border border-gray-300 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1"
                          >
                            <XCircle size={16} />
                            Hủy
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveComment}
                            disabled={!editingCommentContent.trim() || isUpdatingComment}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle size={16} />
                            {isUpdatingComment ? "Đang lưu..." : "Lưu"}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Bình luận đã chỉnh sửa sẽ được cập nhật ngay.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {totalComments > comments.length && (
                  <div className="text-center mt-6">
                    <Button variant="outline" onClick={() => {
                      // Load more comments
                      dispatch(handleGetComments({ 
                        articleId: Number(params.slug),
                        page: Math.ceil(comments.length / 10) + 1
                      }))
                    }}>
                      Xem thêm bình luận
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Separator className="my-10" />

        {/* Related Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Bài viết bạn có thể quan tâm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.relatedArticles.map((relatedArticle: any, index: number) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={relatedArticle.thumbnail || "/placeholder.svg"}
                    alt={relatedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {relatedArticle.category} • {relatedArticle.publishDate}
                  </div>
                  <Link
                    href={`/article/${relatedArticle.slug}`}
                    className="text-lg font-semibold hover:text-blue-600 line-clamp-2"
                  >
                    {relatedArticle.title}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <ChatbotButton />

      {/* Delete Comment Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bình luận</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa bình luận này không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (commentToDelete) {
                  handleDeleteCommentClick(commentToDelete.id)
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
