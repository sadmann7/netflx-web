import { Skeleton } from "@/components/ui/skeleton"

export default function ShowsLoading() {
  return (
    <div className="no-scrollbar container mx-0 w-full overflow-x-auto overflow-y-hidden pt-10">
      <Skeleton className="h-[1.62rem] w-28 rounded bg-neutral-700" />
    </div>
  )
}
