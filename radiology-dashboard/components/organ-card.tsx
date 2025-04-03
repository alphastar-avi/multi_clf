import Link from "next/link";
import { type IconType } from "react-icons";
import {
  GiBrain as Brain,        // Brain
  GiLungs as Lungs,        // Lungs
  GiHeartBeats as Heart,   // Heart
  GiLiver as Liver,        // Liver
  GiKidneys as Kidneys,     // Kidneys - corrected name from "Kidney" to "Kidneys"
} from "react-icons/gi";   // Gi = Game Icons

import { Bone as Spine } from "lucide-react"; // Lucide for Spine

import { cn } from "@/lib/utils";

interface OrganCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  className?: string;
}

// Map of organ names to their respective icons
const iconMap: Record<string, IconType> = {
  BRAIN: Brain,   
  LUNGS: Lungs,   
  HEART: Heart,   
  SPINE: Spine,  
  LIVER: Liver, 
  KIDNEYS: Kidneys, // corrected name from "KIDNEY" to "KIDNEYS"
};

export function OrganCard({ title, description, icon, href, className }: OrganCardProps) {
  const IconComponent = iconMap[icon.toUpperCase()] || Brain;

  return (
    <Link href={href} className="block">
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-white p-8 transition-all duration-500",
          "shadow-[8px_8px_16px_rgba(0,0,0,0.07),_-8px_-8px_16px_rgba(255,255,255,0.8),_inset_1px_1px_1px_rgba(255,255,255,0.8)]",
          "hover:shadow-[12px_12px_20px_rgba(0,0,0,0.1),_-12px_-12px_20px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.9)]",
          "hover:translate-y-[-5px]",
          "dark:bg-slate-800/90 dark:text-white",
          "dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),_-8px_-8px_16px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]",
          "dark:hover:shadow-[12px_12px_20px_rgba(0,0,0,0.4),_-12px_-12px_20px_rgba(30,41,59,0.6),_inset_1px_1px_1px_rgba(30,41,59,0.2)]",
          className
        )}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 dark:to-blue-900/10" />

        <div className="relative">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-white text-primary shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] transition-all duration-500 group-hover:shadow-[6px_6px_10px_rgba(0,0,0,0.08),_-6px_-6px_10px_rgba(255,255,255,1),_inset_1px_1px_1px_rgba(255,255,255,0.9)] dark:from-slate-700 dark:to-slate-800 dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)] dark:group-hover:shadow-[6px_6px_10px_rgba(0,0,0,0.3),_-6px_-6px_10px_rgba(30,41,59,0.6),_inset_1px_1px_1px_rgba(30,41,59,0.2)]">
            <IconComponent className="h-8 w-8" />
          </div>

          <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h3>
          <p className="mb-6 text-slate-600 dark:text-slate-400">{description}</p>

          <div className="flex items-center text-sm font-medium text-primary">
            <span>View models</span>
            <div className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
