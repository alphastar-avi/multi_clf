import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ResultsGrid } from "@/components/results-grid"
import { ResultsSummary } from "@/components/results-summary"
import { BackgroundElements } from "@/components/background-elements"

interface ResultsPageProps {
  params: {
    organ: string
    model: string
  }
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { organ, model } = params

  const organName = organ.charAt(0).toUpperCase() + organ.slice(1)
  const modelName = model
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Sample results data - in a real app, this would come from an API
  const results = generateSampleResults(organ, model)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <BackgroundElements />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <BreadcrumbNav
          items={[
            { label: "Dashboard", href: "/" },
            { label: organName, href: `/models/${organ}` },
            { label: modelName, href: `/upload/${organ}/${model}` },
            { label: "Results", href: `/results/${organ}/${model}` },
          ]}
        />

        <div className="mb-12 mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            Analysis Results
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            The following frames have been flagged for potential abnormalities
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <ResultsSummary
              totalFrames={results.summary.totalFrames}
              flaggedFrames={results.summary.flaggedFrames}
              averageConfidence={results.summary.averageConfidence}
            />
          </div>
          <div className="lg:col-span-3">
            <ResultsGrid results={results.frames} />
          </div>
        </div>
      </div>
    </div>
  )
}

function generateSampleResults(organ: string, model: string) {
  // Generate sample results based on organ and model
  const totalFrames = 150
  const flaggedFrames = Math.floor(Math.random() * 20) + 5 // 5-25 flagged frames

  let condition = ""
  if (organ === "lungs" && model === "pneumonia-classification") {
    condition = "Pneumonia"
  } else if (organ === "lungs" && model === "covid-19-analysis") {
    condition = "COVID-19"
  } else if (organ === "lungs" && model === "nodule-detection") {
    condition = "Nodule"
  } else if (organ === "brain" && model === "tumor-detection") {
    condition = "Tumor"
  } else {
    condition = "Abnormality"
  }

  const frames = Array.from({ length: flaggedFrames }, (_, i) => {
    const frameId = Math.floor(Math.random() * totalFrames)
    const confidence = Math.floor(Math.random() * 30) + 70 // 70-99% confidence

    return {
      id: `Frame ${String(frameId).padStart(5, "0")}`,
      confidence,
      condition,
      thumbnail: `/placeholder.svg?height=200&width=200`,
    }
  })

  // Calculate average confidence
  const averageConfidence = Math.floor(frames.reduce((sum, frame) => sum + frame.confidence, 0) / frames.length)

  return {
    summary: {
      totalFrames,
      flaggedFrames: frames.length,
      averageConfidence,
    },
    frames,
  }
}

