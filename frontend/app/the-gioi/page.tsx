import Link from "next/link"
import { ChevronRightIcon, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function TheGioiPage() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-8 text-white">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Globe className="h-10 w-10 mr-4" />
          <div>
            <h1 className="text-4xl font-serif font-bold">Thế giới</h1>
            <p className="mt-2 max-w-2xl">
              Tin tức quốc tế, phân tích chuyên sâu và góc nhìn đa chiều về các sự kiện toàn cầu
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="py-2">
            <TabsList className="bg-transparent h-auto p-0 w-full justify-start space-x-8 overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="all"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-1"
              >
                Tất cả
              </TabsTrigger>
              <TabsTrigger
                value="chau-a"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-1"
              >
                Châu Á
              </TabsTrigger>
              <TabsTrigger
                value="chau-au"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-1"
              >
                Châu Âu
              </TabsTrigger>
              <TabsTrigger
                value="chau-my"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-1"
              >
                Châu Mỹ
              </TabsTrigger>
              <TabsTrigger
                value="chau-phi"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-1"
              >
                Châu Phi
              </TabsTrigger>
              <TabsTrigger
                value="chau-dai-duong"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-3 px-1"
              >
                Châu Đại Dương
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* World Map Section */}
        <div className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Globe className="h-6 w-6 mr-2 text-blue-600" />
            Tin tức theo khu vực
          </h2>
          <div className="aspect-[16/9] bg-blue-50 rounded-lg relative overflow-hidden">
            <img
              src="/placeholder.svg?height=500&width=1000&text=World Map"
              alt="World Map"
              className="w-full h-full object-cover"
            />
            {/* Interactive map would go here in a real implementation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-medium bg-white/80 p-4 rounded-lg">Bản đồ tương tác tin tức thế giới</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Featured Articles */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Tin nổi bật</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="aspect-[4/3] mb-4">
                    <img
                      src="/placeholder.svg?height=300&width=400&text=Featured 1"
                      alt="Featured Article 1"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="font-medium text-blue-600">Châu Âu</span>
                    <span className="mx-2">•</span>
                    <span>2 giờ trước</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 hover:text-blue-600">
                    <Link href="/articles/6">Liên minh Châu Âu thông qua gói viện trợ mới cho Ukraine</Link>
                  </h4>
                  <p className="text-gray-600">
                    Các nước thành viên EU đã nhất trí thông qua gói viện trợ trị giá 50 tỷ euro để hỗ trợ Ukraine trong
                    bối cảnh xung đột kéo dài.
                  </p>
                </div>

                <div>
                  <div className="aspect-[4/3] mb-4">
                    <img
                      src="/placeholder.svg?height=300&width=400&text=Featured 2"
                      alt="Featured Article 2"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="font-medium text-blue-600">Châu Á</span>
                    <span className="mx-2">•</span>
                    <span>3 giờ trước</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 hover:text-blue-600">
                    <Link href="/articles/7">Nhật Bản và Hàn Quốc tăng cường hợp tác an ninh khu vực</Link>
                  </h4>
                  <p className="text-gray-600">
                    Lãnh đạo hai nước đã đồng ý mở rộng hợp tác trong lĩnh vực an ninh và quốc phòng nhằm đối phó với
                    các thách thức chung trong khu vực.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item}>
                    <div className="aspect-[4/3] mb-3">
                      <img
                        src={`/placeholder.svg?height=200&width=300&text=News ${item}`}
                        alt={`News ${item}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="font-medium text-blue-600">Châu Mỹ</span>
                      <span className="mx-2">•</span>
                      <span>5 giờ trước</span>
                    </div>
                    <h5 className="font-bold hover:text-blue-600">
                      <Link href="/articles/8">Mỹ công bố chiến lược mới về hợp tác kinh tế với khu vực Mỹ Latinh</Link>
                    </h5>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Tin mới nhất</h3>
                <Button variant="ghost" className="text-sm flex items-center">
                  Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="font-medium text-blue-600">Châu Phi</span>
                        <span className="mx-2">•</span>
                        <span>8 giờ trước</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2 hover:text-blue-600">
                        <Link href="/articles/9">
                          Liên Hợp Quốc kêu gọi tăng cường viện trợ nhân đạo cho các nước Đông Phi
                        </Link>
                      </h4>
                      <p className="text-gray-600">
                        Tình trạng hạn hán kéo dài đã gây ra khủng hoảng lương thực nghiêm trọng tại nhiều quốc gia
                        trong khu vực.
                      </p>
                    </div>
                    <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                      <img
                        src={`/placeholder.svg?height=200&width=300&text=News ${item}`}
                        alt={`News ${item}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Breaking News */}
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                  Tin mới nhận
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="pb-4 border-b border-red-100 last:border-0 last:pb-0">
                      <span className="text-xs font-medium text-red-500 block mb-1">
                        {item === 1 ? "Vừa cập nhật" : `${item} giờ trước`}
                      </span>
                      <h4 className="font-medium hover:text-red-600">
                        <Link href="/articles/10">Động đất mạnh 6.2 độ richter xảy ra tại khu vực Thái Bình Dương</Link>
                      </h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* World Economy */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">Kinh tế thế giới</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                        <img
                          src={`/placeholder.svg?height=100&width=100&text=Econ ${item}`}
                          alt={`Economy ${item}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium hover:text-blue-600">
                          <Link href="/articles/11">
                            Ngân hàng Thế giới dự báo tăng trưởng kinh tế toàn cầu đạt 3.1% trong năm 2024
                          </Link>
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>10 giờ trước</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Global Issues */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">Vấn đề toàn cầu</h3>
                <div className="space-y-4">
                  {["Biến đổi khí hậu", "An ninh mạng", "Di cư", "Dịch bệnh", "Khủng bố"].map((issue, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <h4 className="font-medium hover:text-blue-600 mb-2">
                        <Link href="#">{issue}</Link>
                      </h4>
                      <p className="text-sm text-gray-600">
                        Các tin tức và phân tích mới nhất về {issue.toLowerCase()} và tác động toàn cầu.
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscribe */}
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Nhận tin thế giới hàng ngày</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Đăng ký nhận bản tin điện tử với những tin tức quan trọng nhất từ khắp nơi trên thế giới.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Đăng ký
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton />
      </div>
    </div>
  )
}
