import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-5 w-[120px]" />
      </div>

      <div className="rounded-md border">
        <div className="divide-y">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-start p-4">
                <Skeleton className="h-5 w-5 mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-[120px]" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
