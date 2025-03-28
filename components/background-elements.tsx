"use client"

import { useEffect, useRef } from "react"

export function BackgroundElements() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create neurons and connections
    const neurons: Neuron[] = []
    const numNeurons = Math.floor((window.innerWidth * window.innerHeight) / 40000)

    for (let i = 0; i < numNeurons; i++) {
      neurons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        connections: [],
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      })
    }

    // Create connections between neurons
    for (let i = 0; i < neurons.length; i++) {
      const neuron = neurons[i]
      for (let j = 0; j < neurons.length; j++) {
        if (i !== j) {
          const otherNeuron = neurons[j]
          const distance = Math.sqrt(Math.pow(neuron.x - otherNeuron.x, 2) + Math.pow(neuron.y - otherNeuron.y, 2))

          if (distance < 150) {
            neuron.connections.push({
              neuron: otherNeuron,
              opacity: 1 - distance / 150,
            })
          }
        }
      }
    }

    // Binary code elements
    const binaryElements: BinaryElement[] = []
    const numBinaryElements = 20

    for (let i = 0; i < numBinaryElements; i++) {
      binaryElements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        text: generateBinaryString(),
        opacity: Math.random() * 0.15 + 0.05,
        size: Math.floor(Math.random() * 12) + 8,
      })
    }

    function generateBinaryString() {
      let result = ""
      const length = Math.floor(Math.random() * 8) + 4
      for (let i = 0; i < length; i++) {
        result += Math.random() > 0.5 ? "1" : "0"
      }
      return result
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw binary elements
      binaryElements.forEach((element) => {
        ctx.font = `${element.size}px monospace`
        ctx.fillStyle = `rgba(0, 120, 255, ${element.opacity})`
        ctx.fillText(element.text, element.x, element.y)

        // Slowly move binary elements
        element.y += 0.2
        if (element.y > canvas.height) {
          element.y = 0
          element.x = Math.random() * canvas.width
          element.text = generateBinaryString()
        }
      })

      // Update neuron positions
      neurons.forEach((neuron) => {
        neuron.x += neuron.vx
        neuron.y += neuron.vy

        // Bounce off edges
        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1
      })

      // Draw connections
      neurons.forEach((neuron) => {
        neuron.connections.forEach((connection) => {
          const isDarkMode = document.documentElement.classList.contains("dark")
          ctx.strokeStyle = isDarkMode
            ? `rgba(100, 150, 255, ${connection.opacity * 0.2})`
            : `rgba(0, 100, 255, ${connection.opacity * 0.15})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(neuron.x, neuron.y)
          ctx.lineTo(connection.neuron.x, connection.neuron.y)
          ctx.stroke()
        })
      })

      // Draw neurons
      neurons.forEach((neuron) => {
        const isDarkMode = document.documentElement.classList.contains("dark")
        const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, neuron.radius)

        if (isDarkMode) {
          gradient.addColorStop(0, "rgba(100, 150, 255, 0.8)")
          gradient.addColorStop(1, "rgba(100, 150, 255, 0)")
        } else {
          gradient.addColorStop(0, "rgba(0, 100, 255, 0.6)")
          gradient.addColorStop(1, "rgba(0, 100, 255, 0)")
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.radius * 2, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 opacity-30" />
}

interface Neuron {
  x: number
  y: number
  radius: number
  connections: Connection[]
  vx: number
  vy: number
}

interface Connection {
  neuron: Neuron
  opacity: number
}

interface BinaryElement {
  x: number
  y: number
  text: string
  opacity: number
  size: number
}

