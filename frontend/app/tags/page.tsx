"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Tag } from "lucide-react"

import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Group tags by first letter
const groupTagsByFirstLetter = (tags: { id: number, name: string }[]) => {
  const grouped: Record<string, { id: number, name: string }[]> = {}

  tags.forEach((tag) => {
    const firstLetter = tag.name.charAt(0).toUpperCase()
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = []
    }
    grouped[firstLetter].push(tag)
  })

  return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]))
}

export default function TagsPage() {
  const [tags, setTags] = useState<{ id: number, name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true)
      setError("")
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
        const res = await fetch("/api/tags", {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        })
        if (!res.ok) throw new Error("Không thể tải danh sách thẻ")
        let data = await res.json()
        data = data.map((tag: any) => ({
          id: tag.id,
          name: tag.name
        }))
        setTags(data)
      } catch (err: any) {
        setError(err.message || "Đã có lỗi xảy ra")
      } finally {
        setLoading(false)
      }
    }
    fetchTags()
  }, [])

  // Lọc theo search
  const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
  const groupedTags = groupTagsByFirstLetter(filteredTags)

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Thẻ</h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm thẻ..."
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Đang tải thẻ...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <>
            {/* Alphabet Navigation */}
            <div className="flex flex-wrap gap-2 mb-8">
              {groupedTags.map(([letter]) => (
                <a
                  key={letter}
                  href={`#section-${letter}`}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 font-medium"
                >
                  {letter}
                </a>
              ))}
            </div>

            {/* Tags by Letter */}
            <div className="space-y-8">
              {groupedTags.map(([letter, tags]) => (
                <div key={letter} id={`section-${letter}`}>
                  <h2 className="text-2xl font-bold mb-4 border-b pb-2">{letter}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${encodeURIComponent(tag.name.toLowerCase())}`}
                        className="flex items-center p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50"
                      >
                        <Tag className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">{tag.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
