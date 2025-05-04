import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TagsLoading() {
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />

        {/* Search Skeleton */}
        <Skeleton className="h-10 w-full max-w-md mb-8" />

        {/* Alphabet Navigation Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Array(26)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 rounded-full" />
            ))}
        </div>

        {/* Tags by Letter Skeleton */}
        <div className="space-y-8">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i}>
                <Skeleton className="h-8 w-16 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(9)
                    .fill(0)
                    .map((_, j) => (
                      <Skeleton key={j} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
