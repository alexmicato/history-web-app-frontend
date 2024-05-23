// CityMarker.js
import React from 'react';
import { Popup } from 'react-leaflet';
import CustomIconMarker from '../../Icon/CustomIconMarker';
import { GiBarbedStar } from "react-icons/gi";
import { getIconSize } from '../../Utils/MapUtils';

const CityMarker = ({ citiesData, zoomLevel }) => {
  if (!citiesData || !citiesData.features) return null;

  return citiesData.features.map((feature, index) => {
    const { coordinates } = feature.geometry;
    const { name, significance, imageUrl } = feature.properties;
    const population = feature.properties["est. population"];
    const iconSize = getIconSize(zoomLevel);

    const iconStyle = {
      fontSize: `${iconSize}px`,
      color: '#080707',
    };

    return (
      <CustomIconMarker
        key={index}
        position={[coordinates[1], coordinates[0]]}
        IconComponent={GiBarbedStar}
        style={iconStyle}
      >
        <Popup>
          <div className="popup-inner">
            <div className="popup-image">
              <img src={imageUrl || '/assets/images/backgrounds/markers/generic/country.jpg'} alt="Location" />
            </div>
            <div className="popup-text">
              <h3>{name}</h3>
              <p><b>Est. Population:</b> {population}</p>
              <p><b>Significance:</b> {significance}</p>
            </div>
          </div>
        </Popup>
      </CustomIconMarker>
    );
  });
};

export default CityMarker;
