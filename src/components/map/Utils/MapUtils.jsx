// mapUtils.js

/**
 * Calculate icon size based on zoom level using an exponential scale.
 * @param {number} zoomLevel - Current zoom level of the map.
 * @returns {number} Calculated icon size.
 */
export const getIconSize = (zoomLevel) => {
    const minZoom = 1;
    const maxZoom = 18;
    const minSize = 10;
    const maxSize = 30;
  
    // Clamp zoom level to the min and max bounds
    zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel));
  
    // Exponential scaling formula to adjust icon size
    const scale = (zoomLevel - minZoom) / (maxZoom - minZoom);
    return minSize + (maxSize - minSize) * Math.exp(scale * Math.log(2) - 1);
  };
  