import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const getIconSize = (zoomLevel) => {
  const minZoom = 1;
  const maxZoom = 18;
  const minSize = 15;
  const maxSize = 40; // Increased maximum size for more significant scaling

  const factor = (zoomLevel - minZoom) / (maxZoom - minZoom);
  const scaledSize = minSize + (maxSize - minSize) * Math.pow(factor, 2); // Using a power to enhance scaling effect

  return [scaledSize, scaledSize];
};


const CityMarker = ({ citiesData, zoomLevel }) => {
  if (!citiesData || !citiesData.features) return null;

  return citiesData.features.map((feature, index) => {
    const { coordinates } = feature.geometry;
    const { name, significance } = feature.properties;
    const population = feature.properties["est. population"];
    const iconSize = getIconSize(zoomLevel);
    const dynamicIcon = new L.divIcon({
      html: `<i class="fas fa-star" style="color: gold; font-size: ${iconSize[0]}px;"></i>`,
      iconSize: iconSize,
      iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
      className: ''
    });

    return (
      <Marker key={index} position={[coordinates[1], coordinates[0]]} icon={dynamicIcon}>
        <Popup className="city-popup">
          <div className="popup-content">
            <h3>{name}</h3>
            <p><b>Est. Population:</b> {population}</p>
            <p><b>Significance:</b> {significance}</p>
          </div>
        </Popup>
      </Marker>
    );
  });
};

export default CityMarker;
