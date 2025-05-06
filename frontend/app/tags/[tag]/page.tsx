import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Mock function to get tag data
const getTagData = (tagName: string) => {
  // In a real app, this would fetch data from an API
  return {
    id: 1,
    name: tagName.charAt(0).toUpperCase() + tagName.slice(1),
    articlesCount: 156,
    description: `Tất cả các bài viết liên quan đến chủ đề "${tagName.charAt(0).toUpperCase() + tagName.slice(1)}". Cập nhật tin tức, phân tích và góc nhìn mới nhất về chủ đề này.`,
  }
}

// Mock function to get articles by tag
const getArticlesByTag = (tagName: string) => {
  // In a real app, this would fetch data from an API
  return Array(10)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: `Bài viết về ${tagName} số ${i + 1}`,
      slug: `bai-viet-ve-${tagName}-so-${i + 1}`,
      excerpt: `Đây là tóm tắt ngắn gọn về nội dung bài viết liên quan đến chủ đề ${tagName}. Bài viết này cung cấp thông tin, phân tích và góc nhìn mới về chủ đề.`,
      publishedAt: `${15 - i}/04/2025`,
      category: i % 3 === 0 ? "Thời sự" : i % 3 === 1 ? "Kinh doanh" : "Công nghệ",
      thumbnail: `/placeholder.svg?height=200&width=300&text=Article+${i + 1}`,
      author: {
        name: `Tác giả ${i + 1}`,
        username: `author${i + 1}`,
      },
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 100) + 10,
    }))
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const decodedTag = decodeURIComponent(params.tag)
  const tag = getTagData(decodedTag)
  const articles = getArticlesByTag(decodedTag)

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
          <p className="text-gray-600 mb-2">{tag.description}</p>
          <p className="text-sm text-gray-500">{tag.articlesCount} bài viết</p>
        </div>

        {/* Articles */}
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
                    <span className="font-medium text-blue-600">{article.category}</span>
                    <span className="mx-2">•</span>
                    <span>{article.publishedAt}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                    <Link href={`/article/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/profile/${article.author.username}`}
                      className="text-sm text-gray-500 hover:text-blue-600"
                    >
                      {article.author.name}
                    </Link>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">{article.views.toLocaleString()} lượt xem</span>
                      <span className="mr-4">{article.likes} lượt thích</span>
                      <span>{article.comments} bình luận</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="mx-1">
            1
          </Button>
          <Button variant="outline" className="mx-1">
            2
          </Button>
          <Button variant="outline" className="mx-1">
            3
          </Button>
          <span className="mx-2 flex items-center">...</span>
          <Button variant="outline" className="mx-1">
            10
          </Button>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
