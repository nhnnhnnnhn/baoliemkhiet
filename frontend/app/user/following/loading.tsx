import { Skeleton } from "@/components/ui/skeleton"

export default function FollowingLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[150px]" />
      </div>

      <div className="rounded-md border">
        <div className="divide-y">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-start p-4">
                <Skeleton className="h-16 w-16 rounded-full mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-[150px] mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
                <Skeleton className="h-8 w-[80px]" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
