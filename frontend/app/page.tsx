import Link from "next/link"
import { CalendarIcon, ChevronRightIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "./page.module.css"

export default function Home() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <div className={styles.topNavContainer}>
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <SearchIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              SECTIONS
            </Button>
          </div>
          <div className="hidden md:block">
            <Link href="/subscribe">
              <Button variant="ghost" size="sm">
                ĐĂNG KÝ GÓI PREMIUM CHỈ VỚI 5.000Đ/THÁNG
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                ĐĂNG NHẬP
              </Button>
            </Link>
            <Link href="/subscribe">
              <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                SUBSCRIBE
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className={styles.masthead}>
        <div className={styles.mastheadContainer}>
          <div className={styles.date}>
            <CalendarIcon className="h-3 w-3 mr-1" />
            {currentDate}
          </div>
          <div className="text-center">
            <h1 className={styles.title}>
              <img src="/logo.svg" alt="Báo Liêm Khiết" className="h-24 mx-auto" />
            </h1>
          </div>
          <div className="text-xs">Today's Paper</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={styles.mainNav}>
        <div className={styles.mainNavContainer}>
          <Link href="/thoi-su" className={styles.navLink}>
            Thời sự
          </Link>
          <Link href="/the-gioi" className={styles.navLink}>
            Thế giới
          </Link>
          <Link href="/kinh-doanh" className={styles.navLink}>
            Kinh doanh
          </Link>
          <Link href="/cong-nghe" className={styles.navLink}>
            Công nghệ
          </Link>
          <Link href="/the-thao" className={styles.navLink}>
            Thể thao
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Featured Article */}
        <div className={styles.featuredGrid}>
          <div>
            <h2 className={styles.featuredTitle}>Global Leaders Gather for Climate Summit as Temperatures Soar</h2>
            <p className="text-gray-700 mb-4">
              World leaders convene in Geneva to address urgent climate concerns amid record-breaking heat waves across
              continents.
            </p>
            <div className={styles.featuredImage}>
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="Climate Summit"
                className="w-full h-full object-cover"
              />
            </div>
            <p className={styles.featuredImageCaption}>
              Delegates arriving at the Geneva Climate Conference on Monday. Credit: Báo Liêm Khiết
            </p>
          </div>
          <div className={styles.sideStories}>
            <div>
              <h3 className={styles.sideStoryTitle}>Markets Rally as Fed Signals Potential Rate Cut</h3>
              <p className="text-gray-700">
                Investors respond positively to Federal Reserve's latest economic outlook suggesting easing inflation
                pressures.
              </p>
            </div>
            <div className={styles.sideStoryDivider}>
              <h3 className={styles.sideStoryTitle}>New Study Reveals Benefits of Mediterranean Diet</h3>
              <p className="text-gray-700">
                Research confirms significant health improvements for participants following traditional Mediterranean
                eating patterns.
              </p>
            </div>
            <div className={styles.sideStoryDivider}>
              <h3 className={styles.sideStoryTitle}>Tech Giants Face New Antitrust Regulations</h3>
              <p className="text-gray-700">
                Lawmakers propose comprehensive legislation aimed at curbing monopolistic practices in the technology
                sector.
              </p>
            </div>
          </div>
        </div>

        {/* Latest News Section */}
        <div className={styles.latestNewsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest News</h2>
            <Button variant="ghost" className="text-sm flex items-center">
              View All <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className={styles.newsGrid}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.newsCard}>
                <div className={styles.newsImage}>
                  <img
                    src={`/placeholder.svg?height=200&width=300&text=News ${item}`}
                    alt={`News ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={styles.newsTitle}>Scientists Discover New Species in Amazon Rainforest</h3>
                <p className="text-sm text-gray-700">
                  Expedition uncovers previously unknown flora and fauna in remote regions of the Amazon basin.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Opinion Section */}
        <div className={styles.opinionSection}>
          <div className={styles.opinionHeader}>
            <h2 className={styles.sectionTitle}>Opinion</h2>
          </div>
          <div className={styles.opinionGrid}>
            <div>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Jane Smith</h3>
                  <p className={styles.authorTitle}>Contributing Writer</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>The Future of Urban Transportation</h4>
              <p className="text-gray-700">
                Cities must reimagine mobility systems to address climate concerns and population growth.
              </p>
            </div>
            <div>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Robert Johnson</h3>
                  <p className={styles.authorTitle}>Economics Editor</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>Rethinking Global Supply Chains</h4>
              <p className="text-gray-700">
                Recent disruptions highlight vulnerabilities in our interconnected economic systems.
              </p>
            </div>
            <div>
              <div className={styles.authorBox}>
                <div className={styles.authorAvatar}></div>
                <div>
                  <h3 className={styles.authorName}>Maria Garcia</h3>
                  <p className={styles.authorTitle}>Science Correspondent</p>
                </div>
              </div>
              <h4 className={styles.opinionTitle}>The Ethics of AI in Healthcare</h4>
              <p className="text-gray-700">
                Balancing innovation with privacy concerns as artificial intelligence transforms medicine.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerHeader}>
            <h2 className={styles.footerTitle}>Báo Liêm Khiết</h2>
            <p className={styles.footerDescription}>
              Delivering trusted journalism and essential information to readers worldwide since 1851.
            </p>
          </div>
          <div className={styles.footerGrid}>
            <div>
              <h3 className={styles.footerSectionTitle}>News</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/" className={styles.footerLink}>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/thoi-su" className={styles.footerLink}>
                    Thời sự
                  </Link>
                </li>
                <li>
                  <Link href="/the-gioi" className={styles.footerLink}>
                    Thế giới
                  </Link>
                </li>
                <li>
                  <Link href="/kinh-doanh" className={styles.footerLink}>
                    Kinh doanh
                  </Link>
                </li>
                <li>
                  <Link href="/cong-nghe" className={styles.footerLink}>
                    Công nghệ
                  </Link>
                </li>
                <li>
                  <Link href="/the-thao" className={styles.footerLink}>
                    Thể thao
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={styles.footerSectionTitle}>Opinion</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Today's Opinion
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Columnists
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Editorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Guest Essays
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Letters
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={styles.footerSectionTitle}>Arts</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Movies
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Television
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Theater
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Music
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Dance
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={styles.footerSectionTitle}>Living</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Food
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Travel
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Style
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Health
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Real Estate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={styles.footerSectionTitle}>More</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Reader Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Wirecutter
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Cooking
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Games
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Audio
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={styles.footerSectionTitle}>Subscribe</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/subscribe" className={styles.footerLink}>
                    Home Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/subscribe" className={styles.footerLink}>
                    Digital Subscriptions
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Games
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Cooking
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Email Newsletters
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Báo Liêm Khiết. All Rights Reserved.</p>
            <div className={styles.footerBottomLinks}>
              <Link href="#" className="hover:text-gray-900">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-900">
                Cookie Policy
              </Link>
              <Link href="#" className="hover:text-gray-900">
                Sitemap
              </Link>
              <Link href="#" className="hover:text-gray-900">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotButton />
      </div>
    </div>
  )
}

function ChatbotButton() {
  return (
    <div className="relative group">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap">Trợ lý AI</div>
      </div>
    </div>
  )
}

