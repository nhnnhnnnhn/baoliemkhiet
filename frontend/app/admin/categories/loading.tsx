import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-[30px]" />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-[100px]" />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-[80px]" />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-[80px]" />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-[80px]" />
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">
                    <Skeleton className="h-5 w-[30px]" />
                  </td>
                  <td className="p-4 align-middle">
                    <Skeleton className="h-5 w-[120px]" />
                  </td>
                  <td className="p-4 align-middle">
                    <Skeleton className="h-5 w-[100px]" />
                  </td>
                  <td className="p-4 align-middle">
                    <Skeleton className="h-5 w-[40px]" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
