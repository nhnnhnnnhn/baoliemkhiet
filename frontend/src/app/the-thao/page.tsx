import Link from "next/link"
import { ArrowRightIcon, StarIcon, TrophyIcon, CalendarIcon, UserIcon, ChevronRightIcon, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteHeader } from "@/components/site-header"
import { CategoryHeader } from "@/components/category-header"

export default function TheThaoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <CategoryHeader
        title="Thể thao"
        description="Tin tức thể thao, bóng đá, tennis, bóng rổ và các sự kiện thể thao lớn trong nước và quốc tế"
        icon={<Activity className="h-6 w-6 text-white" />}
        color="bg-gradient-to-r from-red-800 to-red-600"
        textColor="text-red-600"
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/20 z-10"></div>
          <div className="relative h-[70vh] overflow-hidden">
            <img
              src="/placeholder.svg?height=800&width=1600&text=Hero Image"
              alt="Hero Image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <div className="flex items-center mb-4">
                  <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-sm mr-3">HOT</span>
                  <span className="text-sm opacity-80">12 giờ trước</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Ronaldo ghi bàn quyết định, Al Nassr tiến vào chung kết
                </h1>
                <p className="text-xl mb-6 opacity-90">
                  Cristiano Ronaldo đã có pha lập công quan trọng ở phút 89, giúp Al Nassr giành chiến thắng 2-1 trước
                  Al Hilal và tiến vào chung kết Saudi Pro League Cup.
                </p>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-medium">Nguyễn Văn A</p>
                    <p className="text-sm opacity-80">Phóng viên Bóng đá</p>
                  </div>
                </div>
                <Button className="bg-white text-red-600 hover:bg-gray-100">
                  Đọc tiếp <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Stories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3">Tin nổi bật</h2>
              <Link href="#" className="text-red-600 hover:text-red-700 flex items-center text-sm font-medium">
                Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="group">
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={`/placeholder.svg?height=300&width=500&text=Story ${item}`}
                      alt={`Story ${item}`}
                      className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {item === 1 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-xs font-bold">HOT</div>
                    )}
                  </div>
                  <div className="flex items-center text-sm mb-2">
                    <span className="font-bold text-red-600 mr-2">BÓNG ĐÁ</span>
                    <span className="text-gray-500">8 giờ trước</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">
                    {item === 1
                      ? "Messi lập hat-trick, Inter Miami thắng đậm"
                      : item === 2
                        ? "Man City đối mặt với án phạt nặng từ Premier League"
                        : "Liverpool bổ nhiệm HLV mới thay thế Jurgen Klopp"}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {item === 1
                      ? "Lionel Messi đã có màn trình diễn xuất sắc với 3 bàn thắng, giúp Inter Miami đánh bại đối thủ với tỷ số 5-0."
                      : item === 2
                        ? "Nhà đương kim vô địch Ngoại hạng Anh đang đối mặt với án phạt nặng sau khi bị cáo buộc vi phạm luật công bằng tài chính."
                        : "Sau khi Jurgen Klopp thông báo rời đi, Liverpool đã tìm được người kế nhiệm xứng đáng cho vị trí HLV trưởng."}
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-sm text-gray-500">Trần Văn B</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Scores */}
        <section className="py-10 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <TrophyIcon className="mr-2 h-6 w-6 text-yellow-400" />
                Kết quả trận đấu
              </h2>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Xem tất cả
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  league: "Premier League",
                  team1: "Arsenal",
                  score1: 3,
                  team2: "Tottenham",
                  score2: 1,
                  status: "Kết thúc",
                },
                {
                  league: "La Liga",
                  team1: "Barcelona",
                  score1: 2,
                  team2: "Real Madrid",
                  score2: 2,
                  status: "Kết thúc",
                },
                { league: "Serie A", team1: "Inter", score1: 1, team2: "Juventus", score2: 0, status: "Kết thúc" },
                {
                  league: "Bundesliga",
                  team1: "Bayern Munich",
                  score1: 4,
                  team2: "Dortmund",
                  score2: 2,
                  status: "Kết thúc",
                },
                { league: "Ligue 1", team1: "PSG", score1: 3, team2: "Marseille", score2: 0, status: "Kết thúc" },
                { league: "V-League", team1: "Hà Nội FC", score1: 2, team2: "HAGL", score2: 1, status: "Kết thúc" },
              ].map((match, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">{match.league}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{match.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <span className="font-medium">{match.team1}</span>
                    </div>
                    <span className="text-xl font-bold">{match.score1}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <span className="font-medium">{match.team2}</span>
                    </div>
                    <span className="text-xl font-bold">{match.score2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Football Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold border-l-4 border-red-600 pl-3">Bóng đá</h2>
                  <Link href="#" className="text-red-600 hover:text-red-700 flex items-center text-sm font-medium">
                    Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-4 group">
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=100&width=100&text=Football ${item}`}
                          alt={`Football Story ${item}`}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <div className="flex items-center text-xs mb-1">
                          <CalendarIcon className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="text-gray-500">6 giờ trước</span>
                        </div>
                        <h3 className="font-bold mb-1 group-hover:text-red-600 transition-colors">
                          Manchester City thắng áp đảo trước Newcastle với tỷ số 4-0
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <UserIcon className="h-3 w-3 mr-1" />
                          <span>Lê Văn C</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basketball Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold border-l-4 border-red-600 pl-3">Bóng rổ</h2>
                  <Link href="#" className="text-red-600 hover:text-red-700 flex items-center text-sm font-medium">
                    Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-4 group">
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=100&width=100&text=Basketball ${item}`}
                          alt={`Basketball Story ${item}`}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <div className="flex items-center text-xs mb-1">
                          <CalendarIcon className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="text-gray-500">4 giờ trước</span>
                        </div>
                        <h3 className="font-bold mb-1 group-hover:text-red-600 transition-colors">
                          Boston Celtics tiếp tục duy trì mạch thắng với chiến thắng thứ 8 liên tiếp
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <UserIcon className="h-3 w-3 mr-1" />
                          <span>Phạm Thị D</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Banner */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="flex items-center mb-3">
                  <StarIcon className="h-6 w-6 text-yellow-400 mr-2" />
                  <h2 className="text-2xl font-bold">Thể Thao Premium</h2>
                </div>
                <p className="text-gray-300 mb-6 max-w-2xl">
                  Truy cập vào các bài viết chuyên sâu, phân tích chuyên môn và nội dung độc quyền từ các phóng viên
                  hàng đầu của chúng tôi. Nâng cao trải nghiệm thể thao của bạn với những góc nhìn sâu sắc và độc đáo.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">Đăng ký ngay</Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                    Tìm hiểu thêm
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/3 lg:w-1/4">
                <img
                  src="/placeholder.svg?height=300&width=300&text=Premium"
                  alt="Premium Subscription"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton />
      </div>
    </div>
  )
}
