import { Skeleton } from "@/components/ui/skeleton"

export default function ArticleLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb skeleton */}
      <div className="mb-4">
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Article Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-3/4 mb-4" />

        {/* Social Share skeleton */}
        <div className="flex space-x-4 mb-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Article Content skeleton */}
      <div className="mb-10 space-y-6">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-10/12" />
      </div>

      {/* Author Info skeleton */}
      <div className="bg-gray-50 p-6 rounded-lg mb-10">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-8 w-40" />
          </div>
        </div>
      </div>

      <Skeleton className="h-px w-full my-10" />

      {/* Comments Section skeleton */}
      <div className="mb-12">
        <Skeleton className="h-8 w-48 mb-6" />

        {/* Comment Form skeleton */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Comments List skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-11/12 mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="h-px w-full my-10" />

      {/* Related Articles skeleton */}
      <div>
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-full mb-1" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
