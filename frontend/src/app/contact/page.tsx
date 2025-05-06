import type { Metadata } from "next"
import { Mail, Phone, MapPin } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Liên hệ | Báo Liêm Khiết",
  description: "Liên hệ với Báo Liêm Khiết",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Liên hệ với chúng tôi</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
                  <CardDescription>
                    Điền thông tin của bạn và chúng tôi sẽ liên hệ lại trong thời gian sớm nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Họ và tên
                        </label>
                        <Input id="name" placeholder="Nhập họ và tên của bạn" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="email@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Tiêu đề
                      </label>
                      <Input id="subject" placeholder="Tiêu đề tin nhắn của bạn" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Nội dung
                      </label>
                      <Textarea id="message" placeholder="Nhập nội dung tin nhắn của bạn" rows={5} />
                    </div>
                    <Button type="submit" className="w-full">
                      Gửi tin nhắn
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin liên hệ</CardTitle>
                    <CardDescription>Liên hệ trực tiếp với chúng tôi qua các kênh sau</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Địa chỉ</h3>
                        <p className="text-gray-600">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Điện thoại</h3>
                        <p className="text-gray-600">(+84) 28 1234 5678</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">info@baolicmkhiet.vn</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Giờ làm việc</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Thứ Hai - Thứ Sáu:</span>
                        <span>8:00 - 17:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thứ Bảy:</span>
                        <span>8:00 - 12:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chủ Nhật:</span>
                        <span>Nghỉ</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
