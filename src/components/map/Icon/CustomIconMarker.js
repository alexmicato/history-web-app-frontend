// CustomIconMarker.js
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import CustomIcon from './CustomIcon';

const CustomIconMarker = ({ position, IconComponent, style, children }) => {

    console.log(`Rendering Marker - Position: ${position}`);
    
  const iconHtml = renderToString(
    <CustomIcon IconComponent={IconComponent} style={style} />
  );

  const customIcon = new L.divIcon({
    html: iconHtml,
    className: 'custom-icon-marker'
  });

  return (
    <Marker position={position} icon={customIcon}>
      {children}
    </Marker>
  );
};

export default CustomIconMarker;
