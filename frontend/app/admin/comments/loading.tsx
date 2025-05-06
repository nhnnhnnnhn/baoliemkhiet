import { Skeleton } from "@/components/ui/skeleton"

export default function CommentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-md border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-[120px]" />
                    <Skeleton className="h-5 w-[80px]" />
                  </div>
                  <Skeleton className="mt-2 h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-[200px]" />
                  <Skeleton className="mt-1 h-3 w-[150px]" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-[40px]" />
                  <Skeleton className="h-6 w-[40px]" />
                  <Skeleton className="h-6 w-[40px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <Skeleton className="h-5 w-[200px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[60px]" />
            <Skeleton className="h-8 w-[60px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
