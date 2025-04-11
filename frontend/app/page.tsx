import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ChatbotButton } from "@/components/chatbot-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import styles from "./page.module.css"

export default function Home() {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className={styles.container}>
      <SiteHeader />

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Featured Article */}
        <div className={styles.featuredGrid}>
          <div>
            <h2 className={styles.featuredTitle}>Hội nghị thượng đỉnh ASEAN khai mạc tại Hà Nội</h2>
            <p className="text-gray-700 mb-4">
              Lãnh đạo các nước ASEAN tập trung tại Hà Nội để thảo luận về hợp tác kinh tế và an ninh khu vực trong bối
              cảnh nhiều thách thức toàn cầu.
            </p>
            <div className={styles.featuredImage}>
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="Hội nghị ASEAN"
                className="w-full h-full object-cover"
              />
            </div>
            <p className={styles.featuredImageCaption}>
              Lễ khai mạc Hội nghị Cấp cao ASEAN tại Hà Nội. Ảnh: Báo Liêm Khiết
            </p>
          </div>
          <div className={styles.sideStories}>
            <div>
              <h3 className={styles.sideStoryTitle}>Thị trường chứng khoán Việt Nam tăng điểm mạnh</h3>
              <p className="text-gray-700">
                VN-Index tăng hơn 15 điểm trong phiên giao dịch hôm nay nhờ dòng tiền đổ vào nhóm cổ phiếu ngân hàng và
                bất động sản.
              </p>
            </div>
            <div className={styles.sideStoryDivider}>
              <h3 className={styles.sideStoryTitle}>Nghiên cứu mới về lợi ích của chế độ ăn truyền thống Việt Nam</h3>
              <p className="text-gray-700">
                Các nhà khoa học phát hiện nhiều lợi ích sức khỏe từ chế độ ăn giàu rau xanh và ít chất béo bão hòa của
                người Việt.
              </p>
            </div>
            <div className={styles.sideStoryDivider}>
              <h3 className={styles.sideStoryTitle}>Công nghệ AI đang thay đổi ngành y tế Việt Nam</h3>
              <p className="text-gray-700">
                Các bệnh viện lớn tại Việt Nam đang ứng dụng trí tuệ nhân tạo trong chẩn đoán và điều trị, mang lại hiệu
                quả đáng kể.
              </p>
            </div>
          </div>
        </div>

        {/* Latest News Section */}
        <div className={styles.latestNewsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tin mới nhất</h2>
            <Button variant="ghost" className="text-sm flex items-center">
              Xem tất cả <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className={styles.newsGrid}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.newsCard}>
                <div className={styles.newsImage}>
                  <img
                    src={`/placeholder.svg?height=200&width=300&text=Tin ${item}`}
                    alt={`Tin ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={styles.newsTitle}>
                  <Link href="/articles/1">Phát hiện loài động vật quý hiếm tại Vườn Quốc gia Cát Tiên</Link>
                </h3>
                <p className="text-sm text-gray-700">
                  Các nhà khoa học đã ghi nhận sự xuất hiện của loài thú hiếm thuộc Sách Đỏ tại khu bảo tồn.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Opinion Section */}
        <div className={styles.opinionSection}>
          <div className={styles.opinionHeader}>
            <h2 className={styles.sectionTitle}>Góc nhìn</h2>
          </div>
          <div className={styles.opinionGrid}>
            <div>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Nguyễn Thị Minh</h3>
                  <p className={styles.authorTitle}>Chuyên gia Kinh tế</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>Tương lai của giao thông đô thị Việt Nam</h4>
              <p className="text-gray-700">
                Các thành phố lớn cần tái cấu trúc hệ thống giao thông để giải quyết vấn đề ùn tắc và ô nhiễm.
              </p>
            </div>
            <div>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Trần Văn Hùng</h3>
                  <p className={styles.authorTitle}>Biên tập viên Kinh tế</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>Cải tổ chuỗi cung ứng toàn cầu</h4>
              <p className="text-gray-700">
                Những biến động gần đây cho thấy sự cần thiết phải đa dạng hóa nguồn cung và giảm phụ thuộc.
              </p>
            </div>
            <div>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Lê Thị Hương</h3>
                  <p className={styles.authorTitle}>Phóng viên Khoa học</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>Đạo đức trong ứng dụng AI y tế</h4>
              <p className="text-gray-700">
                Cân bằng giữa đổi mới và bảo vệ quyền riêng tư khi trí tuệ nhân tạo ngày càng phổ biến trong y học.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton />
      </div>
    </div>
  )
}
