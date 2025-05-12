"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, ThumbsUp, Share2, Bookmark, Facebook, Twitter, AlertTriangle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ChatbotButton } from "@/components/chatbot-button"
import articleApi from "@/src/apis/article"

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
    user: {
      name: string;
      avatar: string;
    };
    content: string;
    date: string;
    time: string;
    likes: number;
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
          comments: [], // Sẽ triển khai API comments sau
          relatedArticles: [] // Sẽ triển khai API bài viết liên quan sau
        };
        
        // Tạm thời thêm dữ liệu mẫu cho phần bình luận và bài viết liên quan
        articleData.comments = [
          {
            user: { name: 'Người đọc', avatar: '/placeholder.svg?height=40&width=40' },
            content: 'Bài viết rất hay và bổ ích!',
            date: new Date().toLocaleDateString('vi-VN'),
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            likes: 5
          }
        ];
        
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
        console.log('Dữ liệu bài viết:', articleData);
        setError(null)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu bài viết:', err)
        setError('Không thể tải bài viết. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchArticle()
  }, [params.slug])

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
          <h2 className="text-2xl font-bold mb-6">Bình luận ({article.comments.length})</h2>

          {/* Comment Form */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Để lại bình luận</h3>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Viết bình luận của bạn..."
            ></textarea>
            <Button>Gửi bình luận</Button>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {article.comments.map((comment: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{comment.user.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {comment.date} • {comment.time}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <ThumbsUp size={16} />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <MessageSquare size={16} />
                    <span>Trả lời</span>
                  </button>
                </div>
              </div>
            ))}
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
    </>
  )
}
