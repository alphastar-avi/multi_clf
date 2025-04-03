export default async function ModelSelectionPage({ params }: ModelPageProps) {
  const { organ } = params
  const organName = organ.charAt(0).toUpperCase() + organ.slice(1)
  
  // ... existing code ...
} 