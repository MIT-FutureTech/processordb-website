<template>
  <div ref="containerRef" class="w-full h-full relative bg-black">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A32035] mx-auto mb-2"></div>
        <p class="text-sm text-gray-300">Loading 3D visualization...</p>
      </div>
    </div>
    <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div class="text-center p-4">
        <p class="text-sm text-red-400">{{ error }}</p>
        <p class="text-xs text-red-500 mt-2">Three.js may not be available. Install 'three' package to enable 3D visualization.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { getProcessorTypeColor, getClusterColor, normalizeCoordinates } from '@/lib/galaxyUtils';

const props = defineProps({
  processors: {
    type: Array,
    default: () => []
  },
  clusters: {
    type: Array,
    default: () => []
  },
  selectedCluster: {
    type: Object,
    default: null
  },
  displayMode: {
    type: String,
    default: 'processor'
  },
  colorBy: {
    type: String,
    default: 'type'
  }
});

const emit = defineEmits(['select-processor', 'select-cluster']);

const containerRef = ref(null);
const canvasRef = ref(null);
const loading = ref(true);
const error = ref(null);
let threeScene = null;
let animationId = null;
let raycaster = null;
let mouse = null;
let THREE = null;
let selectedClusterId = null;
let rotationSpeed = 0.002; // Slow rotation speed

async function initThree() {
  try {
    // Dynamic import of Three.js
    THREE = (await import('three')).default || await import('three');
    
    if (!canvasRef.value) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Pure black
    
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.value.clientWidth / containerRef.value.clientHeight,
      0.1,
      1000
    );
    // Set camera to 3/4 view from above (isometric-like view)
    // Position camera at an angle: rotated around Y axis and tilted down
    const distance = 5;
    const angle = Math.PI / 4; // 45 degrees rotation around Y
    const tilt = Math.PI / 6; // 30 degrees tilt down from horizontal
    camera.position.set(
      Math.sin(angle) * distance * Math.cos(tilt),
      distance * Math.sin(tilt),
      Math.cos(angle) * distance * Math.cos(tilt)
    );
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.value,
      antialias: true 
    });
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add axis lines with red color
    // Create a group for axes so they rotate with the data
    const axesGroup = new THREE.Group();
    const axisLength = 2.5;
    const axisColor = 0xA32035; // Website red
    
    // X axis (red) - extended in both directions
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-axisLength, 0, 0),
      new THREE.Vector3(axisLength, 0, 0)
    ]);
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: axisColor, linewidth: 2 });
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    axesGroup.add(xAxis);
    
    // Y axis (red) - extended in both directions
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -axisLength, 0),
      new THREE.Vector3(0, axisLength, 0)
    ]);
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: axisColor, linewidth: 2 });
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    axesGroup.add(yAxis);
    
    // Z axis (red) - extended in both directions
    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -axisLength),
      new THREE.Vector3(0, 0, axisLength)
    ]);
    const zAxisMaterial = new THREE.LineBasicMaterial({ color: axisColor, linewidth: 2 });
    const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
    axesGroup.add(zAxis);
    
    // Create processor spheres (circles)
    // Reuse geometry for better performance
    const sphereGeometry = new THREE.SphereGeometry(0.015, 16, 16);
    
    // Store processor mapping for click detection (declare before use)
    const processorMap = new Map();
    const spheres = [];
    
    // Normalize coordinates for better visualization (explode and center)
    // Filter out positions with null/undefined values in array elements
    const validProcessors = props.processors.filter(p => {
      if (!p.position || !Array.isArray(p.position) || p.position.length !== 3) return false;
      return p.position.every(v => typeof v === 'number' && !isNaN(v));
    });
    const coords = validProcessors.map(p => p.position);
    const { normalized } = normalizeCoordinates(coords, null, 3.0); // Explode factor 3.0 (2x expansion)
    
    // Create mapping for processor indices - only process valid processors
    let coordIndex = 0;
    let fpgaSpheresCreated = 0;
    validProcessors.forEach((processor, index) => {
      if (normalized[coordIndex]) {
        const pos = normalized[coordIndex];
        
        // Color based on colorBy prop
        let colorHex;
        if (props.colorBy === 'type') {
          colorHex = getProcessorTypeColor(processor.type);
        } else if (props.colorBy === 'cluster' && processor.cluster_id !== undefined) {
          colorHex = getClusterColor(processor.cluster_id);
        } else {
          colorHex = getProcessorTypeColor(processor.type);
        }
        
        // Create sphere for each processor (reuse geometry)
        // Use MeshStandardMaterial with emissive for star-like glow effect
        const sphere = new THREE.Mesh(
          sphereGeometry,
          new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: colorHex, // Emissive color for glow
            emissiveIntensity: 0.5, // Glow intensity
            transparent: true,
            opacity: 0.5, // Ambient opacity - lower for better contrast with selected points
            depthWrite: false
          })
        );
        
        sphere.position.set(pos[0], pos[1], pos[2]);
        
        // Store processor mapping and cluster ID on sphere for easy access
        sphere.userData = {
          processor: processor,
          clusterId: processor.cluster_id,
          originalOpacity: 0.5, // Ambient opacity - keep this consistent
          originalEmissiveIntensity: 0.5, // Ambient emissive intensity - keep this consistent
          visible: true // Track visibility for filtering
        };
        processorMap.set(sphere, processor);
        spheres.push(sphere);
        if (processor.type === 'FPGA') {
          fpgaSpheresCreated++;
        }
        coordIndex++;
      }
    });
    
    // Create cluster circles for cluster display mode (will be created/updated in watch)
    const clusterCircles = new Map();
    
    // Create a group for all spheres and axes for easier management
    const spheresGroup = new THREE.Group();
    spheres.forEach(sphere => spheresGroup.add(sphere));
    // Add axes to the same group so they rotate together
    spheresGroup.add(axesGroup);
    scene.add(spheresGroup);
    
    // Setup raycaster for click detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let manualRotationX = 0;
    let manualRotationY = 0;

    canvasRef.value.addEventListener('mousedown', (e) => {
      // Check for click on processor first
      const rect = canvasRef.value.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spheres);
      
      if (intersects.length > 0) {
        const clickedSphere = intersects[0].object;
        const processor = processorMap.get(clickedSphere);
        if (processor) {
          // Highlight the cluster
          highlightCluster(processor.cluster_id);
          emit('select-processor', processor);
          return;
        }
      }
      
      // Clear selection if clicking empty space
      clearClusterHighlight();
      
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    canvasRef.value.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        // Rotate around the center
        const rotationFactor = 0.005;
        manualRotationY += deltaX * rotationFactor;
        manualRotationX += deltaY * rotationFactor;
        
        // Clamp X rotation to prevent flipping (optional, but prevents gimbal lock)
        manualRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, manualRotationX));
        
        // Apply manual rotation
        spheresGroup.rotation.y = manualRotationY;
        spheresGroup.rotation.x = manualRotationX;
        
        // Reset ambient rotation offset when user manually rotates
        ambientRotationY = 0;
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });
    
    canvasRef.value.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    canvasRef.value.addEventListener('wheel', (e) => {
      e.preventDefault();
      // Zoom towards center (origin) regardless of rotation
      const direction = new THREE.Vector3(0, 0, 0).sub(camera.position).normalize();
      const zoomSpeed = e.deltaY * 0.01;
      camera.position.add(direction.multiplyScalar(zoomSpeed));
      
      // Limit zoom distance
      const distance = camera.position.length();
      if (distance < 2) camera.position.normalize().multiplyScalar(2);
      if (distance > 10) camera.position.normalize().multiplyScalar(10);
      
      camera.lookAt(0, 0, 0);
    });
    
    // Animation loop with ambient rotation and shimmer effect
    let ambientRotationY = 0;
    let shimmerTime = 0;
    function animate() {
      animationId = requestAnimationFrame(animate);
      
      // Ambient rotation around Y axis - continue even when datapoint is selected, only stop when dragging
      if (spheresGroup && !isDragging) {
        // Continue ambient rotation from current Y position
        ambientRotationY += rotationSpeed;
        spheresGroup.rotation.y = manualRotationY + ambientRotationY;
        // Preserve X rotation during ambient rotation
        spheresGroup.rotation.x = manualRotationX;
      }
      
      // Shimmer effect when nothing is selected
      shimmerTime += 0.02;
      if (selectedClusterId === null && threeScene && threeScene.spheres) {
        threeScene.spheres.forEach((sphere, index) => {
          if (sphere && sphere.material && sphere.userData && sphere.userData.visible) {
            // Create a subtle pulsing/shimmer effect around the ambient opacity (0.5)
            const ambientOpacity = sphere.userData.originalOpacity || 0.5;
            const shimmer = Math.sin(shimmerTime + index * 0.1) * 0.1 + ambientOpacity; // Shimmer around ambient opacity
            // Only apply shimmer if sphere is not highlighted (opacity is at original level)
            const currentOpacity = sphere.material.opacity;
            // Check if opacity is close to original (within 0.1) to determine if shimmer should apply
            if (Math.abs(currentOpacity - ambientOpacity) < 0.1) {
              sphere.material.opacity = shimmer;
              sphere.material.needsUpdate = true;
            }
          }
        });
      }
      
      renderer.render(scene, camera);
    }
    animate();
    
    threeScene = { scene, camera, renderer, spheres, spheresGroup, processorMap, clusterCircles };
    loading.value = false;
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.value) return;
      camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Store cleanup function
    threeScene.cleanup = () => {
      window.removeEventListener('resize', handleResize);
    };
  } catch (err) {
    console.error('Error initializing Three.js:', err);
    error.value = 'Failed to load 3D visualization. Three.js library may not be installed.';
    loading.value = false;
  }
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (threeScene) {
    if (threeScene.cleanup) {
      threeScene.cleanup();
    }
    if (threeScene.renderer) {
      threeScene.renderer.dispose();
    }
  }
}

function highlightCluster(clusterId) {
  if (!threeScene || !threeScene.spheres || !THREE) return;
  
  selectedClusterId = clusterId;
  
  // Update opacity for all spheres - highlight selected cluster but keep others at ambient opacity
  threeScene.spheres.forEach((sphere) => {
    if (sphere && sphere.material && sphere.userData) {
      // Ensure both are compared as numbers to avoid type mismatch
      const sphereClusterId = Number(sphere.userData.clusterId);
      const selectedClusterIdNum = Number(clusterId);
      const isInSelectedCluster = sphereClusterId === selectedClusterIdNum;
      
      // Highlight selected cluster with higher opacity (1.0) and increased emissive
      // Keep non-selected clusters at their AMBIENT opacity and emissive (same as when nothing is selected)
      const ambientOpacity = sphere.userData.originalOpacity || 0.5;
      const ambientEmissiveIntensity = sphere.userData.originalEmissiveIntensity || 0.5;
      
      sphere.material.opacity = isInSelectedCluster ? 1.0 : ambientOpacity;
      // Adjust emissive intensity: brighter for selected cluster, keep ambient for others
      if (sphere.material.emissiveIntensity !== undefined) {
        sphere.material.emissiveIntensity = isInSelectedCluster ? 0.8 : ambientEmissiveIntensity;
      }
      sphere.material.needsUpdate = true;
    }
  });
}

function updateVisibility() {
  if (!threeScene || !threeScene.spheres || !THREE) return;
  
  // Create a set of visible processor IDs for fast lookup
  // Match the ID format used in clustering.js: `${type.toLowerCase()}_${processor_id}`
  const visibleProcessorIds = new Set(
    props.processors.map(p => `${p.type.toLowerCase()}_${p.processor_id}`)
  );
  
  threeScene.spheres.forEach((sphere) => {
    if (sphere && sphere.userData) {
      const processor = sphere.userData.processor;
      // Visibility is controlled by whether processor is in filteredProcessors
      // Match the ID format used in clustering.js
      const processorKey = `${processor.type.toLowerCase()}_${processor.processor_id}`;
      const isVisible = visibleProcessorIds.has(processorKey);
      
      sphere.userData.visible = isVisible;
      sphere.visible = isVisible;
    }
  });
}

function clearClusterHighlight() {
  if (!threeScene || !threeScene.spheres || !THREE) return;
  
  selectedClusterId = null;
  
  // Reset all opacities and emissive intensities to ambient (original) values
  threeScene.spheres.forEach((sphere) => {
    if (sphere && sphere.material && sphere.userData) {
      const ambientOpacity = sphere.userData.originalOpacity || 0.5;
      const ambientEmissiveIntensity = sphere.userData.originalEmissiveIntensity || 0.5;
      sphere.material.opacity = ambientOpacity;
      if (sphere.material.emissiveIntensity !== undefined) {
        sphere.material.emissiveIntensity = ambientEmissiveIntensity;
      }
      sphere.material.needsUpdate = true;
    }
  });
}

function updateColors() {
  if (!threeScene || !threeScene.spheres || !THREE) return;
  
  // Update colors based on processor data
  threeScene.spheres.forEach((sphere) => {
    if (sphere && sphere.material && sphere.userData) {
      const processor = sphere.userData.processor;
      if (processor) {
        // Color based on colorBy prop
        let colorHex;
        if (props.colorBy === 'type') {
          colorHex = getProcessorTypeColor(processor.type);
        } else if (props.colorBy === 'cluster' && processor.cluster_id !== undefined) {
          colorHex = getClusterColor(processor.cluster_id);
        } else {
          colorHex = getProcessorTypeColor(processor.type);
        }
        
        const colorValue = parseInt(colorHex.replace('#', ''), 16);
        sphere.material.color.setHex(colorValue);
        // Update emissive color for star-like glow effect
        if (sphere.material.emissive) {
          sphere.material.emissive.setHex(colorValue);
        }
      }
    }
  });
}

watch(() => props.processors, () => {
  if (threeScene && props.processors.length > 0) {
    // Update colors and visibility when processors change
    updateColors();
    updateVisibility();
  }
}, { deep: true });

watch(() => props.displayMode, () => {
  if (!threeScene || !THREE) return;
  
  // Remove old circles
  if (threeScene.clusterCircles) {
    threeScene.clusterCircles.forEach((circle) => {
      threeScene.scene.remove(circle);
    });
    threeScene.clusterCircles.clear();
  }
  
  // Create cluster circles if in cluster mode
  if (props.displayMode === 'cluster' && props.clusters) {
    const newCircles = new Map();
    props.clusters.forEach(cluster => {
      if (cluster.centroid && Array.isArray(cluster.centroid) && cluster.centroid.length === 3) {
        // Normalize centroid position to match sphere positions
        const coords = [cluster.centroid];
        const { normalized: normalizedCentroid } = normalizeCoordinates(coords, null, 3.0);
        
        if (normalizedCentroid && normalizedCentroid[0]) {
          const ringGeometry = new THREE.RingGeometry(0.15, 0.2, 32);
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: getClusterColor(cluster.cluster_id),
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          const pos = normalizedCentroid[0];
          ring.position.set(pos[0], pos[1], pos[2]);
          ring.lookAt(0, 0, 0);
          threeScene.scene.add(ring);
          newCircles.set(cluster.cluster_id, ring);
        }
      }
    });
    threeScene.clusterCircles = newCircles;
  }
}, { immediate: true });

watch(() => props.colorBy, () => {
  if (threeScene && props.processors.length > 0) {
    updateColors();
    // Re-apply cluster highlight if one is selected
    if (selectedClusterId !== null) {
      highlightCluster(selectedClusterId);
    }
  }
});

watch(() => props.selectedCluster, (newCluster) => {
  if (newCluster && newCluster.cluster_id !== undefined) {
    highlightCluster(newCluster.cluster_id);
  } else {
    clearClusterHighlight();
  }
});

// Removed watch on selectedClusterId - it was interfering with highlightCluster
// highlightCluster now handles all opacity/emissive updates correctly
// The shimmer effect check in animate() already handles the selectedClusterId === null case

onMounted(() => {
  if (props.processors.length > 0) {
    initThree();
  } else {
    loading.value = false;
  }
});

onUnmounted(() => {
  cleanup();
});
</script>

