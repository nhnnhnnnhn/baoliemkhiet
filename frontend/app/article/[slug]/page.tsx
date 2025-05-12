"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { format, parseISO, isValid } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, ThumbsUp, Share2, Bookmark, Facebook, Twitter, AlertTriangle, Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ChatbotButton } from "@/components/chatbot-button"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetArticleBySlug, handleGetRelatedArticles } from "@/src/thunks/article/articleThunk"
import { selectSelectedArticle, selectRelatedArticles, selectIsLoading } from "@/src/thunks/article/articleSlice"

      {
        title: "Doanh nghiệp công nghệ Việt Nam đón đầu xu hướng AI",
        slug: "doanh-nghiep-cong-nghe-viet-nam-don-dau-xu-huong-ai",
        thumbnail: "/placeholder.svg?height=200&width=300",
        category: "Công nghệ",
        publishDate: "12/04/2025",
      },
    ],
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleData(params.slug)

  return (
    <>
      <SiteHeader />
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
            {article.comments.map((comment, index) => (
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
            {article.relatedArticles.map((relatedArticle, index) => (
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
