import type { Metadata } from "next"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Báo Liêm Khiết",
  description: "Chính sách bảo mật của Báo Liêm Khiết",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Chính sách bảo mật</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Cập nhật lần cuối: 07/05/2025</p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Giới thiệu</h2>
              <p>
                Báo Liêm Khiết ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật
                này mô tả cách chúng tôi thu thập, sử dụng và chia sẻ thông tin cá nhân của bạn khi bạn truy cập hoặc sử
                dụng trang web của chúng tôi.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. Thông tin chúng tôi thu thập</h2>
              <p>Chúng tôi thu thập các loại thông tin sau:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  Thông tin cá nhân: tên, địa chỉ email, số điện thoại, địa chỉ khi bạn đăng ký tài khoản hoặc đặt mua
                  dịch vụ.
                </li>
                <li>Thông tin sử dụng: cách bạn tương tác với trang web, thời gian truy cập, các trang bạn xem.</li>
                <li>Thông tin thiết bị: loại thiết bị, hệ điều hành, trình duyệt web bạn sử dụng.</li>
                <li>Thông tin vị trí: vị trí địa lý của bạn dựa trên địa chỉ IP hoặc GPS (nếu bạn cho phép).</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
              <p>Chúng tôi sử dụng thông tin thu thập được để:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi.</li>
                <li>Xử lý giao dịch và gửi thông báo liên quan đến tài khoản của bạn.</li>
                <li>
                  Gửi thông tin về các tính năng mới, khuyến mãi hoặc sự kiện (bạn có thể hủy đăng ký bất kỳ lúc nào).
                </li>
                <li>Phát hiện, ngăn chặn và giải quyết các vấn đề kỹ thuật hoặc bảo mật.</li>
                <li>Tuân thủ các nghĩa vụ pháp lý.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">4. Chia sẻ thông tin</h2>
              <p>Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Với các nhà cung cấp dịch vụ giúp chúng tôi vận hành trang web.</li>
                <li>Để tuân thủ luật pháp, quy định hoặc yêu cầu pháp lý.</li>
                <li>Để bảo vệ quyền, tài sản hoặc an toàn của chúng tôi, người dùng hoặc công chúng.</li>
                <li>Trong trường hợp sáp nhập, bán tài sản công ty hoặc tài trợ.</li>
                <li>Với sự đồng ý của bạn.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">5. Cookie và công nghệ tương tự</h2>
              <p>
                Chúng tôi sử dụng cookie và các công nghệ tương tự để thu thập thông tin về hoạt động duyệt web của bạn.
                Cookie là các tệp nhỏ được lưu trữ trên thiết bị của bạn. Bạn có thể cấu hình trình duyệt để từ chối tất
                cả cookie hoặc thông báo khi cookie được gửi, nhưng điều này có thể ảnh hưởng đến một số tính năng của
                trang web.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">6. Bảo mật dữ liệu</h2>
              <p>
                Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn. Tuy nhiên, không
                có phương thức truyền qua internet hoặc lưu trữ điện tử nào là an toàn 100%. Do đó, chúng tôi không thể
                đảm bảo an ninh tuyệt đối.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">7. Quyền của bạn</h2>
              <p>
                Tùy thuộc vào khu vực của bạn, bạn có thể có các quyền sau liên quan đến thông tin cá nhân của mình:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Quyền truy cập và nhận bản sao thông tin của bạn.</li>
                <li>Quyền sửa đổi hoặc cập nhật thông tin không chính xác.</li>
                <li>Quyền xóa thông tin trong một số trường hợp.</li>
                <li>Quyền hạn chế hoặc phản đối việc xử lý thông tin.</li>
                <li>Quyền rút lại sự đồng ý.</li>
                <li>Quyền khiếu nại với cơ quan bảo vệ dữ liệu.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">8. Thay đổi chính sách bảo mật</h2>
              <p>
                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về những
                thay đổi quan trọng bằng cách đăng thông báo trên trang web hoặc gửi email trực tiếp cho bạn.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">9. Liên hệ</h2>
              <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua:</p>
              <ul className="list-none mb-6">
                <li>Email: privacy@baolicmkhiet.vn</li>
                <li>Điện thoại: (+84) 28 1234 5678</li>
                <li>Địa chỉ: 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
