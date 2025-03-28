"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ResultFrame {
  id: string
  confidence: number
  condition: string
  thumbnail: string
}

interface ResultsGridProps {
  results: ResultFrame[]
}

export function ResultsGrid({ results }: ResultsGridProps) {
  const [selectedFrame, setSelectedFrame] = useState<ResultFrame | null>(null)

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((frame, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-500 hover:translate-y-[-5px] dark:bg-slate-800/90"
              onClick={() => setSelectedFrame(frame)}
              style={{
                boxShadow:
                  "8px 8px 16px rgba(0,0,0,0.07), -8px -8px 16px rgba(255,255,255,0.8), inset 1px 1px 1px rgba(255,255,255,0.8)",
              }}
            >
              <div className="relative aspect-video w-full">
                <Image src={frame.thumbnail || "/placeholder.svg"} alt={frame.id} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">{frame.id}</span>
                    <Maximize2 className="h-5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="mt-1">
                    <span className="font-bold">{frame.confidence}% Confidence</span> - {frame.condition} Detected
                  </div>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl rounded-xl bg-white p-0 shadow-[12px_12px_24px_rgba(0,0,0,0.1),_-12px_-12px_24px_rgba(255,255,255,0.9)] dark:bg-slate-800 dark:shadow-[12px_12px_24px_rgba(0,0,0,0.4),_-12px_-12px_24px_rgba(30,41,59,0.6)]">
            {selectedFrame && (
              <div className="flex flex-col space-y-6 p-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                  <Image src={frame.thumbnail || "/placeholder.svg"} alt={frame.id} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{frame.id}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    <span className="font-bold">{frame.confidence}% Confidence</span> - {frame.condition} Detected
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 p-6 shadow-inner dark:bg-slate-700">
                  <h4 className="mb-3 text-xl font-medium text-slate-900 dark:text-slate-50">Analysis Details</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    This frame shows potential signs of {frame.condition.toLowerCase()} with a confidence score of{" "}
                    {frame.confidence}%. The AI model has identified specific patterns consistent with this condition.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}

