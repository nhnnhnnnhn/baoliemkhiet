import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ProfileLoading() {
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header Skeleton */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Cover Image Skeleton */}
          <Skeleton className="h-48 w-full" />

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar Skeleton */}
              <div className="relative -mt-20 md:-mt-24">
                <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white" />
              </div>

              {/* User Info Skeleton */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>

            {/* Bio and Stats Skeleton */}
            <div className="mt-6">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-4" />

              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-10 w-48 mb-6" />

        {/* Articles Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="md:w-1/3 h-48" />
                <div className="p-6 md:w-2/3">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
