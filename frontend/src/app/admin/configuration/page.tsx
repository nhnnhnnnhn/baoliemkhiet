import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cấu hình hệ thống | Báo Liêm Khiết",
  description: "Quản lý cấu hình hệ thống Báo Liêm Khiết",
}

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cấu hình hệ thống</h2>
      </div>

      <div className="rounded-md border">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="facebook" className="text-sm font-medium">
                Facebook
              </label>
              <input
                id="facebook"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="https://facebook.com/baoliem"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="zalo" className="text-sm font-medium">
                Zalo
              </label>
              <input
                id="zalo"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="https://zalo.me/baoliem"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="hotline" className="text-sm font-medium">
                Hotline
              </label>
              <input id="hotline" type="text" className="w-full p-2 border rounded-md" placeholder="0123456789" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="contact@baoliem.vn"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium">
                Địa chỉ
              </label>
              <input
                id="address"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="aboutUs" className="text-sm font-medium">
                Giới thiệu
              </label>
              <textarea
                id="aboutUs"
                className="w-full p-2 border rounded-md min-h-[150px]"
                placeholder="Giới thiệu về Báo Liêm Khiết..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>
  )
}
