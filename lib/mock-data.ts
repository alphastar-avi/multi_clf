export function generateMockFrames(count = 10) {
  const conditions = ['Normal', 'Pneumonia', 'COVID-19', 'Tuberculosis'];
  const frames = [];
  
  for (let i = 0; i < count; i++) {
    const index = i;
    const filename = `frame_${String(index).padStart(5, '0')}.png`;
    const confidence = Math.random() * 0.5 + 0.5; // 0.5-1.0
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    
    frames.push({
      id: `Frame ${String(index).padStart(5, '0')}`,
      confidence,
      condition: conditions[conditionIndex],
      // Using placeholder images
      thumbnail: `https://placehold.co/300x300/gray/white?text=${filename}`,
      predictions: {
        'Normal': Math.random(),
        'Pneumonia': Math.random(),
        'COVID-19': Math.random(),
        'Tuberculosis': Math.random(),
      },
    });
  }
  
  return frames;
} 