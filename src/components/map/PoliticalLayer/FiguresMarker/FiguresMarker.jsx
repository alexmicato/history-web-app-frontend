// FiguresMarker.js
import React from 'react';
import { Popup } from 'react-leaflet';
import CustomIconMarker from '../../Icon/CustomIconMarker';
import { GiConqueror } from "react-icons/gi";
import { getIconSize } from '../../Utils/MapUtils';


const FiguresMarker = ({ figuresData, zoomLevel }) => {
  if (!figuresData || !figuresData.features) {
    console.log("No figures data available");
    return null;
  }

  return figuresData.features.map((figure, index) => {
    const { coordinates } = figure.geometry;
    const { name, date, significance, imageUrl } = figure.properties;
    const iconSize = getIconSize(zoomLevel);

    const iconStyle = {
      fontSize: `${iconSize}px`,
      color: '#080707',
    };

    return (
      <CustomIconMarker
        key={index}
        position={[coordinates[1], coordinates[0]]}
        IconComponent={GiConqueror }
        style={iconStyle}
      >
        <Popup>
          <div className="popup-inner">
            <div className="popup-image">
                <img src={imageUrl || '/path/to/default/image.jpg'} alt="Location" />
            </div>
            <div className="popup-text">
              <strong>{name}</strong><br />
              Date: {date}<br />
              {significance && `Significance: ${significance}`}
            </div>
          </div>
        </Popup>
      </CustomIconMarker>
    );
  });
};

export default FiguresMarker;
