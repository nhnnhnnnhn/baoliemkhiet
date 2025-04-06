import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">
            <img src="/logo.svg" alt="Báo Liêm Khiết" className="h-10" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Truy cập không giới hạn vào Báo Liêm Khiết
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Đọc tin tức chất lượng cao, phân tích chuyên sâu và nội dung độc quyền từ các nhà báo hàng đầu của chúng
              tôi.
            </p>
            <div className="bg-yellow-100 rounded-lg p-4 mb-8 inline-block">
              <p className="text-lg font-medium">Ưu đãi đặc biệt: Chỉ 25.000đ/tuần cho 1 năm đầu tiên</p>
            </div>
            <Link href="/subscribe/checkout">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 text-lg rounded">
                Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Lựa chọn gói đăng ký phù hợp với bạn</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Digital */}
            <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Digital</CardTitle>
                <CardDescription>Truy cập đầy đủ trên web và ứng dụng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold mb-1">
                    25.000đ<span className="text-sm font-normal">/tuần</span>
                  </p>
                  <p className="text-sm text-gray-500">Thanh toán hàng tháng</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Truy cập không giới hạn vào tất cả bài viết trên website và ứng dụng</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Ứng dụng Báo Liêm Khiết trên điện thoại và máy tính bảng</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Bản tin độc quyền gửi qua email</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/subscribe/checkout?plan=digital" className="w-full">
                  <Button className="w-full">Chọn gói này</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Digital + Print */}
            <Card className="border-2 border-blue-500 shadow-lg relative">
              <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm font-medium">
                Phổ biến nhất
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl font-serif">Digital + Print</CardTitle>
                <CardDescription>Trải nghiệm đọc báo toàn diện</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold mb-1">
                    45.000đ<span className="text-sm font-normal">/tuần</span>
                  </p>
                  <p className="text-sm text-gray-500">Thanh toán hàng tháng</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Tất cả quyền lợi của gói Digital</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Báo in hàng ngày được giao tận nhà</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Các ấn phẩm đặc biệt và tạp chí cuối tuần</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Ưu đãi độc quyền dành cho người đọc</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/subscribe/checkout?plan=digital-print" className="w-full">
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">Chọn gói này</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Premium</CardTitle>
                <CardDescription>Trải nghiệm cao cấp nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold mb-1">
                    65.000đ<span className="text-sm font-normal">/tuần</span>
                  </p>
                  <p className="text-sm text-gray-500">Thanh toán hàng tháng</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Tất cả quyền lợi của gói Digital + Print</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Truy cập vào các sự kiện độc quyền</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Tặng thêm 1 tài khoản Digital cho người thân</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Hỗ trợ khách hàng ưu tiên 24/7</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/subscribe/checkout?plan=premium" className="w-full">
                  <Button className="w-full">Chọn gói này</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Subscribe */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Tại sao nên đăng ký Báo Liêm Khiết?</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Báo chí chất lượng</h3>
              <p className="text-gray-600">
                Tin tức được kiểm chứng kỹ lưỡng từ các nhà báo chuyên nghiệp trên toàn cầu.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Phân tích chuyên sâu</h3>
              <p className="text-gray-600">
                Hiểu rõ hơn về các sự kiện quan trọng với góc nhìn sâu sắc từ các chuyên gia.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Trải nghiệm đa nền tảng</h3>
              <p className="text-gray-600">Đọc báo mọi lúc, mọi nơi trên máy tính, điện thoại và máy tính bảng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Độc giả nói gì về chúng tôi</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Nguyễn Văn A</h4>
                  <p className="text-sm text-gray-500">Độc giả từ 2018</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Báo Liêm Khiết đã trở thành nguồn thông tin đáng tin cậy của tôi. Tôi đặc biệt yêu thích các bài phân
                tích chuyên sâu về kinh tế và chính trị."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Trần Thị B</h4>
                  <p className="text-sm text-gray-500">Độc giả từ 2020</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Tôi đăng ký gói Digital + Print và rất hài lòng. Báo in mỗi sáng là thói quen không thể thiếu, còn ứng
                dụng thì tiện lợi khi di chuyển."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Câu hỏi thường gặp</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Tôi có thể hủy đăng ký bất cứ lúc nào không?</h3>
              <p className="text-gray-600">
                Có, bạn có thể hủy đăng ký bất cứ lúc nào. Chúng tôi sẽ hoàn lại số tiền tương ứng với thời gian còn lại
                của gói đăng ký.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Gói đăng ký bao gồm những gì?</h3>
              <p className="text-gray-600">
                Tùy thuộc vào gói bạn chọn, bạn sẽ có quyền truy cập vào tất cả nội dung trên website và ứng dụng, báo
                in hàng ngày, các ấn phẩm đặc biệt và nhiều quyền lợi khác.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Tôi có thể chia sẻ tài khoản với người khác không?</h3>
              <p className="text-gray-600">
                Mỗi tài khoản chỉ dành cho một người dùng. Tuy nhiên, với gói Premium, bạn được tặng thêm một tài khoản
                Digital cho người thân.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Làm thế nào để nhận hỗ trợ kỹ thuật?</h3>
              <p className="text-gray-600">
                Bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi qua email baoliemkhiet.project@gmail.com.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Sẵn sàng trải nghiệm Báo Liêm Khiết?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để không bỏ lỡ những tin tức quan trọng và phân tích chuyên sâu.
          </p>
          <Link href="/subscribe/checkout">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg rounded">
              Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              © {new Date().getFullYear()} Báo Liêm Khiết. Tất cả các quyền được bảo lưu.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Điều khoản sử dụng
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Chính sách bảo mật
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

