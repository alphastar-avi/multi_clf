import { OrganCard } from "@/components/organ-card"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { BackgroundElements } from "@/components/background-elements"

export default function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <BackgroundElements />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <BreadcrumbNav items={[{ label: "Dashboard", href: "/" }]} />

        <div className="mb-12 mt-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            Radioussy
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Select an anatomical region to begin your analysis
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <OrganCard
            title="Brain"
            description="CT/MRI Analysis for neurological assessment"
            icon="Brain"
            href="/models/brain"
          />
          <OrganCard
            title="Lungs"
            description="Screen for pneumonia, nodules, and other lung abnormalities"
            icon="Lungs"
            href="/models/lungs"
          />
          <OrganCard
            title="Spine"
            description="Spinal scans and fracture detection"
            icon="Spine"
            href="/models/spine"
          />
          <OrganCard
            title="Kidneys"
            description="CT/MRI screening for kidney issues"
            icon="Kidneys"
            href="/models/kidneys"
          />
        </div>
      </div>
    </div>
  )
}

