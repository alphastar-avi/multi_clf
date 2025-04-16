import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ModelCard } from "@/components/model-card"
import { BackgroundElements } from "@/components/background-elements"

interface ModelPageProps {
  params: {
    organ: string
  }
}

export default async function ModelSelectionPage({ params }: ModelPageProps) {
  const { organ } = await params
  const organName = organ.charAt(0).toUpperCase() + organ.slice(1)

  // Sample model data - in a real app, this would come from an API
  const models = getModelsForOrgan(organ)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <BackgroundElements />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <BreadcrumbNav
          items={[
            { label: "Dashboard", href: "/" },
            { label: organName, href: `/models/${organ}` },
          ]}
        />

        <div className="mb-12 mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            Select Model for {organName}
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Choose a specialized AI model for your {organName.toLowerCase()} analysis
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model, index) => (
            <ModelCard
              key={index}
              title={model.title}
              description={model.description}
              icon={model.icon}
              href={`/upload/${organ}/${model.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function getModelsForOrgan(organ: string) {
  const modelsByOrgan: Record<string, any[]> = {
    lungs: [
      {
        id: "pneumonia-classification",
        title: "Pneumonia Classification",
        description: "Detect pneumonia with high accuracy using CT scans",
        icon: "Lungs",
      },
    ],
    brain: [
      {
        id: "stroke-analysis",
        title: "Stroke Analysis",
        description: "Detect early signs of stroke from brain imaging",
        icon: "Activity",
      },
    ],
    spine: [
      {
        id: "fracture-detection",
        title: "Fracture Detection",
        description: "Identify spinal fractures and abnormalities",
        icon: "ActivitySquare",
      },
    ],
    kidneys: [
      {
        id: "stone-detection",
        title: "Stone Detection",
        description: "Identify kidney stones from CT scans",
        icon: "Kidney",
      },
    ],
  }

  return modelsByOrgan[organ] || []
}

