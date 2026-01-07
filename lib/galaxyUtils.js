/**
 * Utility functions for Processor Galaxy Visualization
 */

/**
 * Color mapping for manufacturers
 */
export const manufacturerColors = {
  'Intel': '#0071C5',
  'AMD': '#ED1C24',
  'NVIDIA': '#76B900',
  'Qualcomm': '#0066CC',
  'Apple': '#A8A8A8',
  'Samsung': '#1428A0',
  'MediaTek': '#EC1C24',
  'Xilinx': '#000000',
  'Altera': '#FF6600',
  'Default': '#6B7280'
};

/**
 * Color mapping for processor types - Neon colors
 */
export const processorTypeColors = {
  'CPU': '#00F0FF', // Neon cyan
  'GPU': '#FF00FF', // Neon magenta/fuchsia
  'FPGA': '#00FF00', // Neon green
  'Default': '#FFFF00' // Neon yellow
};

/**
 * Get color for a manufacturer
 * @param {string} manufacturer - Manufacturer name
 * @returns {string} Hex color code
 */
export function getManufacturerColor(manufacturer) {
  if (!manufacturer) return manufacturerColors.Default;
  const normalized = manufacturer.trim();
  return manufacturerColors[normalized] || manufacturerColors.Default;
}

/**
 * Get color for a processor type
 * @param {string} type - Processor type (CPU, GPU, FPGA)
 * @returns {string} Hex color code
 */
export function getProcessorTypeColor(type) {
  if (!type) return processorTypeColors.Default;
  return processorTypeColors[type.toUpperCase()] || processorTypeColors.Default;
}

/**
 * Generate a color for a cluster based on its ID
 * @param {number} clusterId - Cluster ID
 * @returns {string} Hex color code
 */
export function getClusterColor(clusterId) {
  const colors = [
    '#FF00FF', // Neon magenta
    '#00FFFF', // Neon cyan
    '#FF00FF', // Neon pink
    '#00FF00', // Neon green
    '#FFFF00', // Neon yellow
    '#FF0080', // Neon pink
    '#00FF80', // Neon green-cyan
    '#FF8000', // Neon orange
    '#8000FF', // Neon purple
    '#00FF40', // Neon green
    '#FF4000', // Neon red-orange
    '#0080FF', // Neon blue
    '#FF80FF', // Neon pink-magenta
    '#80FF00', // Neon lime
    '#FF0080', // Neon hot pink
    '#00FFFF', // Neon aqua
    '#FF00FF', // Neon fuchsia
    '#FFFF00', // Neon yellow
    '#00FF00', // Neon green
    '#FF00FF'  // Neon magenta
  ];
  return colors[clusterId % colors.length];
}

/**
 * Calculate centroid (center of mass) of coordinates
 * @param {Array<Array<number>>} coordinates - Array of [x, y, z] coordinates
 * @returns {Array<number>} Centroid [x, y, z]
 */
export function calculateCentroid(coordinates) {
  if (!coordinates || coordinates.length === 0) return [0, 0, 0];
  
  const validCoords = coordinates.filter(coord => 
    coord && Array.isArray(coord) && coord.length === 3 && 
    coord.every(v => typeof v === 'number' && !isNaN(v))
  );
  
  if (validCoords.length === 0) return [0, 0, 0];
  
  const sum = validCoords.reduce((acc, coord) => {
    return [acc[0] + coord[0], acc[1] + coord[1], acc[2] + coord[2]];
  }, [0, 0, 0]);
  
  return [
    sum[0] / validCoords.length,
    sum[1] / validCoords.length,
    sum[2] / validCoords.length
  ];
}

/**
 * Normalize coordinates to fit within a bounding box, explode/spread them, and center on centroid
 * @param {Array<Array<number>>} coordinates - Array of [x, y, z] coordinates
 * @param {Object} bounds - Bounding box { min: [x, y, z], max: [x, y, z] }
 * @param {number} explodeFactor - Factor to spread data (default: 1.5)
 * @returns {Object} { normalized: Array, centroid: Array, bounds: Object }
 */
export function normalizeCoordinates(coordinates, bounds = null, explodeFactor = 1.5) {
  if (!coordinates || coordinates.length === 0) {
    return { normalized: coordinates, centroid: [0, 0, 0], bounds: null };
  }
  
  // Filter out invalid coordinates
  const validCoords = coordinates.filter(coord => 
    coord && Array.isArray(coord) && coord.length === 3 && 
    coord.every(v => typeof v === 'number' && !isNaN(v))
  );
  
  if (validCoords.length === 0) {
    return { normalized: coordinates, centroid: [0, 0, 0], bounds: null };
  }
  
  // Calculate bounds if not provided
  if (!bounds) {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    
    validCoords.forEach(coord => {
      for (let i = 0; i < 3; i++) {
        if (coord[i] < min[i]) min[i] = coord[i];
        if (coord[i] > max[i]) max[i] = coord[i];
      }
    });
    
    bounds = { min, max };
  }
  
  // Calculate centroid
  const centroid = calculateCentroid(validCoords);
  
  // Normalize to [-1, 1] range, explode, and center on origin
  const ranges = bounds.max.map((max, i) => max - bounds.min[i]);
  const maxRange = Math.max(...ranges);
  
  const normalized = validCoords.map(coord => {
    return coord.map((value, i) => {
      if (ranges[i] === 0) return 0;
      // Center on origin by subtracting centroid, then normalize and explode
      const centered = (value - centroid[i]) / (maxRange || 1);
      return centered * explodeFactor;
    });
  });
  
  return { normalized, centroid: [0, 0, 0], bounds };
}

/**
 * Generate a cluster label from processor characteristics
 * @param {Array} processors - Array of processor objects
 * @returns {string} Cluster label
 */
export function generateClusterLabel(processors) {
  if (!processors || processors.length === 0) return 'Empty Cluster';
  
  const typeCounts = {};
  const manufacturerCounts = {};
  const architectureCounts = {};
  
  processors.forEach(proc => {
    const type = proc.type || 'Unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    
    const mfr = proc.SoC?.Manufacturer?.name || proc.manufacturer || 'Unknown';
    manufacturerCounts[mfr] = (manufacturerCounts[mfr] || 0) + 1;
    
    const arch = proc.architecture || proc.microarchitecture || null;
    if (arch) {
      architectureCounts[arch] = (architectureCounts[arch] || 0) + 1;
    }
  });
  
  const dominantType = Object.keys(typeCounts).reduce((a, b) => 
    typeCounts[a] > typeCounts[b] ? a : b
  );
  
  const dominantMfr = Object.keys(manufacturerCounts).reduce((a, b) => 
    manufacturerCounts[a] > manufacturerCounts[b] ? a : b
  );
  
  const dominantArch = Object.keys(architectureCounts).reduce((a, b) => 
    architectureCounts[a] > architectureCounts[b] ? a : b
  , null);
  
  let label = dominantType;
  if (dominantMfr && dominantMfr !== 'Unknown') {
    label += `, ${dominantMfr}`;
  }
  if (dominantArch) {
    label += ` ${dominantArch}`;
  }
  
  return label;
}

/**
 * Format position coordinates for display
 * @param {Array<number>} position - [x, y, z] coordinates
 * @param {number} precision - Decimal places (default: 3)
 * @returns {string} Formatted position string
 */
export function formatPosition(position, precision = 3) {
  if (!position || !Array.isArray(position) || position.length !== 3) return 'N/A';
  // Check for null/undefined values
  if (position[0] == null || position[1] == null || position[2] == null) return 'N/A';
  return `(${position[0].toFixed(precision)}, ${position[1].toFixed(precision)}, ${position[2].toFixed(precision)})`;
}

/**
 * Calculate distance between two 3D points
 * @param {Array<number>} point1 - [x, y, z] coordinates
 * @param {Array<number>} point2 - [x, y, z] coordinates
 * @returns {number} Euclidean distance
 */
export function calculateDistance(point1, point2) {
  if (!point1 || !point2 || point1.length !== 3 || point2.length !== 3) {
    return Infinity;
  }
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];
  const dz = point1[2] - point2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Find nearest processor to a given point
 * @param {Array<number>} point - [x, y, z] coordinates
 * @param {Array} processors - Array of processor objects with position property
 * @returns {Object|null} Nearest processor or null
 */
export function findNearestProcessor(point, processors) {
  if (!processors || processors.length === 0) return null;
  
  let nearest = null;
  let minDistance = Infinity;
  
  processors.forEach(processor => {
    if (!processor.position) return;
    const distance = calculateDistance(point, processor.position);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = processor;
    }
  });
  
  return nearest;
}

