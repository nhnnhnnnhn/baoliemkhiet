"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Tag } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetArticlesByTag } from "@/src/thunks/article/articleThunk"
import { handleGetTags } from "@/src/thunks/tag/tagThunk"
import { selectTags } from "@/src/thunks/tag/tagSlice"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Spinner } from "@/components/ui/spinner"

export default function TagPage({ params }: { params: { tag: string } }) {
  const dispatch = useAppDispatch()
  const tags = useAppSelector(selectTags)
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<any[]>([])
  const [numberOfArticles, setNumberOfArticles] = useState(0)
  
  const decodedTag = decodeURIComponent(params.tag)
  const tag = tags.find(t => t.slug === decodedTag)

  useEffect(() => {
    const fetchData = async () => {
      if (tag) {
        try {
          const response = await dispatch(handleGetArticlesByTag(tag.id)).unwrap()
          setArticles(response.articles)
          setNumberOfArticles(response.numberOfArticles)
        } catch (error) {
          console.error('Error fetching articles:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    
    fetchData()
  }, [dispatch, tag])

  if (!tag) {
    return (
      <>
        <SiteHeader />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy tag</h1>
            <Link href="/tags">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách tags
              </Button>
            </Link>
          </div>
        </div>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/tags" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <Tag className="h-6 w-6 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold">{tag.name}</h1>
            </div>
          </div>
          <p className="text-gray-600 mb-2">
            Tất cả các bài viết liên quan đến chủ đề "{tag.name}". Cập nhật tin tức, phân tích và góc nhìn mới nhất về chủ đề này.
          </p>
          <p className="text-sm text-gray-500">{numberOfArticles} bài viết</p>
        </div>

        {/* Articles */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" />
            <span className="ml-2">Đang tải bài viết...</span>
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-8">
            {articles.map((article) => (
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
                      <span className="font-medium text-blue-600">{article.category?.name}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                      <Link href={`/article/${article.id}`}>{article.title}</Link>
                    </h2>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/profile/${article.author?.id}`}
                        className="text-sm text-gray-500 hover:text-blue-600"
                      >
                        {article.author?.fullname || article.author?.name}
                      </Link>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4">{article.view?.toLocaleString() || 0} lượt xem</span>
                        <span className="mr-4">{article._count?.articleLikes || 0} lượt thích</span>
                        <span>{article._count?.articleComments || 0} bình luận</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Chưa có bài viết nào trong tag này</p>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
