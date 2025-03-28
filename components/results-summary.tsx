import { BarChart3, FileCheck, AlertCircle } from "lucide-react"

interface ResultsSummaryProps {
  totalFrames: number
  flaggedFrames: number
  averageConfidence: number
}

export function ResultsSummary({ totalFrames, flaggedFrames, averageConfidence }: ResultsSummaryProps) {
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
          <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-white text-amber-500 shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:from-slate-700 dark:to-slate-800 dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Flagged Frames</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{flaggedFrames}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-white text-primary shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:from-slate-700 dark:to-slate-800 dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Confidence</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{averageConfidence}%</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-inner dark:from-slate-700 dark:to-slate-800">
        <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">Recommendation</h3>
        <p className="text-slate-600 dark:text-slate-400">
          {flaggedFrames > 10
            ? "High number of flagged frames detected. Recommend immediate review by a specialist."
            : "Review flagged frames with a specialist for confirmation."}
        </p>
      </div>
    </div>
  )
}

