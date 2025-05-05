import { Skeleton } from "@/components/ui/skeleton"

export default function ConfigurationLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
      </div>

      <div className="rounded-md border">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
