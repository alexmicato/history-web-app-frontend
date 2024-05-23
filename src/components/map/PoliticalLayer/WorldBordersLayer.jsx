import React, { useEffect, useState, useRef, useCallback  } from "react";
import { GeoJSON, Marker, Popup } from "react-leaflet";
import { useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "./WorldBordersLayer.css";
import countryColorMap from "../../../utils/map/countryColors";
import L from "leaflet";
import CityMarkers from "./CityMarker/CityMarker";
import EventsMarkers from "./EventsMarker/EventsMarker";
import FiguresMarkers from "./FiguresMarker/FiguresMarker";
import * as turf from "@turf/turf";

const WorldBordersGeoJSON = ({ year, showCities, showEvents, showFigures, zoomLevel }) => {
  // Create state to hold GeoJSON data
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [citiesData, setCitiesData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [figuresData, setFiguresData] = useState(null);
  const geoJsonRef = useRef(null);
  const markersRef = useRef([]);
  const [activeLayer, setActiveLayer] = useState(null);
  const map = useMap(); 
  const [countryLabels, setCountryLabels] = useState([]);

  const fetchData = async (filePath) => {
    try {
      const response = await fetch(filePath);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  useEffect(() => {
    setLoading(true);
    const fetchDataAsync = async () => {
      const bordersData = await fetchData(`/geojson/political/borders/${year < 0 ? `world_bc${-year}` : `world_${year}`}.geojson`);
      setGeoJsonData(bordersData);
  
      if (showCities) {
        const citiesData = await fetchData(`/geojson/political/cities/basic/cities${year < 0 ? `_bc${-year}` : `_${year}`}.geojson`);
        setCitiesData(citiesData);
      } else {
        setCitiesData(null);
      }
  
      if (showEvents) {
        const eventsData = await fetchData(`/geojson/political/events/basic/events${year < 0 ? `_bc${-year}` : `_${year}`}.geojson`);
        setEventsData(eventsData);
      } else {
        setEventsData(null);
      }

      if(showFigures){
        const figuresData = await fetchData(`/geojson/political/figures/basic/figures${year < 0 ? `_bc${-year}` : `_${year}`}.geojson`);
        setFiguresData(figuresData);
      }else{
        setFiguresData(null);
      }

  
      setLoading(false);
      addCountryLabels(bordersData);
    };
  
    fetchDataAsync();
  }, [year, showCities, showEvents]);

  useEffect(() => {
    addCountryLabels(geoJsonData);
  }, [geoJsonData, zoomLevel]);

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 16);
      // Adjusting the intensity to generate darker colors
      const darkIntensity = Math.floor(randomIndex * 0.8);
      color += letters[darkIntensity];
    }
    return color;
  };

  const zoomToFeature = (e) => {
    const layer = e.target;
    if (layer.feature.properties.NAME) {  // Only zoom and highlight claimed countries
      if (activeLayer) {
        activeLayer.setStyle(style(activeLayer.feature)); // Reset the previous active country style
      }
      layer.setStyle({
        weight: 5,
        color: '##282f3b',
        dashArray: '',
        fillOpacity: 0.7
      });
      setActiveLayer(layer); // Set current country as active
      map.fitBounds(layer.getBounds());
    }
  };
  const highlightFeature = (e) => {
    const layer = e.target;
    if (layer.feature.properties.NAME) {  // Only apply if the country is claimed
      layer.setStyle({
        weight: 2,
        color: '#282f3b',
        dashArray: '',
        fillOpacity: 0.7
      });
  
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
    }
  };
  
  const resetHighlight = (e) => {
    const layer = e.target;
    if (layer.feature.properties.NAME) {  // Only reset if the country is claimed
      geoJsonRef.current.resetStyle(layer);
    }
  };

  const style = (feature) => {
    const countryName = feature.properties.NAME;
    if (!countryName) {
      return {
        fillColor: "none", // Make unclaimed land transparent
        weight: 0, // No border for unclaimed land
        fillOpacity: 0
      };
    }
    const countryColor = countryColorMap[countryName];

    return {
      fillColor:
        countryColor ||
        (generateRandomColor()),
      weight: 1,
      opacity: 1,
      color: "white", 
      fillOpacity: 0.7,
    };
  };


  const onEachFeature = (feature, layer) => {

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });

    if (feature.properties.NAME) {
      // Country popup
      const countryInfo = `
        <div class="popup-content">
          <h3>${feature.properties.NAME}</h3>
          <p><b>Abbreviation:</b> ${feature.properties.ABBREVN}</p>
          <p><b>Subject:</b> ${feature.properties.SUBJECTO}</p>
        </div>
      `;
      layer.bindPopup(countryInfo, { minWidth: 300, maxWidth: 400 });
    
    } 
  };

  const ensurePolygonValidity = (polygon) => {
    if (polygon[0][0] !== polygon[0][polygon[0].length - 1]) {
      polygon[0].push(polygon[0][0]);
    }
    return polygon;
  };

  const getFontSize = (area) => {
    if (zoomLevel >= 7) return Math.max(10, Math.sqrt(area) / 200000);
    if (zoomLevel >= 5) return Math.max(10, Math.sqrt(area) / 300000);
    return Math.max(10, Math.sqrt(area) / 500000);
  };

  const addCountryLabels = (geoJsonData) => {
    if (!geoJsonData) return;

    const labeledCountries = new Set();
    const labels = geoJsonData.features.flatMap((feature) => {
      const countryName = feature.properties.NAME;
      if (countryName && !labeledCountries.has(countryName)) {
        const polygons = feature.geometry.type === "MultiPolygon" ? feature.geometry.coordinates : [feature.geometry.coordinates];
        labeledCountries.add(countryName);

        const largestPolygon = polygons.reduce((largest, polygon) => {
          const area = turf.area(turf.polygon(polygon));
          return area > largest.area ? { polygon, area } : largest;
        }, { polygon: null, area: 0 }).polygon;

        if (!largestPolygon) return [];


        const polygonFeature = turf.polygon(largestPolygon);
        const labelPosition = turf.pointOnSurface(polygonFeature);
        const area = turf.area(polygonFeature);
        const coordinates = labelPosition.geometry.coordinates;
        //console.log("Area:", countryName, area);
        const fontSize = getFontSize(area);
        //console.log("Font size:", fontSize);

        const visibilityThresholds = [
          { zoom: 7, area: 1e8},
          { zoom: 6, area: 1e9 },
          { zoom: 5, area: 1e10 },
          { zoom: 4, area: 1e11 },
          { zoom: 3, area: 1e12 },
          { zoom: 2, area: 5e12 },
        ];

        const isVisible = visibilityThresholds.some(threshold => zoomLevel >= threshold.zoom && area >= threshold.area);

        return (
          <Marker
            key={`${countryName}-${coordinates[0]}-${coordinates[1]}`}
            position={[coordinates[1], coordinates[0]]}
            icon={L.divIcon({
              className: `country-label ${isVisible ? '' : 'hidden'}`,
              html: `<div style="font-size: ${fontSize}px;">${countryName}</div>`,
              iconSize: [100, 40],
              iconAnchor: [50, 20]
            })}
          />
        );
      }
      return [];
    });
    setCountryLabels(labels.filter(label => label !== null));
  };

  return loading ? null : (
    <>
      <GeoJSON
        ref={geoJsonRef}
        key={year}
        data={geoJsonData}
        style={style}
        onEachFeature={onEachFeature}
      >
        {showCities && (
          <CityMarkers citiesData={citiesData} zoomLevel={zoomLevel} />
        )}
        {showEvents && (
          <EventsMarkers eventsData={eventsData} zoomLevel={zoomLevel} />
        )}
        {showFigures && (
          <FiguresMarkers figuresData={figuresData} zoomLevel={zoomLevel} />
        )}
      </GeoJSON>
      {countryLabels}
    </>
  );
};

export default WorldBordersGeoJSON;
