import Link from "next/link"
import {
  ArrowRightIcon,
  TrendingUpIcon,
  GlobeIcon,
  DollarSignIcon,
  MonitorIcon,
  ActivityIcon,
  BookOpenIcon,
  CameraIcon,
  MusicIcon,
  UtensilsIcon,
  HeartIcon,
  HomeIcon,
  ShoppingBagIcon,
} from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ChatbotButton } from "@/components/chatbot-button"

export default function ChuyenMucPage() {
  const categories = [
    {
      id: "thoi-su",
      name: "Thời sự",
      description: "Tin tức thời sự nóng hổi trong nước và quốc tế",
      icon: TrendingUpIcon,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      borderColor: "border-blue-600",
      image: "/placeholder.svg?height=200&width=300&text=Thời sự",
    },
    {
      id: "the-gioi",
      name: "Thế giới",
      description: "Tin tức quốc tế, thời sự thế giới mới nhất",
      icon: GlobeIcon,
      color: "bg-green-600",
      textColor: "text-green-600",
      borderColor: "border-green-600",
      image: "/placeholder.svg?height=200&width=300&text=Thế giới",
    },
    {
      id: "kinh-doanh",
      name: "Kinh doanh",
      description: "Tin tức kinh tế, tài chính, chứng khoán, bất động sản",
      icon: DollarSignIcon,
      color: "bg-amber-600",
      textColor: "text-amber-600",
      borderColor: "border-amber-600",
      image: "/placeholder.svg?height=200&width=300&text=Kinh doanh",
    },
    {
      id: "cong-nghe",
      name: "Công nghệ",
      description: "Tin tức công nghệ, sản phẩm mới, đánh giá thiết bị",
      icon: MonitorIcon,
      color: "bg-purple-600",
      textColor: "text-purple-600",
      borderColor: "border-purple-600",
      image: "/placeholder.svg?height=200&width=300&text=Công nghệ",
    },
    {
      id: "the-thao",
      name: "Thể thao",
      description: "Tin tức thể thao, bóng đá, tennis, bóng rổ",
      icon: ActivityIcon,
      color: "bg-red-600",
      textColor: "text-red-600",
      borderColor: "border-red-600",
      image: "/placeholder.svg?height=200&width=300&text=Thể thao",
    },
    {
      id: "giao-duc",
      name: "Giáo dục",
      description: "Tin tức giáo dục, tuyển sinh, đào tạo",
      icon: BookOpenIcon,
      color: "bg-sky-600",
      textColor: "text-sky-600",
      borderColor: "border-sky-600",
      image: "/placeholder.svg?height=200&width=300&text=Giáo dục",
    },
    {
      id: "giai-tri",
      name: "Giải trí",
      description: "Tin tức giải trí, showbiz, điện ảnh, âm nhạc",
      icon: CameraIcon,
      color: "bg-pink-600",
      textColor: "text-pink-600",
      borderColor: "border-pink-600",
      image: "/placeholder.svg?height=200&width=300&text=Giải trí",
    },
    {
      id: "am-nhac",
      name: "Âm nhạc",
      description: "Tin tức âm nhạc, album mới, concert, MV",
      icon: MusicIcon,
      color: "bg-indigo-600",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-600",
      image: "/placeholder.svg?height=200&width=300&text=Âm nhạc",
    },
    {
      id: "am-thuc",
      name: "Ẩm thực",
      description: "Tin tức ẩm thực, món ngon, nhà hàng, đánh giá",
      icon: UtensilsIcon,
      color: "bg-orange-600",
      textColor: "text-orange-600",
      borderColor: "border-orange-600",
      image: "/placeholder.svg?height=200&width=300&text=Ẩm thực",
    },
    {
      id: "suc-khoe",
      name: "Sức khỏe",
      description: "Tin tức sức khỏe, y tế, dinh dưỡng, làm đẹp",
      icon: HeartIcon,
      color: "bg-rose-600",
      textColor: "text-rose-600",
      borderColor: "border-rose-600",
      image: "/placeholder.svg?height=200&width=300&text=Sức khỏe",
    },
    {
      id: "nha-dat",
      name: "Nhà đất",
      description: "Tin tức bất động sản, nhà đất, dự án",
      icon: HomeIcon,
      color: "bg-teal-600",
      textColor: "text-teal-600",
      borderColor: "border-teal-600",
      image: "/placeholder.svg?height=200&width=300&text=Nhà đất",
    },
    {
      id: "mua-sam",
      name: "Mua sắm",
      description: "Tin tức mua sắm, khuyến mãi, sản phẩm mới",
      icon: ShoppingBagIcon,
      color: "bg-lime-600",
      textColor: "text-lime-600",
      borderColor: "border-lime-600",
      image: "/placeholder.svg?height=200&width=300&text=Mua sắm",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Chuyên mục</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các chuyên mục đa dạng của Báo Liêm Khiết với nội dung phong phú và cập nhật liên tục
            </p>
          </div>

          {/* Featured Categories */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">Chuyên mục nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 3).map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.id}`}
                  className="group block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className={`absolute inset-0 ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                    ></div>
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 left-4 ${category.color} text-white p-2 rounded-full`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className={`text-xl font-bold mb-2 group-hover:${category.textColor} transition-colors`}>
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-sm font-medium">
                      <span className={category.textColor}>Xem chuyên mục</span>
                      <ArrowRightIcon className={`ml-2 h-4 w-4 ${category.textColor}`} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Categories */}
          <div>
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">Tất cả chuyên mục</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.id}`}
                  className={`flex items-center p-4 rounded-lg border ${category.borderColor} hover:bg-gray-50 transition-colors`}
                >
                  <div className={`${category.color} p-2 rounded-full mr-3`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-xs text-gray-500">Xem bài viết mới nhất</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton />
      </div>
    </div>
  )
}
