import type { ReactNode } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CategoryHeaderProps {
  title: string
  description: string
  icon: ReactNode
  color: string
  textColor: string
  tabs: { value: string; label: string }[]
  defaultTab?: string
}

export function CategoryHeader({
  title,
  description,
  icon,
  color,
  textColor,
  tabs,
  defaultTab = "all",
}: CategoryHeaderProps) {
  return (
    <>
      {/* Category Banner */}
      <div className={`${color} pt-24 pb-8`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm mb-4 text-white/80">
            <Link href="/" className="hover:text-white">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-white">{title}</span>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              <p className="text-white/80 mt-1 max-w-2xl">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <Tabs defaultValue={defaultTab} className="py-2">
            <TabsList className="bg-transparent h-auto p-0 w-full justify-start space-x-8 overflow-x-auto flex-nowrap">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:${textColor} data-[state=active]:border-${textColor.replace(
                    "text-",
                    "border-",
                  )} rounded-none pb-3 px-1`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </>
  )
}
