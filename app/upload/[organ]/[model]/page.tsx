"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { FileUploader } from "@/components/file-uploader"
import { BackgroundElements } from "@/components/background-elements"

interface UploadPageProps {
  params: Promise<{
    organ: string
    model: string
  }>
}

export default function UploadPage({ params }: UploadPageProps) {
  const router = useRouter()
  const { organ, model } = use(params)

  const organName = organ.charAt(0).toUpperCase() + organ.slice(1)
  const modelName = model
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <BackgroundElements />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <BreadcrumbNav
          items={[
            { label: "Dashboard", href: "/" },
            { label: organName, href: `/models/${organ}` },
            { label: modelName, href: `/upload/${organ}/${model}` },
          ]}
        />

        <div className="mb-12 mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            Upload Image/Video for Analysis
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Please upload a CT/MRI scan (image or video) for {modelName.toLowerCase()} analysis
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <FileUploader
            onUploadComplete={(file) => {
              // In a real app, this would process the file
              console.log("File uploaded:", file)
              // Use router.push instead of window.location.href
              router.push(`/results/${organ}/${model}`)
            }}
          />

          <div className="mt-8 rounded-xl bg-white p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.07),_-8px_-8px_16px_rgba(255,255,255,0.8),_inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:bg-slate-800/90 dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),_-8px_-8px_16px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]">
            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-50">Supported Formats</h3>
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-medium">Images:</span> PNG, JPEG, DICOM
              <br />
              <span className="font-medium">Videos:</span> MP4 (h264 codec recommended for CT/MRI videos)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

