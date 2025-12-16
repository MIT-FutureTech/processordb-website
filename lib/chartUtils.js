/**
 * Chart utility functions for handling large datasets
 * Provides binning, clustering, outlier detection, and density calculations
 */

/**
 * Calculate data density (points per pixel) based on axis ranges
 * @param {Array} data - Array of data points
 * @param {Object} xAxis - X-axis configuration with value property
 * @param {Object} yAxis - Y-axis configuration with value property
 * @param {number} chartWidth - Chart width in pixels (default: 800)
 * @param {number} chartHeight - Chart height in pixels (default: 600)
 * @returns {number} Points per pixel
 */
export function calculateDataDensity(data, xAxis, yAxis, chartWidth = 800, chartHeight = 600) {
  if (!data || data.length === 0) return 0;

  // Get axis values
  const xValues = data.map(item => {
    const x = getAxisValue(item, xAxis);
    return xAxis.value === 'release_date' ? Date.parse(x) : x;
  }).filter(v => v !== null && !isNaN(v));

  const yValues = data.map(item => getAxisValue(item, yAxis)).filter(v => v !== null && !isNaN(v));

  if (xValues.length === 0 || yValues.length === 0) return 0;

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  if (xRange === 0 || yRange === 0) return Infinity;

  // Calculate points per pixel
  const pointsPerPixelX = data.length / chartWidth;
  const pointsPerPixelY = data.length / chartHeight;
  
  return Math.max(pointsPerPixelX, pointsPerPixelY);
}

/**
 * Get axis value from data item
 * @param {Object} item - Data item
 * @param {Object} axis - Axis configuration with value and source properties
 * @returns {*} Axis value
 */
function getAxisValue(item, axis) {
  if (axis.value === 'manufacturer_name') {
    return item.manufacturer_name || item.manufacturer?.name || null;
  }
  if (axis.value === 'processor_type') {
    if (item.processors && item.processors.length > 0) {
      const types = [...new Set(item.processors.map(p => p.processor_type).filter(Boolean))];
      return types.length > 0 ? types[0] : null;
    }
    return null;
  }
  return item[axis.value] ?? null;
}

/**
 * Bin data into buckets and aggregate points within each bin
 * @param {Array} data - Array of data points with x, y properties
 * @param {number} binCount - Number of bins to create
 * @returns {Array} Aggregated data points
 */
export function binData(data, binCount = 50) {
  if (!data || data.length === 0) return [];
  if (data.length <= binCount) return data;

  const bins = new Map();
  
  // Calculate ranges
  const xValues = data.map(d => d.x).filter(v => v !== null && !isNaN(v));
  const yValues = data.map(d => d.y).filter(v => v !== null && !isNaN(v));
  
  if (xValues.length === 0 || yValues.length === 0) return data;

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  if (xRange === 0 || yRange === 0) return data;

  const binWidthX = xRange / binCount;
  const binWidthY = yRange / binCount;

  // Group points into bins
  data.forEach(point => {
    if (point.x === null || point.y === null || isNaN(point.x) || isNaN(point.y)) return;

    const binX = Math.floor((point.x - xMin) / binWidthX);
    const binY = Math.floor((point.y - yMin) / binWidthY);
    const key = `${binX}-${binY}`;

    if (!bins.has(key)) {
      bins.set(key, { x: [], y: [], count: 0, data: [] });
    }

    const bin = bins.get(key);
    bin.x.push(point.x);
    bin.y.push(point.y);
    bin.count++;
    bin.data.push(point);
  });

  // Aggregate bins (average x, y, keep first data point for tooltip)
  return Array.from(bins.values()).map(bin => ({
    x: bin.x.reduce((a, b) => a + b, 0) / bin.x.length,
    y: bin.y.reduce((a, b) => a + b, 0) / bin.y.length,
    count: bin.count,
    data: bin.data[0], // Keep first data point for tooltip
    isAggregated: bin.count > 1
  }));
}

/**
 * Simple k-means clustering for medium datasets
 * @param {Array} data - Array of data points with x, y properties
 * @param {number} clusterCount - Number of clusters (default: 100)
 * @returns {Array} Clustered data points
 */
export function clusterData(data, clusterCount = 100) {
  if (!data || data.length === 0) return [];
  if (data.length <= clusterCount) return data;

  const xValues = data.map(d => d.x).filter(v => v !== null && !isNaN(v));
  const yValues = data.map(d => d.y).filter(v => v !== null && !isNaN(v));
  
  if (xValues.length === 0 || yValues.length === 0) return data;

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // Initialize cluster centers randomly
  const clusters = Array.from({ length: clusterCount }, () => ({
    centerX: xMin + Math.random() * (xMax - xMin),
    centerY: yMin + Math.random() * (yMax - yMin),
    points: []
  }));

  // Simple k-means iteration (limited to 10 iterations for performance)
  for (let iter = 0; iter < 10; iter++) {
    // Clear cluster points
    clusters.forEach(c => c.points = []);

    // Assign points to nearest cluster
    data.forEach(point => {
      if (point.x === null || point.y === null || isNaN(point.x) || isNaN(point.y)) return;

      let minDist = Infinity;
      let nearestCluster = clusters[0];

      clusters.forEach(cluster => {
        const dist = Math.sqrt(
          Math.pow(point.x - cluster.centerX, 2) + 
          Math.pow(point.y - cluster.centerY, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          nearestCluster = cluster;
        }
      });

      nearestCluster.points.push(point);
    });

    // Update cluster centers
    clusters.forEach(cluster => {
      if (cluster.points.length > 0) {
        cluster.centerX = cluster.points.reduce((sum, p) => sum + p.x, 0) / cluster.points.length;
        cluster.centerY = cluster.points.reduce((sum, p) => sum + p.y, 0) / cluster.points.length;
      }
    });
  }

  // Return cluster centers with metadata
  return clusters
    .filter(c => c.points.length > 0)
    .map(cluster => ({
      x: cluster.centerX,
      y: cluster.centerY,
      count: cluster.points.length,
      data: cluster.points[0], // Keep first data point for tooltip
      isAggregated: cluster.points.length > 1
    }));
}

/**
 * Extract statistical outliers using IQR (Interquartile Range) method
 * @param {Array} data - Array of data points with x, y properties
 * @param {number} sampleSize - Maximum number of outliers to return
 * @returns {Object} { outliers: Array, normal: Array }
 */
export function sampleOutliers(data, sampleSize = 1000) {
  if (!data || data.length === 0) return { outliers: [], normal: data };
  if (data.length <= sampleSize) return { outliers: [], normal: data };

  // Calculate IQR for both x and y
  const xValues = data.map(d => d.x).filter(v => v !== null && !isNaN(v)).sort((a, b) => a - b);
  const yValues = data.map(d => d.y).filter(v => v !== null && !isNaN(v)).sort((a, b) => a - b);

  if (xValues.length === 0 || yValues.length === 0) return { outliers: [], normal: data };

  const getIQR = (values) => {
    const q1Index = Math.floor(values.length * 0.25);
    const q3Index = Math.floor(values.length * 0.75);
    const q1 = values[q1Index];
    const q3 = values[q3Index];
    const iqr = q3 - q1;
    return { q1, q3, iqr, lowerBound: q1 - 1.5 * iqr, upperBound: q3 + 1.5 * iqr };
  };

  const xIQR = getIQR(xValues);
  const yIQR = getIQR(yValues);

  // Identify outliers (points outside IQR bounds)
  const outliers = [];
  const normal = [];

  data.forEach(point => {
    if (point.x === null || point.y === null || isNaN(point.x) || isNaN(point.y)) {
      normal.push(point);
      return;
    }

    const isXOutlier = point.x < xIQR.lowerBound || point.x > xIQR.upperBound;
    const isYOutlier = point.y < yIQR.lowerBound || point.y > yIQR.upperBound;

    if (isXOutlier || isYOutlier) {
      outliers.push(point);
    } else {
      normal.push(point);
    }
  });

  // Limit outliers to sampleSize
  const limitedOutliers = outliers.slice(0, sampleSize);

  return {
    outliers: limitedOutliers,
    normal: normal
  };
}

/**
 * Create heatmap data from scatter points
 * @param {Array} data - Array of data points with x, y properties
 * @param {number} gridSize - Grid size (default: 50x50)
 * @returns {Array} Heatmap data in format [[x, y, value], ...]
 */
export function createHeatmap(data, gridSize = 50) {
  if (!data || data.length === 0) return [];

  const xValues = data.map(d => d.x).filter(v => v !== null && !isNaN(v));
  const yValues = data.map(d => d.y).filter(v => v !== null && !isNaN(v));
  
  if (xValues.length === 0 || yValues.length === 0) return [];

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  if (xRange === 0 || yRange === 0) return [];

  // Create grid
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

  // Count points in each grid cell
  data.forEach(point => {
    if (point.x === null || point.y === null || isNaN(point.x) || isNaN(point.y)) return;

    const xIndex = Math.min(
      Math.floor(((point.x - xMin) / xRange) * gridSize),
      gridSize - 1
    );
    const yIndex = Math.min(
      Math.floor(((point.y - yMin) / yRange) * gridSize),
      gridSize - 1
    );

    grid[yIndex][xIndex]++;
  });

  // Convert grid to heatmap data format
  const heatmapData = [];
  const cellWidthX = xRange / gridSize;
  const cellWidthY = yRange / gridSize;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] > 0) {
        heatmapData.push([
          xMin + (x + 0.5) * cellWidthX, // Center of cell
          yMin + (y + 0.5) * cellWidthY, // Center of cell
          grid[y][x] // Density value
        ]);
      }
    }
  }

  return heatmapData;
}

/**
 * Detect dense regions (clusters with >threshold points)
 * @param {Array} data - Array of data points
 * @param {number} threshold - Minimum points to be considered dense (default: 100)
 * @param {number} radius - Radius for density check (default: 5% of range)
 * @returns {Object} { denseRegions: Array, sparsePoints: Array }
 */
export function detectDenseRegions(data, threshold = 100, radius = null) {
  if (!data || data.length === 0) return { denseRegions: [], sparsePoints: data };

  const xValues = data.map(d => d.x).filter(v => v !== null && !isNaN(v));
  const yValues = data.map(d => d.y).filter(v => v !== null && !isNaN(v));
  
  if (xValues.length === 0 || yValues.length === 0) return { denseRegions: [], sparsePoints: data };

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  if (xRange === 0 || yRange === 0) return { denseRegions: [], sparsePoints: data };

  // Default radius is 5% of the larger range
  const defaultRadius = Math.max(xRange, yRange) * 0.05;
  const searchRadius = radius || defaultRadius;

  const denseRegions = [];
  const sparsePoints = [];
  const processed = new Set();

  data.forEach((point, index) => {
    if (processed.has(index)) return;
    if (point.x === null || point.y === null || isNaN(point.x) || isNaN(point.y)) {
      sparsePoints.push(point);
      return;
    }

    // Count nearby points
    const nearbyPoints = data.filter((p, i) => {
      if (i === index || p.x === null || p.y === null || isNaN(p.x) || isNaN(p.y)) return false;
      const dist = Math.sqrt(
        Math.pow(p.x - point.x, 2) + 
        Math.pow(p.y - point.y, 2)
      );
      return dist <= searchRadius;
    });

    if (nearbyPoints.length >= threshold) {
      // Dense region found
      const region = {
        centerX: point.x,
        centerY: point.y,
        points: [point, ...nearbyPoints],
        count: nearbyPoints.length + 1
      };
      denseRegions.push(region);
      
      // Mark points as processed
      nearbyPoints.forEach(p => {
        const idx = data.indexOf(p);
        if (idx !== -1) processed.add(idx);
      });
      processed.add(index);
    } else {
      sparsePoints.push(point);
    }
  });

  return { denseRegions, sparsePoints };
}

