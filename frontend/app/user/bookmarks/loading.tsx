import { Skeleton } from "@/components/ui/skeleton"

export default function BookmarksLoading() {
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
              <div key={i} className="flex p-4">
                <Skeleton className="mr-4 w-[120px] h-[80px] rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-[300px]" />
                </div>
                <Skeleton className="ml-4 h-5 w-5" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
