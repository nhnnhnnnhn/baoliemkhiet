import type { Metadata } from "next"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | Báo Liêm Khiết",
  description: "Điều khoản sử dụng của Báo Liêm Khiết",
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Điều khoản sử dụng</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Cập nhật lần cuối: 07/05/2025</p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Chấp nhận điều khoản</h2>
              <p>
                Bằng cách truy cập hoặc sử dụng trang web Báo Liêm Khiết, bạn đồng ý tuân theo các điều khoản và điều
                kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, bạn không được phép truy cập
                hoặc sử dụng dịch vụ của chúng tôi.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. Thay đổi điều khoản</h2>
              <p>
                Chúng tôi có thể sửa đổi hoặc cập nhật các điều khoản này theo thời gian mà không cần thông báo trước.
                Việc bạn tiếp tục sử dụng trang web sau khi những thay đổi được đăng tải đồng nghĩa với việc bạn chấp
                nhận các điều khoản đã sửa đổi.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">3. Tài khoản người dùng</h2>
              <p>
                Khi bạn tạo tài khoản với chúng tôi, bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật. Bạn chịu
                trách nhiệm bảo mật tài khoản của mình, bao gồm mật khẩu, và cho tất cả hoạt động xảy ra dưới tài khoản
                của bạn. Bạn phải thông báo cho chúng tôi ngay lập tức về bất kỳ vi phạm bảo mật nào.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">4. Quyền sở hữu trí tuệ</h2>
              <p>
                Trang web và tất cả nội dung, tính năng và chức năng của nó (bao gồm nhưng không giới hạn ở tất cả thông
                tin, phần mềm, văn bản, hình ảnh, âm thanh, video) là tài sản của Báo Liêm Khiết và được bảo vệ bởi luật
                sở hữu trí tuệ Việt Nam và quốc tế.
              </p>
              <p>
                Bạn không được phép sao chép, phân phối, sửa đổi, hiển thị công khai, thực hiện công khai, tái xuất bản,
                tải xuống, lưu trữ hoặc truyền bất kỳ nội dung nào trên trang web của chúng tôi, trừ khi được cho phép
                rõ ràng bằng văn bản.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">5. Nội dung người dùng</h2>
              <p>
                Khi bạn đăng, tải lên, chia sẻ hoặc cung cấp nội dung trên trang web của chúng tôi, bạn cấp cho chúng
                tôi quyền không độc quyền, miễn phí, có thể chuyển nhượng, có thể cấp phép lại để sử dụng, sao chép, sửa
                đổi, phân phối, thực hiện và hiển thị nội dung đó trên trang web của chúng tôi.
              </p>
              <p>
                Bạn tuyên bố và đảm bảo rằng bạn sở hữu hoặc có quyền cần thiết đối với nội dung bạn đăng, và nội dung
                đó không vi phạm quyền của bất kỳ bên thứ ba nào.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">6. Hành vi bị cấm</h2>
              <p>Bạn không được sử dụng trang web của chúng tôi:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Theo bất kỳ cách nào vi phạm luật pháp hiện hành.</li>
                <li>
                  Để gửi, nhận, tải lên, tải xuống, sử dụng hoặc tái sử dụng bất kỳ tài liệu nào không tuân thủ tiêu
                  chuẩn nội dung của chúng tôi.
                </li>
                <li>
                  Để truyền tải hoặc mua bán tài liệu quảng cáo hoặc khuyến mãi không được yêu cầu hoặc trái phép.
                </li>
                <li>Để giả mạo hoặc cố gắng giả mạo danh tính của người khác.</li>
                <li>Để can thiệp vào hoạt động bình thường của trang web.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">7. Liên kết đến trang web khác</h2>
              <p>
                Trang web của chúng tôi có thể chứa liên kết đến các trang web của bên thứ ba. Chúng tôi không kiểm soát
                nội dung hoặc thực tiễn của các trang web này và không chịu trách nhiệm về nội dung, chính sách bảo mật
                hoặc thực tiễn của họ.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">8. Từ chối bảo đảm</h2>
              <p>
                Trang web của chúng tôi được cung cấp "nguyên trạng" và "như có sẵn", không có bất kỳ bảo đảm nào, dù rõ
                ràng hay ngụ ý. Chúng tôi không đảm bảo rằng trang web của chúng tôi sẽ luôn có sẵn, không bị gián đoạn,
                kịp thời, an toàn hoặc không có lỗi.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">9. Giới hạn trách nhiệm</h2>
              <p>
                Trong phạm vi tối đa được pháp luật cho phép, Báo Liêm Khiết sẽ không chịu trách nhiệm về bất kỳ thiệt
                hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng trang web của chúng tôi.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">10. Bồi thường</h2>
              <p>
                Bạn đồng ý bồi thường, bảo vệ và giữ cho Báo Liêm Khiết và các giám đốc, nhân viên, đại lý, nhà thầu,
                người cấp phép và nhà cung cấp của chúng tôi không bị tổn hại từ và chống lại mọi khiếu nại, trách
                nhiệm, thiệt hại, phán quyết, giải thưởng, tổn thất, chi phí, chi phí hoặc phí (bao gồm cả phí luật sư
                hợp lý) phát sinh từ hoặc liên quan đến việc bạn vi phạm các Điều khoản này.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">11. Luật áp dụng</h2>
              <p>
                Các điều khoản này sẽ được điều chỉnh và giải thích theo luật pháp Việt Nam, không tính đến các nguyên
                tắc xung đột pháp luật.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">12. Liên hệ</h2>
              <p>Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi qua:</p>
              <ul className="list-none mb-6">
                <li>Email: terms@baolicmkhiet.vn</li>
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
