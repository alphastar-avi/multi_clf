"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UploadFormProps {
  organ: string
  model: string
}

export default function UploadForm({ organ, model }: UploadFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  // All your client-side logic with hooks goes here
  
  return (
    // Your component JSX
  )
} 