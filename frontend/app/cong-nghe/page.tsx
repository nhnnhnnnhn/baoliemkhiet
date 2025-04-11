import Link from "next/link"
import { CalendarIcon, ChevronRightIcon, Cpu, Smartphone, Laptop, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { ChatbotButton } from "@/components/chatbot-button"

// Giữ nguyên nội dung trang Công nghệ nhưng thêm SiteHeader
export default function CongNghePage() {
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-gradient-to-r from-purple-900 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center text-sm mb-4">
              <Link href="/" className="text-purple-100 hover:text-white">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium">Công nghệ</span>
            </div>
            <div className="flex items-center">
              <Cpu className="h-8 w-8 mr-3" />
              <h1 className="text-4xl font-serif font-bold">Công nghệ</h1>
            </div>
            <div className="flex items-center mt-2 text-sm text-purple-100">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Category Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="py-2">
              <TabsList className="bg-transparent h-auto p-0 w-full justify-start space-x-8 overflow-x-auto flex-nowrap">
                <TabsTrigger
                  value="all"
                  className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none pb-3 px-1"
                >
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value="mobile"
                  className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none pb-3 px-1"
                >
                  Di động
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none pb-3 px-1"
                >
                  Trí tuệ nhân tạo
                </TabsTrigger>
                <TabsTrigger
                  value="software"
                  className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none pb-3 px-1"
                >
                  Phần mềm
                </TabsTrigger>
                <TabsTrigger
                  value="hardware"
                  className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none pb-3 px-1"
                >
                  Phần cứng
                </TabsTrigger>
                <TabsTrigger
                  value="internet"
                  className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none pb-3 px-1"
                >
                  Internet
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tech Highlights */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl font-bold mb-4">Công nghệ nổi bật</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="#" className="block group">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <Smartphone className="h-10 w-10 text-purple-600 mb-2" />
                  <span className="font-medium group-hover:text-purple-600">Di động</span>
                </div>
              </Link>
              <Link href="#" className="block group">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <Laptop className="h-10 w-10 text-purple-600 mb-2" />
                  <span className="font-medium group-hover:text-purple-600">Máy tính</span>
                </div>
              </Link>
              <Link href="#" className="block group">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <Cpu className="h-10 w-10 text-purple-600 mb-2" />
                  <span className="font-medium group-hover:text-purple-600">Trí tuệ nhân tạo</span>
                </div>
              </Link>
              <Link href="#" className="block group">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <Wifi className="h-10 w-10 text-purple-600 mb-2" />
                  <span className="font-medium group-hover:text-purple-600">Internet</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2">
              {/* Featured Article */}
              <div className="mb-12">
                <div className="relative aspect-[16/9] mb-4">
                  <img
                    src="/placeholder.svg?height=500&width=900&text=AI"
                    alt="Featured Tech Article"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-3 hover:text-purple-600">
                  <Link href="#">
                    Trí tuệ nhân tạo GPT-5 đạt bước tiến đột phá trong khả năng hiểu ngôn ngữ tự nhiên
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 text-lg">
                  Mô hình ngôn ngữ lớn mới nhất của OpenAI đã đạt được những tiến bộ vượt bậc trong việc hiểu và xử lý
                  ngôn ngữ tự nhiên, mở ra nhiều ứng dụng mới trong lĩnh vực AI.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-purple-600">Trí tuệ nhân tạo</span>
                  <span className="mx-2">•</span>
                  <span>2 giờ trước</span>
                </div>
              </div>

              {/* Tech News Grid */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Tin công nghệ mới nhất</h3>
                  <Button variant="ghost" className="text-sm flex items-center">
                    Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border-b pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3 aspect-[4/3]">
                          <img
                            src={`/placeholder.svg?height=200&width=300&text=Tech ${item}`}
                            alt={`Tech News ${item}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <h4 className="text-lg font-bold mb-2 hover:text-purple-600">
                            <Link href="#">Apple ra mắt iPhone 16 với nhiều cải tiến đáng kể về camera và pin</Link>
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            Thế hệ iPhone mới nhất của Apple được trang bị chip A18 và hệ thống camera được nâng cấp
                            mạnh mẽ.
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="font-medium text-purple-600">Di động</span>
                            <span className="mx-2">•</span>
                            <span>4 giờ trước</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Section */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-purple-600 mr-3"></div>
                  <h3 className="text-xl font-bold">Trí tuệ nhân tạo</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-[4/3]">
                        <img
                          src={`/placeholder.svg?height=200&width=300&text=AI ${item}`}
                          alt={`AI News ${item}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold mb-2 hover:text-purple-600">
                          <Link href="#">
                            Google DeepMind phát triển AI có khả năng dự đoán cấu trúc protein với độ chính xác cao
                          </Link>
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Công nghệ mới hứa hẹn đột phá trong nghiên cứu y học và phát triển thuốc.
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>6 giờ trước</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile News */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-purple-600 mr-3"></div>
                  <h3 className="text-xl font-bold">Di động</h3>
                </div>

                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="font-medium text-purple-600">Di động</span>
                          <span className="mx-2">•</span>
                          <span>8 giờ trước</span>
                        </div>
                        <h4 className="text-xl font-bold mb-2 hover:text-purple-600">
                          <Link href="#">Samsung công bố dòng Galaxy S24 với tính năng AI tiên tiến</Link>
                        </h4>
                        <p className="text-gray-600">
                          Dòng điện thoại cao cấp mới của Samsung tích hợp nhiều tính năng AI tiên tiến, nâng cao trải
                          nghiệm người dùng.
                        </p>
                      </div>
                      <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                        <img
                          src={`/placeholder.svg?height=200&width=300&text=Mobile ${item}`}
                          alt={`Mobile News ${item}`}
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
              {/* Tech Reviews */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 pb-2 border-b">Đánh giá sản phẩm</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                          <img
                            src={`/placeholder.svg?height=100&width=100&text=Review ${item}`}
                            alt={`Product Review ${item}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium hover:text-purple-600">
                            <Link href="#">Đánh giá chi tiết MacBook Pro M3: Hiệu năng vượt trội, pin bền bỉ</Link>
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1">4.8/5</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tech Tips */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 pb-2 border-b">Mẹo công nghệ</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <h4 className="font-medium hover:text-purple-600 mb-2">
                          <Link href="#">10 cách tăng tốc điện thoại Android cũ của bạn</Link>
                        </h4>
                        <p className="text-sm text-gray-600">
                          Những mẹo đơn giản giúp cải thiện hiệu suất cho điện thoại Android đã sử dụng lâu năm.
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tech Events */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 pb-2 border-b">Sự kiện công nghệ</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Vietnam Mobile Day 2024", date: "15/06/2024", location: "TP. Hồ Chí Minh" },
                      { name: "AI Summit Vietnam", date: "22/07/2024", location: "Hà Nội" },
                      { name: "Tech Startup Conference", date: "10/08/2024", location: "Đà Nẵng" },
                    ].map((event, index) => (
                      <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <h4 className="font-medium hover:text-purple-600">
                          <Link href="#">{event.name}</Link>
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{event.date}</span>
                          <span className="mx-1">•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subscribe */}
              <Card className="bg-purple-50 border-purple-100">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Nhận bản tin công nghệ</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Đăng ký nhận bản tin hàng tuần với những tin tức công nghệ mới nhất và đánh giá sản phẩm.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Email của bạn"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Đăng ký
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* AI Chatbot */}
        <div className="fixed bottom-6 right-6 z-50">
          <ChatbotButton />
        </div>
      </div>
    </>
  )
}
