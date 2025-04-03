"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Maximize2, AlertCircle, Check, X, ZoomIn, ZoomOut, Download, MousePointer } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import React from "react"

interface ResultFrame {
  id: string
  confidence: number
  condition: string
  thumbnail: string
  predictions?: Record<string, number>
}

interface ResultsGridProps {
  results: ResultFrame[]
}

export function ResultsGrid({ results }: ResultsGridProps) {
  const [selectedFrame, setSelectedFrame] = useState<ResultFrame | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")
  const [imageScale, setImageScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  
  // Create refs for scrollable containers
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const contentScrollRef = useRef<HTMLDivElement>(null)
  const tabContentRef = useRef<HTMLDivElement>(null)
  
  // Reset pan and scale when exiting zoom mode
  useEffect(() => {
    if (!zoomed) {
      setImageScale(1)
      setPanPosition({ x: 0, y: 0 })
    }
  }, [zoomed])

  const getConfidenceClass = (confidence: number) => {
    if (confidence >= 80) return "bg-red-500"
    if (confidence >= 60) return "bg-amber-500"
    return "bg-blue-500"
  }

  const getFrameBorderClass = (confidence: number) => {
    if (confidence >= 80) return "border-red-400"
    if (confidence >= 60) return "border-amber-400"
    return "border-blue-400"
  }
  
  const downloadImage = (imageUrl: string, filename: string) => {
    // Create a link to download the image
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomed && imageScale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (zoomed && isDragging && imageScale > 1) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      
      setPanPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }))
      
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  const handleZoomIn = () => {
    setImageScale(prev => Math.min(prev + 0.25, 3))
  }
  
  const handleZoomOut = () => {
    setImageScale(prev => Math.max(prev - 0.25, 1))
  }
  
  const handleZoomToggle = () => {
    if (zoomed) {
      setZoomed(false)
    } else {
      setZoomed(true)
      // Scroll to top when entering zoom mode
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTop = 0
      }
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((frame, index) => (
        <Dialog key={index} onOpenChange={(open) => {
          if (open) {
            setSelectedFrame(frame)
            setZoomed(false)
            setActiveTab("summary")
            setImageScale(1)
            setPanPosition({ x: 0, y: 0 })
          } else {
            // Reset state when closing dialog
            setZoomed(false)
            setImageScale(1)
            setPanPosition({ x: 0, y: 0 })
          }
        }}>
          <DialogTrigger asChild>
            <div
              className={`group relative cursor-pointer overflow-hidden rounded-xl bg-white border-2 ${getFrameBorderClass(frame.confidence)} transition-all duration-500 hover:translate-y-[-5px] dark:bg-slate-800/90`}
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
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className={`${getConfidenceClass(frame.confidence)} px-2 py-1`}>
                      {frame.confidence}% Confidence
                    </Badge>
                    <span className="font-semibold line-clamp-1">{frame.condition}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent 
            className={cn(
              "max-h-[90vh] rounded-xl bg-white p-0 shadow-[12px_12px_24px_rgba(0,0,0,0.1),_-12px_-12px_24px_rgba(255,255,255,0.9)] dark:bg-slate-800 dark:shadow-[12px_12px_24px_rgba(0,0,0,0.4),_-12px_-12px_24px_rgba(30,41,59,0.6)]",
              zoomed 
                ? "!max-w-[95vw] !max-h-[95vh] w-[95vw] h-[95vh] flex flex-col overflow-hidden" 
                : "max-w-6xl flex flex-col overflow-hidden"
            )}
          >
            {selectedFrame && (
              <div className="flex flex-col h-full">
                <DialogTitle className="sr-only">
                  {frame.id} Analysis
                </DialogTitle>
                
                <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 p-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                  <div className="flex items-center">
                    <Badge 
                      className={cn(
                        "mr-2",
                        getConfidenceClass(frame.confidence)
                      )}
                    >
                      {frame.confidence}%
                    </Badge>
                    <h3 className="text-lg font-bold truncate text-slate-900 dark:text-slate-50 mr-2">
                      {frame.id}
                    </h3>
                    <Badge variant="outline">{frame.condition}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {zoomed && imageScale > 1 && (
                      <div className="hidden sm:flex items-center gap-1 mr-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full"
                                onClick={handleZoomOut}
                              >
                                <ZoomOut className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Zoom Out
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <span className="text-xs text-slate-500">{Math.round(imageScale * 100)}%</span>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full"
                                onClick={handleZoomIn}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Zoom In
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full"
                                onClick={() => {
                                  setImageScale(1)
                                  setPanPosition({ x: 0, y: 0 })
                                }}
                              >
                                <MousePointer className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Reset View
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full"
                            onClick={handleZoomToggle}
                          >
                            {zoomed ? (
                              <ZoomOut className="h-4 w-4" />
                            ) : (
                              <ZoomIn className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {zoomed ? 'Exit Full View' : 'Enlarge Image'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => downloadImage(frame.thumbnail || "/placeholder.svg", `${frame.id.replace(/\s+/g, '-')}.png`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Download Image
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <DialogClose asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </DialogClose>
                  </div>
                </div>
                
                <div 
                  ref={contentScrollRef}
                  className={cn(
                    "flex-1",
                    zoomed 
                      ? "overflow-hidden flex items-center justify-center" 
                      : "overflow-auto"
                  )}
                >
                  <div
                    className={cn(
                      zoomed ? "h-full w-full" : "p-4 flex flex-col md:flex-row gap-6"
                    )}
                  >
                    <div 
                      ref={imageContainerRef}
                      className={cn(
                        zoomed 
                          ? "w-full h-full overflow-hidden flex items-center justify-center relative" 
                          : "md:w-1/2"
                      )}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={
                        zoomed && imageScale > 1 
                          ? { cursor: isDragging ? 'grabbing' : 'grab' } 
                          : undefined
                      }
                    >
                      <div 
                        className={cn(
                          "rounded-lg overflow-hidden shadow-lg",
                          zoomed ? "h-full flex items-center justify-center" : "sticky top-4"
                        )}
                      >
                        <div 
                          className={cn(
                            "relative",
                            zoomed ? "" : "aspect-video w-full"
                          )}
                          style={
                            zoomed
                              ? {
                                  transform: `scale(${imageScale}) translate(${panPosition.x/imageScale}px, ${panPosition.y/imageScale}px)`,
                                  transition: isDragging ? 'none' : 'transform 0.1s ease'
                                }
                              : undefined
                          }
                        >
                          <Image 
                            src={frame.thumbnail || "/placeholder.svg"} 
                            alt={frame.id}
                            fill={!zoomed}
                            width={zoomed ? 1920 : undefined}
                            height={zoomed ? 1080 : undefined}
                            className={cn(
                              zoomed
                                ? "max-h-[80vh] object-contain" 
                                : "object-cover"
                            )}
                            sizes={zoomed ? "90vw" : "(max-width: 768px) 100vw, 50vw"}
                            priority
                            draggable={false}
                          />
                        </div>
                        
                        {!zoomed && (
                          <div className="bg-slate-100 p-3 dark:bg-slate-700 flex justify-between items-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                              Click and drag to pan when zoomed
                            </div>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="text-xs"
                              onClick={handleZoomToggle}
                            >
                              <ZoomIn className="h-3 w-3 mr-2" />
                              View Fullscreen
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!zoomed && (
                      <div className="md:w-1/2">
                        <Tabs 
                          defaultValue="summary" 
                          value={activeTab}
                          onValueChange={setActiveTab}
                          className="w-full h-full flex flex-col"
                        >
                          <TabsList className="w-full grid grid-cols-2 mb-3">
                            <TabsTrigger value="summary">Analysis Summary</TabsTrigger>
                            <TabsTrigger value="details">Detailed Results</TabsTrigger>
                          </TabsList>
                          
                          <div 
                            ref={tabContentRef}
                            className="overflow-auto flex-1 pr-1 pb-4"
                          >
                            <TabsContent value="summary" className="mt-0 data-[state=active]:flex flex-col">
                              <div className="rounded-xl bg-slate-100 p-6 shadow-inner dark:bg-slate-700">
                                {frame.confidence >= 70 ? (
                                  <div className="flex gap-3">
                                    <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                      <AlertCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <h4 className="text-xl font-medium text-slate-900 dark:text-slate-50">High Probability Finding</h4>
                                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        This frame shows clear signs of {frame.condition.toLowerCase()} with a high confidence score of{" "}
                                        {frame.confidence}%. It is recommended to review this finding with a specialist.
                                      </p>
                                      
                                      <div className="mt-6 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
                                        <h5 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Key Indicators</h5>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                          <li>Distinctive patterns consistent with {frame.condition}</li>
                                          <li>Detection confidence above clinical threshold</li>
                                          <li>Potential areas requiring immediate attention</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-3">
                                    <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                      <Check className="h-5 w-5" />
                </div>
                <div>
                                      <h4 className="text-xl font-medium text-slate-900 dark:text-slate-50">Potential Finding</h4>
                                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        This frame shows some patterns that may indicate {frame.condition.toLowerCase()}, but with 
                                        a lower confidence score of {frame.confidence}%. Further review is suggested.
                                      </p>
                                      
                                      <div className="mt-6 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
                                        <h5 className="font-medium mb-2 text-slate-900 dark:text-slate-100">Considerations</h5>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                                          <li>Some indicators present but less definitive</li>
                                          <li>Confidence level below clinical action threshold</li>
                                          <li>Compare with other frames for context</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                </div>
                            </TabsContent>
                            
                            <TabsContent value="details" className="mt-0 data-[state=active]:flex flex-col">
                <div className="rounded-xl bg-slate-100 p-6 shadow-inner dark:bg-slate-700">
                                <h4 className="mb-4 text-xl font-medium text-slate-900 dark:text-slate-50">Classification Probabilities</h4>
                                
                                {frame.predictions ? (
                                  <div className="space-y-4">
                                    {Object.entries(frame.predictions).map(([className, probability]) => (
                                      <div key={className} className="space-y-1">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-slate-900 dark:text-slate-100">{className}</span>
                                          <span className="text-slate-600 dark:text-slate-400">
                                            {typeof probability === 'number' ? probability.toFixed(1) : probability}%
                                          </span>
                                        </div>
                                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                                          <div 
                                            className={`h-full ${className === frame.condition ? 'bg-blue-500' : 'bg-slate-400 dark:bg-slate-500'}`}
                                            style={{ width: `${typeof probability === 'number' ? Math.min(probability, 100) : 0}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                                    No detailed probability data available for this frame.
                                  </p>
                                )}
                                
                                <div className="mt-8">
                                  <h4 className="mb-3 text-lg font-medium text-slate-900 dark:text-slate-50">Technical Details</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
                                      <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Analysis Metadata</h5>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Frame ID: {frame.id}<br/>
                                        Confidence Score: {frame.confidence}%<br/>
                                        Primary Classification: {frame.condition}
                                      </p>
                                    </div>
                                    
                                    <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50">
                                      <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Information</h5>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Source: CT Scan Analysis<br/>
                                        Resolution: 224×224 px<br/>
                                        Processing: AI Enhanced
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-600">
                                  <p className="text-sm text-slate-500 dark:text-slate-500">
                                    The above analysis was performed using a trained deep learning model. Results should be 
                                    reviewed by a qualified medical professional.
                                  </p>
                                </div>
                              </div>
                            </TabsContent>
                          </div>
                        </Tabs>
                      </div>
                    )}
                  </div>
                </div>
                
                {zoomed && imageScale > 1 && (
                  <div className="sm:hidden sticky bottom-0 z-10 bg-white dark:bg-slate-800 p-2 border-t border-slate-200 dark:border-slate-700 flex justify-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="inline-flex items-center text-xs">
                      {Math.round(imageScale * 100)}%
                    </span>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImageScale(1)
                        setPanPosition({ x: 0, y: 0 })
                      }}
                    >
                      <MousePointer className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {zoomed && (
                  <div className="sticky bottom-0 z-10 bg-white dark:bg-slate-800 p-2 border-t border-slate-200 dark:border-slate-700 flex justify-center">
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={handleZoomToggle}
                    >
                      <ZoomOut className="h-4 w-4 mr-2" />
                      Exit Full View
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}

