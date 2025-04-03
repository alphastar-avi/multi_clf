import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import React from "react"
import Image from "next/image"

// ... keep the rest of the file the same ...

// Then find where VisuallyHidden is used and replace it with:
// <span className="sr-only">Your text here</span> 

<Image
  src={frame.thumbnail}
  alt={frame.condition}
  width={300}
  height={300}
  className="h-auto w-full rounded-md object-cover"
  unoptimized
/> 