import Link from "next/link"
import {
  Brain,
  TreesIcon as Lungs,
  Heart,
  ActivitySquare,
  Droplets,
  BabyIcon as Kidney,
  Target,
  Activity,
  CircleDot,
  Scan,
  WormIcon as Virus,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModelCardProps {
  title: string
  description: string
  icon: string
  href: string
  className?: string
}

export function ModelCard({ title, description, icon, href, className }: ModelCardProps) {
  // Map of icon names to Lucide components
  const iconMap: Record<string, LucideIcon> = {
    Brain,
    Lungs,
    Heart,
    Spine: ActivitySquare,
    Liver: Droplets,
    Kidneys: Kidney,
    Target,
    Activity,
    CircleDot,
    Scan,
    Virus,
  }

  const IconComponent = iconMap[icon] || Target

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white p-8 transition-all duration-500",
        // Enhanced neomorphic styling
        "shadow-[8px_8px_16px_rgba(0,0,0,0.07),_-8px_-8px_16px_rgba(255,255,255,0.8),_inset_1px_1px_1px_rgba(255,255,255,0.8)]",
        "hover:shadow-[12px_12px_20px_rgba(0,0,0,0.1),_-12px_-12px_20px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.9)]",
        "hover:translate-y-[-5px]",
        // Dark mode
        "dark:bg-slate-800/90 dark:text-white",
        "dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),_-8px_-8px_16px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]",
        "dark:hover:shadow-[12px_12px_20px_rgba(0,0,0,0.4),_-12px_-12px_20px_rgba(30,41,59,0.6),_inset_1px_1px_1px_rgba(30,41,59,0.2)]",
        className,
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 dark:to-blue-900/10" />

      <div className="relative">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-white text-primary shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] transition-all duration-500 hover:shadow-[6px_6px_10px_rgba(0,0,0,0.08),_-6px_-6px_10px_rgba(255,255,255,1),_inset_1px_1px_1px_rgba(255,255,255,0.9)] dark:from-slate-700 dark:to-slate-800 dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)] dark:hover:shadow-[6px_6px_10px_rgba(0,0,0,0.3),_-6px_-6px_10px_rgba(30,41,59,0.6),_inset_1px_1px_1px_rgba(30,41,59,0.2)]">
          <IconComponent className="h-8 w-8" />
        </div>

        <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h3>
        <p className="mb-8 text-slate-600 dark:text-slate-400">{description}</p>

        <Link href={href}>
          <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-base font-medium shadow-[0_4px_12px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)] dark:shadow-[0_4px_12px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_6px_16px_rgba(59,130,246,0.3)]">
            Select Model
          </Button>
        </Link>
      </div>
    </div>
  )
}

