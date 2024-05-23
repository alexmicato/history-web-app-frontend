import React, { useEffect, useState, useCallback } from "react";
import { useMapEvents } from "react-leaflet";

const MapEventHandler = ({ setZoomLevel }) => {
  const map = useMapEvents({
    zoomend: () => {
      const newZoomLevel = map.getZoom();
      console.log("Zoom level changed to:", newZoomLevel);
      setZoomLevel(map.getZoom());
    },
  });

  useEffect(() => {
    const initialZoomLevel = map.getZoom();
    console.log("Initial zoom level:", initialZoomLevel);
    setZoomLevel(map.getZoom());
  }, [map, setZoomLevel]);

  return null;
};

export default MapEventHandler;
