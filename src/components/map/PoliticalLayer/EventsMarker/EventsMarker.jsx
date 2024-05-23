import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import CustomIconMarker from '../../Icon/CustomIconMarker';
import { GiCrossedSwords, GiScrollQuill, GiBookmarklet, GiBarbedStar } from "react-icons/gi";
import { getIconSize } from '../../Utils/MapUtils';


const getIconComponent = (eventType) => {
  switch (eventType) {
    case "battle":
      return GiCrossedSwords;
    case "treaty":
      return GiScrollQuill  ;
    case "event":
      return GiBookmarklet ;
    default:
      return GiBookmarklet ;
  }
};

  const EventsMarker = ({ eventsData, zoomLevel }) => {
    if (!eventsData || !eventsData.features) {
      console.log("No event data available");
      return null;
    }
  
    return eventsData.features.map((event, index) => {
      const { coordinates } = event.geometry;
      const { name, date, description, eventType, imageUrl } = event.properties;

      console.log(`Event ${index} - Coordinates:`, coordinates);
      
      const IconComponent = getIconComponent(eventType);
      const iconSize = getIconSize(zoomLevel);
  
      const iconStyle = {
        fontSize: `${iconSize}px`,
        color: '080707',
      };
  
      return (
        <CustomIconMarker
          key={index}
          position={[coordinates[1], coordinates[0]]}
          IconComponent={IconComponent}
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
                {description && `Description: ${description}`}
              </div>
            </div>
          </Popup>
      </CustomIconMarker>
      );
    });
  };

  export default EventsMarker;