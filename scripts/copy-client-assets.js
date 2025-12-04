import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root (parent of scripts directory)
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, '.nuxt/dist/client');
// Copy to .output/public/_nuxt for preview mode
const destDir = path.join(projectRoot, '.output/public/_nuxt');

function copyRecursive(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Check if source exists
if (fs.existsSync(srcDir)) {
  try {
    copyRecursive(srcDir, destDir);
    console.log('✓ Client assets copied to .output/public/_nuxt');
  } catch (error) {
    console.error('✗ Error copying client assets:', error.message);
    process.exit(1);
  }
} else {
  console.warn('⚠ Client assets directory not found:', srcDir);
  console.warn('  This is normal if the build failed or client build was skipped');
}

