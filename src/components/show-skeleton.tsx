import { Skeleton } from "@/components/ui/skeleton"

interface ShowSkeletonProps {
  count?: number
  variant?: "with-title" | "without-title"
}

const ShowSkeleton = ({
  count = 8,
  variant = "with-title",
}: ShowSkeletonProps) => {
  return (
    <>
      {variant === "with-title" ? (
        <div className="no-scrollbar container w-full overflow-x-auto overflow-y-hidden">
          <Skeleton className="h-5 w-28 rounded bg-neutral-700" />
          <div className="mt-2.5 flex w-full items-center gap-1.5">
            {Array.from({ length: count }, (_, i) => (
              <Skeleton
                key={i}
                className="aspect-video min-w-[15rem] rounded bg-neutral-700"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="no-scrollbar container flex w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden">
          {Array.from({ length: count }, (_, i) => (
            <Skeleton
              key={i}
              className="aspect-video min-w-[15rem] rounded bg-neutral-700"
            />
          ))}
        </div>
      )}
    </>
  )
}

export default ShowSkeleton
