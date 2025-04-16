"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText, ImageIcon, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { uploadImage, uploadVideo } from "@/lib/api"
import { useParams } from "next/navigation"

interface FileUploaderProps {
  onUploadComplete: (response: any) => void
}

// Map URL parameters to model IDs
const MODEL_ID_MAP: Record<string, Record<string, string>> = {
  "lungs": {
    "pneumonia-classification": "lungs_pneu"
  },
  "brain": {
    "stroke-analysis": "brain_stroke"
  },
  "kidneys": {
    "stone-detection": "kidney_stone"
  },
  "spine": {
    "fracture-detection": "spine_fracture"
  }
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const params = useParams()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState("")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get the model ID based on URL parameters
  const getModelId = () => {
    const organ = params.organ as string
    const model = params.model as string
    
    if (!organ || !model) {
      throw new Error("Missing organ or model parameters")
    }

    // Try to find the model ID in the map
    const modelId = MODEL_ID_MAP[organ]?.[model]
    
    // If not found, try to find by partial match
    if (!modelId) {
      const organModels = MODEL_ID_MAP[organ]
      if (organModels) {
        const matchingKey = Object.keys(organModels).find(key => 
          model.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(model.toLowerCase())
        )
        if (matchingKey) {
          return organModels[matchingKey]
        }
      }
    }

    if (!modelId) {
      throw new Error(`Invalid organ/model combination: ${organ}/${model}`)
    }

    return modelId
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setFile(file)
    setError(null)

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleRunAnalysis = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    
    try {
      const modelId = getModelId()
      
      // Simulate progress during upload/processing
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5
          if (newProgress >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return newProgress
        })
      }, 300)

      let response
      
      if (file.type.startsWith("image/")) {
        setProcessingStatus("Processing image...")
        response = await uploadImage(file, modelId)
      } else if (file.type.startsWith("video/")) {
        setProcessingStatus("Extracting and analyzing frames...")
        response = await uploadVideo(file, modelId)
      } else {
        throw new Error("Unsupported file type")
      }

      // Complete the progress
      clearInterval(progressInterval)
      setProgress(100)
      setIsProcessing(false)
      
      // Call the callback with the response
      onUploadComplete(response)
    } catch (err) {
      setIsProcessing(false)
      setError(err instanceof Error ? err.message : "An error occurred during upload")
      console.error("Upload error:", err)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    setProgress(0)
    setIsProcessing(false)
    setProcessingStatus("")
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = () => {
    if (!file) return <Upload className="h-16 w-16 text-blue-400" />

    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-16 w-16 text-blue-500" />
    } else if (file.type.startsWith("video/")) {
      return <Film className="h-16 w-16 text-blue-500" />
    } else {
      return <FileText className="h-16 w-16 text-blue-500" />
    }
  }

  return (
    <div className="w-full">
      <div
        className={`relative flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-3 border-dashed p-8 transition-all duration-500 ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
            : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800/90"
        } ${
          file ? "border-blue-400" : ""
        } shadow-[8px_8px_16px_rgba(0,0,0,0.07),_-8px_-8px_16px_rgba(255,255,255,0.8),_inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),_-8px_-8px_16px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-blue-50/30 dark:to-blue-900/10" />

        <div className="relative z-10">
          {file && !isProcessing && (
            <button
              onClick={handleRemoveFile}
              className="absolute right-0 top-0 rounded-full bg-slate-200 p-2 text-slate-600 shadow-md transition-all duration-300 hover:bg-slate-300 hover:shadow-lg dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] dark:bg-slate-700 dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)]">
              {getFileIcon()}
            </div>

            {!file && (
              <>
                <p className="text-center text-lg font-medium text-slate-700 dark:text-slate-300">
                  Drag & Drop your file here or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white px-6 py-6 text-base shadow-[4px_4px_8px_rgba(0,0,0,0.05),_-4px_-4px_8px_rgba(255,255,255,0.9),_inset_1px_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300 hover:shadow-[6px_6px_10px_rgba(0,0,0,0.08),_-6px_-6px_10px_rgba(255,255,255,1),_inset_1px_1px_1px_rgba(255,255,255,0.9)] dark:bg-slate-800 dark:shadow-[4px_4px_8px_rgba(0,0,0,0.2),_-4px_-4px_8px_rgba(30,41,59,0.5),_inset_1px_1px_1px_rgba(30,41,59,0.2)] dark:hover:shadow-[6px_6px_10px_rgba(0,0,0,0.3),_-6px_-6px_10px_rgba(30,41,59,0.6),_inset_1px_1px_1px_rgba(30,41,59,0.2)]"
                >
                  Browse Files
                </Button>
              </>
            )}

            {file && !isProcessing && (
              <>
                <p className="text-center text-lg font-medium text-slate-900 dark:text-slate-50">{file.name}</p>
                <p className="text-center text-slate-600 dark:text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>

                {preview && (
                  <div className="mt-6 max-h-[250px] max-w-full overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-[250px] max-w-full object-contain"
                    />
                  </div>
                )}

                <Button
                  onClick={handleRunAnalysis}
                  className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-base font-medium shadow-[0_4px_12px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)] dark:shadow-[0_4px_12px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_6px_16px_rgba(59,130,246,0.3)]"
                >
                  Run Analysis
                </Button>
              </>
            )}

            {isProcessing && (
              <div className="w-full space-y-4">
                <p className="text-center text-lg font-medium text-slate-900 dark:text-slate-50">{processingStatus}</p>
                <Progress
                  value={progress}
                  className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                />
              </div>
            )}

            {error && (
              <div className="w-full rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                <p className="font-medium">Error: {error}</p>
              </div>
            )}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/png,image/jpeg,image/dicom,video/mp4"
          className="hidden"
        />
      </div>
    </div>
  )
}

