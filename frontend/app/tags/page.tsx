import Link from "next/link"
import { Search, Tag } from "lucide-react"

import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// Mock tags data
const mockTags = [
  { id: 1, name: "COVID-19", articlesCount: 156 },
  { id: 2, name: "Biến đổi khí hậu", articlesCount: 143 },
  { id: 3, name: "Kinh tế số", articlesCount: 128 },
  { id: 4, name: "Chuyển đổi số", articlesCount: 112 },
  { id: 5, name: "Giáo dục", articlesCount: 98 },
  { id: 6, name: "An ninh mạng", articlesCount: 87 },
  { id: 7, name: "Giao thông công cộng", articlesCount: 76 },
  { id: 8, name: "Phát triển bền vững", articlesCount: 72 },
  { id: 9, name: "Trí tuệ nhân tạo", articlesCount: 68 },
  { id: 10, name: "Blockchain", articlesCount: 65 },
  { id: 11, name: "Năng lượng tái tạo", articlesCount: 61 },
  { id: 12, name: "Khởi nghiệp", articlesCount: 58 },
  { id: 13, name: "Đô thị thông minh", articlesCount: 54 },
  { id: 14, name: "Vaccine", articlesCount: 52 },
  { id: 15, name: "Bất động sản", articlesCount: 49 },
  { id: 16, name: "Chứng khoán", articlesCount: 47 },
  { id: 17, name: "Thương mại điện tử", articlesCount: 45 },
  { id: 18, name: "Nông nghiệp công nghệ cao", articlesCount: 43 },
  { id: 19, name: "Du lịch", articlesCount: 41 },
  { id: 20, name: "Xuất khẩu", articlesCount: 39 },
  { id: 21, name: "Lạm phát", articlesCount: 37 },
  { id: 22, name: "Tỷ giá", articlesCount: 35 },
  { id: 23, name: "Thị trường lao động", articlesCount: 33 },
  { id: 24, name: "Cải cách hành chính", articlesCount: 31 },
  { id: 25, name: "Môi trường", articlesCount: 29 },
  { id: 26, name: "Y tế", articlesCount: 27 },
  { id: 27, name: "Giáo dục trực tuyến", articlesCount: 25 },
  { id: 28, name: "Làm việc từ xa", articlesCount: 23 },
  { id: 29, name: "Thể thao", articlesCount: 21 },
  { id: 30, name: "Văn hóa", articlesCount: 19 },
]

// Group tags by first letter
const groupTagsByFirstLetter = (tags: typeof mockTags) => {
  const grouped: Record<string, typeof mockTags> = {}

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
  const groupedTags = groupTagsByFirstLetter(mockTags)

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
            />
          </div>
        </div>

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
                    <div>
                      <span className="font-medium">{tag.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({tag.articlesCount})</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
