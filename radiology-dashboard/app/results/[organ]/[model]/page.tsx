"use client"
import { useEffect, useState, useRef } from "react"
import React from "react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ResultsGrid } from "@/components/results-grid"
import { ResultsSummary } from "@/components/results-summary"
import { BackgroundElements } from "@/components/background-elements"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, FileBarChart, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { API_URL } from "@/lib/api"

interface ResultsPageProps {
  params: {
    organ: string
    model: string
  }
}

// Define the shape of our results data structure
interface ResultsData {
  summary: {
    totalFrames: number;
    flaggedFrames: number;
    averageConfidence: number;
    hasAbnormalities: boolean;
  };
  frames: Array<{
    id: string;
    confidence: number;
    condition: string;
    thumbnail: string;
    predictions?: Record<string, number>; // Additional class probabilities
  }>;
  rawData: any; // Store the original API response for debugging/export
}

export default function ResultsPage({ params }: ResultsPageProps) {
  // Unwrap params with React.use()
  const unwrappedParams = React.use(params);
  const { organ, model } = unwrappedParams;
  const [results, setResults] = useState<ResultsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugMode, setDebugMode] = useState(false)

  const organName = organ.charAt(0).toUpperCase() + organ.slice(1)
  const modelName = model
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  useEffect(() => {
    try {
      // Retrieve results from localStorage
      const storedResults = localStorage.getItem('analysisResults')
      
      if (storedResults) {
        // Parse the stored results
        const apiResponse = JSON.parse(storedResults)
        console.log("API Response:", apiResponse) // Debug log
        
        // Format API response into the format our components expect
        let formattedResults: ResultsData;
        
        if (apiResponse.results) {
          // Handle video response - has multiple frames
          const positiveThreshold = 60; // Consider frames with confidence > 60% as positive
          const frames = apiResponse.results
            .filter((result: any) => result && !result.error) // Filter out error responses
            .map((result: any, index: number) => {
              const confidence = result.confidence || 0;
              let predictedClass = result.predicted_class || 'Unknown';
              let filename = result.filename || `frame_${index}.png`;
              
              // Handle potential different data structures
              if (typeof result === 'object' && !predictedClass && result.prediction) {
                predictedClass = result.prediction;
              }
              
              return {
                id: `Frame ${String(index).padStart(5, '0')}`,
                confidence,
                condition: predictedClass,
                thumbnail: `${API_URL}/frames/${filename}`,
                predictions: result.predictions || {},
              };
            });
          
          // Filter frames that have significant findings
          const significantFrames = frames.filter((frame: any) => frame.confidence >= positiveThreshold);
          
          const averageConfidence = significantFrames.length > 0 
            ? Math.floor(significantFrames.reduce((sum: number, frame: any) => sum + frame.confidence, 0) / significantFrames.length) 
            : 0;
          
          formattedResults = {
            summary: {
              totalFrames: frames.length,
              flaggedFrames: significantFrames.length,
              averageConfidence,
              hasAbnormalities: significantFrames.length > 0
            },
            frames: significantFrames.length > 0 ? significantFrames : frames.slice(0, 10), // If no significant frames, show first 10
            rawData: apiResponse
          };
        } else {
          // Handle single image response
          let condition = apiResponse.predicted_class || 'Unknown';
          let confidence = apiResponse.confidence || 0;
          
          // Determine if there's an abnormality based on class and confidence
          const hasAbnormality = condition.toLowerCase() !== 'normal' && 
                                 condition.toLowerCase() !== 'negative' && 
                                 confidence > 50;
          
          formattedResults = {
            summary: {
              totalFrames: 1,
              flaggedFrames: hasAbnormality ? 1 : 0,
              averageConfidence: confidence,
              hasAbnormalities: hasAbnormality
            },
            frames: [{
              id: 'Image Analysis',
              confidence,
              condition,
              thumbnail: `${API_URL}/image_uploads/${apiResponse.filename || 'image.png'}`,
              predictions: apiResponse.predictions || {}
            }],
            rawData: apiResponse
          };
        }
        
        setResults(formattedResults)
      } else {
        // If no results in localStorage, use sample data
        setResults(generateSampleResults(organ, model))
        console.warn('No analysis results found in localStorage, using sample data')
      }
    } catch (err) {
      console.error('Error loading results:', err)
      setError('Failed to load analysis results')
      setResults(generateSampleResults(organ, model)) // Fallback to sample data
    } finally {
      setLoading(false)
    }
  }, [organ, model])

  const exportResults = () => {
    if (results) {
      const dataStr = JSON.stringify(results.rawData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `${organName}-${modelName}-results.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      linkElement.remove();
    }
  };

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

        <div className="mb-8 mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
            Analysis Results
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              {results && results.summary.hasAbnormalities 
                ? `Potential ${modelName.toLowerCase()} detected with ${results.summary.averageConfidence}% confidence`
                : "No significant abnormalities detected"}
          </p>
        </div>

          {results && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDebugMode(!debugMode)}
                className="flex items-center gap-2"
              >
                <FileBarChart className="h-4 w-4" />
                {debugMode ? "Hide Raw Data" : "Show Raw Data"}
              </Button>
              <Button 
                variant="secondary"
                onClick={exportResults}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Results
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : results ? (
          <>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <ResultsSummary
              totalFrames={results.summary.totalFrames}
              flaggedFrames={results.summary.flaggedFrames}
              averageConfidence={results.summary.averageConfidence}
                  hasAbnormalities={results.summary.hasAbnormalities}
                />
                
                {/* Classification probabilities for single image analysis */}
                {results.frames.length === 1 && results.frames[0].predictions && (
                  <Card className="mt-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Classification Probabilities</CardTitle>
                      <CardDescription>Full breakdown of predictions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {Object.entries(results.frames[0].predictions).map(([className, probability]) => (
                        <div key={className} className="mb-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{className}</span>
                            <span>{typeof probability === 'number' ? probability.toFixed(1) : probability}%</span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div 
                              className="h-full rounded-full bg-blue-500" 
                              style={{ width: `${typeof probability === 'number' ? Math.min(probability, 100) : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
          </div>
          <div className="lg:col-span-3">
                {results.frames.length > 0 ? (
            <ResultsGrid results={results.frames} />
                ) : (
                  <div className="rounded-lg bg-white p-8 text-center dark:bg-slate-800">
                    <p className="text-lg font-medium">No abnormalities detected</p>
                  </div>
                )}
          </div>
        </div>

            {/* Debug view for raw data */}
            {debugMode && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Raw API Response</CardTitle>
                  <CardDescription>For debugging and development purposes</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-[400px] overflow-auto rounded-lg bg-slate-100 p-4 text-xs dark:bg-slate-800">
                    {JSON.stringify(results.rawData, null, 2)}
                  </pre>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-slate-500">The raw data from the API response</p>
                </CardFooter>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

// Fallback function to generate sample results if needed
function generateSampleResults(organ: string, model: string): ResultsData {
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

    // Sample predictions for demo
    const predictions: Record<string, number> = {
      [condition]: confidence,
      "Normal": 100 - confidence,
    };

    return {
      id: `Frame ${String(frameId).padStart(5, "0")}`,
      confidence,
      condition,
      thumbnail: `/placeholder.svg?height=200&width=200`,
      predictions
    }
  })

  // Calculate average confidence
  const averageConfidence = Math.floor(frames.reduce((sum, frame) => sum + frame.confidence, 0) / frames.length)

  return {
    summary: {
      totalFrames,
      flaggedFrames: frames.length,
      averageConfidence,
      hasAbnormalities: frames.length > 0
    },
    frames,
    rawData: {
      organ,
      model,
      results: frames.map(frame => ({
        id: frame.id,
        confidence: frame.confidence,
        predicted_class: frame.condition,
        predictions: frame.predictions
      }))
    }
  }
}

