export default async function UploadPage({ params }: UploadPageProps) {
  const { organ, model } = params
  
  // IMPORTANT: If you're using useRouter, useState, or other React hooks
  // then you need to split this into a client component and server component
  // as hooks can't be used in async server components
  
  // ... existing code ...
} 