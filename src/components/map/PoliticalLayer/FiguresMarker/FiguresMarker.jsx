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


  const FiguresMarker = ({ figuresData, zoomLevel }) => {
    if (!figuresData || !figuresData.features) {
      console.log("No event data available");
      return null;
    }
   
    return figuresData.features.map((event, index) => {
      const { coordinates } = event.geometry;
      const { name, date, significance } = event.properties;
      const iconSize = getIconSize(zoomLevel);
      const icon = new L.DivIcon({
        html: `<i class="fas fa-star" style="color: gold; font-size: ${iconSize[0]}px;"></i>`,
        className: '', 
        iconSize: iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1] / 2]
      });
  
      return (
        <Marker key={index} position={[coordinates[1], coordinates[0]]} icon={icon}>
          <Popup>
            <strong>{name}</strong><br />
            Date: {date}<br />
            {significance && `Significance: ${significance}`}
          </Popup>
        </Marker>
      );
    });
  };

  export default FiguresMarker;