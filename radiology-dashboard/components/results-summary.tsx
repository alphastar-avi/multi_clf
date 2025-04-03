import { BarChart3, FileCheck, AlertCircle, Check, Shell } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResultsSummaryProps {
  totalFrames: number
  flaggedFrames: number
  averageConfidence: number
  hasAbnormalities?: boolean
}

export function ResultsSummary({ 
  totalFrames, 
  flaggedFrames, 
  averageConfidence, 
  hasAbnormalities = flaggedFrames > 0
}: ResultsSummaryProps) {
  const getConfidenceColor = () => {
    if (averageConfidence >= 80) return "text-red-500 dark:text-red-400"
    if (averageConfidence >= 60) return "text-amber-500 dark:text-amber-400"
    return "text-blue-500"
  }

  const getFlaggedBgColor = () => {
    if (flaggedFrames > 10) return "from-red-50 to-white text-red-500 dark:from-red-950/30 dark:to-slate-800 dark:text-red-400"
    if (flaggedFrames > 0) return "from-amber-50 to-white text-amber-500 dark:from-amber-950/30 dark:to-slate-800 dark:text-amber-400"
    return "from-green-50 to-white text-green-500 dark:from-green-950/30 dark:to-slate-800 dark:text-green-400"
  }

  return (
    <div
      className="rounded-xl bg-white p-8 transition-all duration-500 dark:bg-slate-800/90"
      style={{
        boxShadow:
          "8px 8px 16px rgba(0,0,0,0.07), -8px -8px 16px rgba(255,255,255,0.8), inset 1px 1px 1px rgba(255,255,255,0.8)",
      }}
    >
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-50">Analysis Summary</h2>

      <div className="space-y-6">
        <div className="flex items-center">
          <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-white text-primary shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:from-slate-700 dark:to-slate-800 dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]">
            <FileCheck className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Frames</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalFrames}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className={cn(
            "mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]",
            getFlaggedBgColor()
          )}>
            {flaggedFrames > 0 ? (
              <AlertCircle className="h-7 w-7" />
            ) : (
              <Check className="h-7 w-7" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Flagged Frames</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {flaggedFrames > 0 ? flaggedFrames : "None"}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-white shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:from-slate-700 dark:to-slate-800 dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]">
            <BarChart3 className={cn("h-7 w-7", getConfidenceColor())} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Confidence</p>
            <p className={cn("text-2xl font-bold", getConfidenceColor())}>
              {averageConfidence}%
            </p>
          </div>
        </div>
      </div>

      <div className={cn(
        "mt-8 rounded-xl bg-gradient-to-br p-6 shadow-inner",
        hasAbnormalities 
          ? (averageConfidence >= 75 
            ? "from-red-50 to-white dark:from-red-950/30 dark:to-slate-800" 
            : "from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-800")
          : "from-green-50 to-white dark:from-green-950/30 dark:to-slate-800"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            hasAbnormalities 
              ? (averageConfidence >= 75 
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
                : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400")
              : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          )}>
            {hasAbnormalities ? <AlertCircle className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {hasAbnormalities 
                ? (averageConfidence >= 75 ? "Urgent Review Recommended" : "Specialist Review Suggested") 
                : "No Significant Findings"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {hasAbnormalities 
                ? (flaggedFrames > 10
                  ? "High number of abnormalities detected with strong confidence. Urgent specialist review is recommended."
                  : averageConfidence >= 75
                    ? "Abnormalities detected with high confidence. Specialist review is recommended."
                    : "Potential abnormalities detected. Consider review by a specialist.")
                : "No significant abnormalities were detected in this scan. Continue with standard follow-up protocol."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}