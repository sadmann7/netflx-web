import type { PropsWithChildren } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DynamicTooltipProps extends PropsWithChildren {
  text: string
}

const DynamicTooltip = ({ children, text }: DynamicTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="relative mb-2.5 rounded bg-slate-50 font-medium text-slate-950 shadow-2xl ">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default DynamicTooltip
