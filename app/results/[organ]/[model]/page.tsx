import React, { useEffect, useState } from "react"
import { API_URL } from "@/lib/api"
import { generateMockFrames } from "@/lib/mock-data"

export default function ResultsPage({ params }: ResultsPageProps) {
  const unwrappedParams = React.use(params)
  const { organ, model } = unwrappedParams
  
  const [frames, setFrames] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Use mock data for testing if API request fails
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Your actual API call here
        // ...
      } catch (error) {
        console.error("API error, using mock data:", error)
        // Use mock data for testing UI
        setFrames(generateMockFrames(10))
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const frames = apiResponse.results.map((result, index) => {
    const predictedClass = result.class || "Unknown";
    const confidence = result.confidence || 0;
    const filename = `frame_${String(index).padStart(5, '0')}.png`;
    
    return {
      id: `Frame ${String(index).padStart(5, '0')}`,
      confidence,
      condition: predictedClass,
      thumbnail: `/frame_output/${filename}`,
      predictions: result.predictions || {},
    };
  });
} 