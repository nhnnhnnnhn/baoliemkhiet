import Link from "next/link"
import { CheckCircle, Home } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>

        <h1 className="text-2xl font-bold mb-4">Đăng ký thành công!</h1>

        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã đăng ký The News Times. Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn với thông tin
          chi tiết về tài khoản.
        </p>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" /> Quay về trang chủ
            </Button>
          </Link>

          <p className="text-sm text-gray-500">
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua{" "}
            <Link href="#" className="text-blue-700 hover:underline">
              support@newstimes.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
