"use client"

import { useEffect } from "react"
import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Edit, Eye, MessageSquare, Share2, ThumbsUp, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetArticleById } from "@/src/thunks/article/articleThunk"
import { selectSelectedArticle } from "@/src/thunks/article/articleSlice"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import styles from "../../../admin/admin.module.css"

// Định nghĩa các trạng thái và mapping
const ARTICLE_STATUS = {
  APPROVED: {
    value: "APPROVED",
    label: "Đã xuất bản",
    color: "bg-green-100 text-green-800"
  },
  PENDING: {
    value: "PENDING",
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-800"
  },
  DRAFT: {
    value: "DRAFT",
    label: "Bản nháp",
    color: "bg-gray-100 text-gray-800"
  },
  REJECTED: {
    value: "REJECTED",
    label: "Đã từ chối",
    color: "bg-red-100 text-red-800"
  }
} as const

type ArticleStatus = keyof typeof ARTICLE_STATUS

interface RelatedArticle {
  id: string
  title: string
  category?: {
    name: string
  }
  publishedAt?: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const article = useAppSelector(selectSelectedArticle)
  const isLoading = useAppSelector(state => state.article.isLoading)
  const resolvedParams = use(params)

  useEffect(() => {
    if (resolvedParams.id) {
      dispatch(handleGetArticleById(Number(resolvedParams.id)))
    }
  }, [dispatch, resolvedParams.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!article) {
    return <div>Không tìm thấy bài viết</div>
  }

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="flex items-center">
          <Link href="/author/articles">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <h1 className={styles.pageTitle}>Chi tiết bài viết</h1>
        </div>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Tác giả</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Bài viết</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>{article.id}</div>
        </div>
      </div>

      {/* Article Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{article.title}</CardTitle>
              <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    article.status === "APPROVED"
                      ? "default"
                      : article.status === "PENDING"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {ARTICLE_STATUS[article.status as ArticleStatus]?.label || article.status}
                </Badge>
                <Badge variant="secondary">{article.category?.name || "Chưa phân loại"}</Badge>
                <span className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {article.publishedAt 
                    ? new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : "Chưa xuất bản"}
                </span>
                <span className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  5 phút
                </span>
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/author/articles/${article.id}/edit`}>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </Link>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Article Content and Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Article Content */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nội dung bài viết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            </CardContent>
          </Card>
        </div>

        {/* Article Metadata */}
        <div className="space-y-6">
          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Tác giả</h4>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={article.author?.avatar} alt={article.author?.fullname} />
                    <AvatarFallback>{article.author?.fullname?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  <span>{article.author?.fullname || "Chưa có tác giả"}</span>
                </div>
              </div>

              {article.editor_name && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Biên tập viên</h4>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{article.editor_name}</span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Chuyên mục</h4>
                <Badge variant="secondary">{article.category?.name || "Chưa phân loại"}</Badge>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Thẻ</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: Tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Ngày xuất bản</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {article.publishedAt 
                      ? new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "Chưa xuất bản"}
                  </span>
                </div>
              </div>

              {article.updated_at && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Cập nhật lần cuối</h4>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {new Date(article.updated_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Article Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Lượt thích</span>
                </div>
                <span className="font-medium">{article._count?.articleLikes?.toLocaleString() || 0}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Bình luận</span>
                </div>
                <span className="font-medium">{article._count?.articleComments?.toLocaleString() || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bài viết liên quan</CardTitle>
            </CardHeader>
            <CardContent>
              {article.related_articles && article.related_articles.length > 0 ? (
                <div className="space-y-4">
                  {article.related_articles.map((relatedArticle: RelatedArticle) => (
                    <div key={relatedArticle.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <Link href={`/author/articles/${relatedArticle.id}`} className="hover:underline">
                        <h4 className="font-medium mb-1">{relatedArticle.title}</h4>
                      </Link>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Badge variant="secondary" className="mr-2">
                          {relatedArticle.category?.name || "Chưa phân loại"}
                        </Badge>
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {relatedArticle.publishedAt 
                          ? new Date(relatedArticle.publishedAt).toLocaleDateString('vi-VN')
                          : "Chưa xuất bản"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  Chưa có bài viết liên quan
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
