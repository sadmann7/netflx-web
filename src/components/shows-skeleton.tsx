import { motion } from "framer-motion"

import { itemFade, itemsReveal } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"

interface ShowsSkeletonProps {
  count?: number
  variant?: "with-title" | "without-title"
}

const ShowsSkeleton = ({
  count = 8,
  variant = "with-title",
}: ShowsSkeletonProps) => {
  return (
    <>
      {variant === "with-title" ? (
        <div className="no-scrollbar container mx-0 w-full overflow-x-auto overflow-y-hidden">
          <Skeleton className="h-[1.62rem] w-28 rounded bg-neutral-700" />
          <motion.div
            className="mt-2.5 flex w-full items-center gap-1.5"
            initial="hidden"
            animate="visible"
            variants={itemsReveal}
          >
            {Array.from({ length: count }, (_, i) => (
              <motion.div key={i} variants={itemFade}>
                <Skeleton className="aspect-video min-w-[15rem] rounded bg-neutral-700" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="no-scrollbar container mx-0 flex w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden"
          initial="hidden"
          animate="visible"
          variants={itemsReveal}
        >
          {Array.from({ length: count }, (_, i) => (
            <motion.div key={i} variants={itemFade}>
              <Skeleton className="aspect-video min-w-[15rem] rounded bg-neutral-700" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  )
}

export default ShowsSkeleton
