import Link from "next/link"
import { ChevronRightIcon, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CategoryHeader } from "@/components/category-header"

export default function ThoiSuPage() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <CategoryHeader
        title="Thời sự"
        description="Cập nhật tin tức mới nhất về tình hình chính trị, xã hội, kinh tế và các vấn đề thời sự nóng hổi trong nước"
        icon={<FileText className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-red-700 to-red-500"
        textColor="text-red-600"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Featured Article */}
            <div className="mb-12">
              <div className="relative aspect-[16/9] mb-4">
                <img
                  src="/placeholder.svg?height=500&width=900&text=Featured"
                  alt="Featured Article"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h2 className="text-3xl font-bold mb-3 hover:text-red-600">
                <Link href="/articles/1">Thủ tướng chỉ đạo đẩy nhanh tiến độ các dự án trọng điểm quốc gia</Link>
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                Thủ tướng yêu cầu các bộ, ngành và địa phương tập trung nguồn lực, tháo gỡ khó khăn để đẩy nhanh tiến độ
                các dự án trọng điểm quốc gia, đặc biệt là các dự án hạ tầng giao thông.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Chính trị</span>
                <span className="mx-2">•</span>
                <span>2 giờ trước</span>
              </div>
            </div>

            {/* Latest News Grid */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Tin mới nhất</h3>
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
                          src={`/news-banner.png?height=200&width=300&text=News ${item}`}
                          alt={`News ${item}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h4 className="text-lg font-bold mb-2 hover:text-red-600">
                          <Link href="/articles/2">
                            Hội nghị về giải pháp phát triển kinh tế vùng đồng bằng sông Cửu Long
                          </Link>
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Các giải pháp thích ứng với biến đổi khí hậu và phát triển bền vững được thảo luận tại hội
                          nghị.
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium">Xã hội</span>
                          <span className="mx-2">•</span>
                          <span>4 giờ trước</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* More News */}
            <div>
              <h3 className="text-xl font-bold mb-6">Đáng chú ý</h3>

              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="font-medium text-red-600">Pháp luật</span>
                        <span className="mx-2">•</span>
                        <span>6 giờ trước</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2 hover:text-red-600">
                        <Link href="/articles/3">
                          Tòa án nhân dân tối cao tổ chức hội nghị tổng kết công tác năm 2023
                        </Link>
                      </h4>
                      <p className="text-gray-600">
                        Hội nghị đánh giá kết quả đạt được và đề ra phương hướng, nhiệm vụ trọng tâm cho năm 2024.
                      </p>
                    </div>
                    <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                      <img
                        src={`/news-banner.png?height=200&width=300&text=News ${item}`}
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
            {/* Most Read */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">Đọc nhiều nhất</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="text-2xl font-bold text-gray-300 shrink-0">{item}</div>
                      <div>
                        <h4 className="font-medium hover:text-red-600">
                          <Link href="/articles/4">Bộ Giáo dục công bố kế hoạch thi tốt nghiệp THPT năm 2024</Link>
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>8 giờ trước</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opinion */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">Góc nhìn</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                        <div>
                          <h5 className="font-medium">TS. Nguyễn Văn A</h5>
                          <p className="text-xs text-gray-500">Viện Nghiên cứu Chiến lược</p>
                        </div>
                      </div>
                      <h4 className="font-medium hover:text-red-600 mb-1">
                        <Link href="/articles/5">Giải pháp phát triển đô thị thông minh tại Việt Nam</Link>
                      </h4>
                      <p className="text-sm text-gray-600">
                        Các thành phố cần có chiến lược tổng thể và lộ trình cụ thể để xây dựng đô thị thông minh.
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Chủ đề nổi bật</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "COVID-19",
                    "Biến đổi khí hậu",
                    "Kinh tế số",
                    "Chuyển đổi số",
                    "Giáo dục",
                    "An ninh mạng",
                    "Giao thông công cộng",
                    "Phát triển bền vững",
                  ].map((tag, index) => (
                    <Link key={index} href="#" className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm">
                      {tag}
                    </Link>
                  ))}
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
