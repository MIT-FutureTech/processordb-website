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

// #region agent log
fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'copy-client-assets.js:13',message:'Script started',data:{projectRoot,srcDir,destDir,cwd:process.cwd()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

function copyRecursive(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'copy-client-assets.js:23',message:'Copying directory',data:{src,dest,entryCount:entries.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'copy-client-assets.js:33',message:'File copied',data:{srcPath,destPath},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
  }
}

// Check if source exists
const srcExists = fs.existsSync(srcDir);
const destExistsBefore = fs.existsSync(destDir);
// #region agent log
fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'copy-client-assets.js:36',message:'Checking directories before copy',data:{srcDir,srcExists,destDir,destExistsBefore},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

if (srcExists) {
  try {
    copyRecursive(srcDir, destDir);
    const destExistsAfter = fs.existsSync(destDir);
    let fileCount = 0;
    try {
      if (destExistsAfter) {
        const files = fs.readdirSync(destDir, { recursive: true, withFileTypes: true });
        fileCount = files.filter(f => f.isFile()).length;
      }
    } catch (e) {}
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'copy-client-assets.js:47',message:'Copy completed',data:{destDir,destExistsAfter,fileCount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.log('✓ Client assets copied to .output/public/_nuxt');
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'copy-client-assets.js:52',message:'Copy error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.error('✗ Error copying client assets:', error.message);
    process.exit(1);
  }
} else {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'copy-client-assets.js:58',message:'Source directory missing',data:{srcDir},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  console.warn('⚠ Client assets directory not found:', srcDir);
  console.warn('  This is normal if the build failed or client build was skipped');
}

