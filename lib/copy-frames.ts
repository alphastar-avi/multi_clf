import fs from 'fs';
import path from 'path';

// Source directory
const sourceDir = 'D:/college/external/multi_clf-main/frame_output';
// Destination directory within your Next.js public folder
const destDir = path.join(process.cwd(), 'public/frames');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all frame images
const files = fs.readdirSync(sourceDir);
files.forEach(file => {
  if (file.endsWith('.png')) {
    fs.copyFileSync(
      path.join(sourceDir, file),
      path.join(destDir, file)
    );
  }
});

console.log(`Copied ${files.length} frame images to ${destDir}`); 