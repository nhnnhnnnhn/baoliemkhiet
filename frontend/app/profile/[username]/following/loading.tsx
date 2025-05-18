import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function FollowingLoading() {
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Skeleton */}
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 mr-4" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Search Skeleton */}
        <Skeleton className="h-10 w-full mb-6" />

        {/* Following List Skeleton */}
        <div className="space-y-4">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8 flex justify-center">
          <Skeleton className="h-9 w-9 mx-1" />
          <Skeleton className="h-9 w-9 mx-1" />
          <Skeleton className="h-9 w-9 mx-1" />
          <Skeleton className="h-9 w-9 mx-1" />
          <Skeleton className="h-9 w-9 mx-1" />
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
