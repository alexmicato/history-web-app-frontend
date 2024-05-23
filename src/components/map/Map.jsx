import React, {useState, useCallback, useEffect} from "react";
import { MapContainer, TileLayer,useMap, } from "react-leaflet";
import WorldBordersGeoJSON from "./PoliticalLayer/WorldBordersLayer";
import PopulationDensityLayer from "../map/PopulationLayer/PopulationDensityLayer";
import MapEventHandler from "../map/Utils/MapEventHandler";
import "./Map.css";
import { useMapEvents } from 'react-leaflet';


const Map = ({ year, layer, showCities, showEvents, showFigures }) => {

  const [zoomLevel, setZoomLevel] = useState(2); // Initial zoom level set to 2
  
  // Define the bounds for the map
  const bounds = [
    [-300, -300], // Southwest coordinates
    [300, 300] // Northeast coordinates
  ];
  const maxZoomOutLevel = 2;

  return (
    <MapContainer
      className="actual-map-container"
      center={[0, 0]}
      zoom={zoomLevel}
      minZoom={maxZoomOutLevel}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <MapEventHandler setZoomLevel={setZoomLevel} />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Source: Esri'
        noWrap={false}
        opacity={0.5}
        //continuousWorld={true}
      />
      {/* Include the GeoJSON component with world borders */}
      {layer === "political" && (
        <WorldBordersGeoJSON 
        year={year} 
        showCities={showCities} 
        showEvents={showEvents} 
        showFigures={showFigures}
        zoomLevel={zoomLevel} />
      )}
      {layer === "populationDensity" && <PopulationDensityLayer year={year} />}
    </MapContainer>
  );
};

export default Map;
