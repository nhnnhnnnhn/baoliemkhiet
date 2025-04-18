import Link from "next/link"
import { ChevronRightIcon, TrendingUp, DollarSign, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function KinhDoanhPage() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Category Header - Thiết kế mới */}
      <div className="category-header bg-white">
        <div className="category-header-content">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mr-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Kinh doanh</h1>
            <p className="category-description">
              Thông tin kinh tế, tài chính, chứng khoán, bất động sản và các xu hướng kinh doanh mới nhất
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="py-2">
            <TabsList className="bg-transparent h-auto p-0 w-full justify-start space-x-8 overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="all"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none pb-3 px-1"
              >
                Tất cả
              </TabsTrigger>
              <TabsTrigger
                value="doanh-nghiep"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none pb-3 px-1"
              >
                Doanh nghiệp
              </TabsTrigger>
              <TabsTrigger
                value="chung-khoan"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none pb-3 px-1"
              >
                Chứng khoán
              </TabsTrigger>
              <TabsTrigger
                value="bat-dong-san"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none pb-3 px-1"
              >
                Bất động sản
              </TabsTrigger>
              <TabsTrigger
                value="quoc-te"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none pb-3 px-1"
              >
                Quốc tế
              </TabsTrigger>
              <TabsTrigger
                value="tai-chinh"
                className="text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none pb-3 px-1"
              >
                Tài chính
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Thị trường chứng khoán</h2>
            <span className="text-sm text-gray-500">Cập nhật: 15:30</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">VN-Index</span>
                <span className="text-green-600 font-bold">1,245.67</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-sm">+12.45 (+1.01%)</span>
                <TrendingUp className="h-4 w-4 ml-1 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">HNX-Index</span>
                <span className="text-green-600 font-bold">234.56</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-sm">+2.34 (+1.01%)</span>
                <TrendingUp className="h-4 w-4 ml-1 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">USD/VND</span>
                <span className="text-red-600 font-bold">23,450</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-red-600 text-sm">-50 (-0.21%)</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Vàng SJC</span>
                <span className="text-green-600 font-bold">7,450,000</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-sm">+50,000 (+0.67%)</span>
                <TrendingUp className="h-4 w-4 ml-1 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Featured Article */}
            <div className="mb-12">
              <div className="relative aspect-[16/9] mb-4">
                <img
                  src="/placeholder.svg?height=500&width=900&text=Business"
                  alt="Featured Business Article"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h2 className="text-3xl font-playfair font-bold mb-3 hover:text-green-600">
                <Link href="/articles/12">Việt Nam đặt mục tiêu tăng trưởng GDP 6.5% trong năm 2024</Link>
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                Chính phủ đề ra nhiều giải pháp thúc đẩy tăng trưởng kinh tế, kiểm soát lạm phát và ổn định kinh tế vĩ
                mô trong bối cảnh kinh tế toàn cầu còn nhiều thách thức.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-green-600">Kinh tế vĩ mô</span>
                <span className="mx-2">•</span>
                <span>2 giờ trước</span>
              </div>
            </div>

            {/* Business News Grid */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Tin kinh doanh mới nhất</h3>
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
                          src={`/placeholder.svg?height=200&width=300&text=Business ${item}`}
                          alt={`Business News ${item}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h4 className="text-lg font-bold mb-2 hover:text-green-600">
                          <Link href="/articles/13">
                            Tập đoàn Vingroup công bố kế hoạch mở rộng đầu tư vào lĩnh vực công nghệ
                          </Link>
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Vingroup dự kiến đầu tư hàng tỷ USD vào các dự án công nghệ cao trong 5 năm tới.
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium text-green-600">Doanh nghiệp</span>
                          <span className="mx-2">•</span>
                          <span>4 giờ trước</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Estate Section */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-green-600 mr-3"></div>
                <h3 className="text-xl font-bold">Bất động sản</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3]">
                      <img
                        src={`/placeholder.svg?height=200&width=300&text=Real Estate ${item}`}
                        alt={`Real Estate ${item}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold mb-2 hover:text-green-600">
                        <Link href="/articles/14">
                          Thị trường bất động sản phía Nam dự báo phục hồi mạnh vào cuối năm
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Các chuyên gia nhận định thị trường sẽ sôi động trở lại nhờ các chính sách hỗ trợ mới.
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>6 giờ trước</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Stock Market */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Cổ phiếu nổi bật
                  </h3>
                  <Button variant="outline" size="sm" className="text-xs">
                    Xem thêm
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    { code: "VIC", price: "56.7", change: "+1.2", percent: "+2.16%", color: "text-green-600" },
                    { code: "VHM", price: "43.2", change: "+0.8", percent: "+1.89%", color: "text-green-600" },
                    { code: "FPT", price: "87.5", change: "+1.5", percent: "+1.74%", color: "text-green-600" },
                    { code: "MBB", price: "22.3", change: "-0.4", percent: "-1.76%", color: "text-red-600" },
                    { code: "VNM", price: "78.9", change: "+0.6", percent: "+0.77%", color: "text-green-600" },
                  ].map((stock, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <span className="font-bold">{stock.code}</span>
                        <p className="text-xs text-gray-500">HOSE</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{stock.price}</span>
                        <p className={`text-xs ${stock.color}`}>
                          {stock.change} ({stock.percent})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Currency Exchange */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Tỷ giá ngoại tệ
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    { code: "USD", name: "Đô la Mỹ", buy: "23,400", sell: "23,450" },
                    { code: "EUR", name: "Euro", buy: "25,600", sell: "25,900" },
                    { code: "JPY", name: "Yên Nhật", buy: "156", sell: "158" },
                    { code: "GBP", name: "Bảng Anh", buy: "29,800", sell: "30,200" },
                    { code: "CNY", name: "Nhân dân tệ", buy: "3,250", sell: "3,320" },
                  ].map((currency, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <span className="font-bold">{currency.code}</span>
                        <p className="text-xs text-gray-500">{currency.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex space-x-4">
                          <div>
                            <p className="text-xs text-gray-500">Mua</p>
                            <span>{currency.buy}</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Bán</p>
                            <span>{currency.sell}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
