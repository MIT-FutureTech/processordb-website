import { readFile, stat } from 'fs/promises'
import { join } from 'path'

const projectRoot = process.cwd()
const outputPath = join(projectRoot, '.output/public/_nuxt/entry-hispHl3t.js')

console.log('🔍 Static Assets Debugging Script')
console.log('=====================================\n')

console.log('1. Checking if file exists:')
console.log('   Path:', outputPath)
try {
  const stats = await stat(outputPath)
  console.log('   ✅ File exists')
  console.log('   Size:', stats.size, 'bytes')
  console.log('   Is file:', stats.isFile())
} catch (error) {
  console.log('   ❌ File does NOT exist')
  console.log('   Error:', error.message)
}

console.log('\n2. Checking .output/public/_nuxt directory:')
const nuxtDir = join(projectRoot, '.output/public/_nuxt')
try {
  const dirStats = await stat(nuxtDir)
  console.log('   ✅ Directory exists')
  console.log('   Is directory:', dirStats.isDirectory())
} catch (error) {
  console.log('   ❌ Directory does NOT exist')
  console.log('   Error:', error.message)
}

console.log('\n3. Testing file read:')
try {
  const content = await readFile(outputPath, 'utf8')
  console.log('   ✅ File can be read')
  console.log('   First 100 chars:', content.substring(0, 100))
} catch (error) {
  console.log('   ❌ Cannot read file')
  console.log('   Error:', error.message)
}

console.log('\n4. Checking server structure:')
const serverDir = join(projectRoot, '.output/server')
try {
  const serverStats = await stat(serverDir)
  console.log('   ✅ Server directory exists')
} catch (error) {
  console.log('   ❌ Server directory does NOT exist')
}

console.log('\n5. Testing HTTP request (if server is running):')
console.log('   Run: curl -v http://localhost:3000/_nuxt/entry-hispHl3t.js')
console.log('   This will show the actual HTTP response from the server')


