"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import articleApi, { Article } from "@/src/apis/article"

const trendingSearches = [
  "Biến đổi khí hậu",
  "Lạm phát",
  "Chứng khoán",
  "World Cup",
  "Công nghệ AI",
  "Vaccine mới",
  "Bầu cử",
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return

    const updatedSearches = [search, ...recentSearches.filter((item) => item !== search)].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  // Clear a specific recent search
  const clearRecentSearch = (search: string) => {
    const updatedSearches = recentSearches.filter((item) => item !== search)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  // Clear all recent searches
  const clearAllRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  // Debounce search khi nhập
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(async () => {
      try {
        const results = await articleApi.searchArticles(query)
        setSearchResults(results)
        saveRecentSearch(query)
      } catch (err) {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 400)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Handle clicking on a trending or recent search
  const handleSearchClick = async (search: string) => {
    setQuery(search)
    setIsSearching(true)
    try {
      const results = await articleApi.searchArticles(search)
      setSearchResults(results)
      saveRecentSearch(search)
    } catch (err) {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <form onSubmit={e => e.preventDefault()} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm tin tức, chủ đề, tác giả..."
                className="pl-10 pr-10 py-6 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Show search results if there are any */}
        {searchResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Kết quả tìm kiếm cho "{query}"</h2>

            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="news">Tin tức</TabsTrigger>
                <TabsTrigger value="opinion">Ý kiến</TabsTrigger>
                <TabsTrigger value="multimedia">Đa phương tiện</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {searchResults.map((article) => (
                  <div key={article.id} className="flex gap-4 pb-6 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="font-medium text-blue-600">{article.category?.name || "Không rõ"}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {article.published_at
                            ? new Date(article.published_at).toLocaleDateString("vi-VN")
                            : article.created_at
                              ? new Date(article.created_at).toLocaleDateString("vi-VN")
                              : ""}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      <p className="text-gray-600">{article.excerpt || (article.content?.slice(0, 120) + "...")}</p>
                    </div>
                    <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                      <img
                        src={article.thumbnail || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="news">
                <p className="text-center text-gray-500 py-8">Hiển thị kết quả cho danh mục Tin tức</p>
              </TabsContent>

              <TabsContent value="opinion">
                <p className="text-center text-gray-500 py-8">Hiển thị kết quả cho danh mục Ý kiến</p>
              </TabsContent>

              <TabsContent value="multimedia">
                <p className="text-center text-gray-500 py-8">Hiển thị kết quả cho danh mục Đa phương tiện</p>
              </TabsContent>
            </Tabs>
          </div>
        ) : isSearching ? (
          // Show loading state
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
          </div>
        ) : (
          // Show search suggestions when no search has been performed
          <div>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Tìm kiếm gần đây</h2>
                  <Button variant="ghost" size="sm" onClick={clearAllRecentSearches}>
                    Xóa tất cả
                  </Button>
                </div>
                <ul className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <button
                        onClick={() => handleSearchClick(search)}
                        className="text-left flex-1 hover:text-blue-600"
                      >
                        {search}
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearRecentSearch(search)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <h2 className="text-lg font-bold mb-4">Xu hướng tìm kiếm</h2>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchClick(search)}
                    className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mt-12">
              <h2 className="text-lg font-bold mb-4">Khám phá theo danh mục</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Thời sự", "Thế giới", "Kinh doanh", "Công nghệ", "Thể thao", "Giải trí", "Sức khỏe", "Đời sống"].map(
                  (category, index) => (
                    <Link key={index} href="#" className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center">
                      {category}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
