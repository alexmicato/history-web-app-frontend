import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./MapPage.css";
import Map from "../../components/map/Map";
import { useNavigate } from 'react-router-dom';
import TimelineComponent from "../../components/map/Utils/TimelineComponent"
import { FaLayerGroup } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

const years = [
  -123000, -10000, -8000, -5000, -4000, -3000, -2000, -1500, -1000, -700, -500,
  -400, -323, -300, -200, -100, -1, 100, 200, 300, 400, 500, 600, 700, 800, 900,
  1000, 1100, 1200, 1279, 1300, 1400, 1492, 1500, 1530, 1600, 1650, 1700, 1715,
  1783, 1800, 1815, 1880, 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000,
  2010,
];

const layers = {
  POLITICAL: "political",
  CULTURAL: "cultural",
  RELIGIOUS: "religious",
  POPULATION_DENSITY: "populationDensity",

};

const MapPage = () => {

  const navigate = useNavigate();

  const navigateToMain = () => navigate('/main');

  const [currentYear, setCurrentYear] = useState(1650);
  const [currentLayer, setCurrentLayer] = useState(layers.POLITICAL);
  const [showPoliticalOptions, setShowPoliticalOptions] = useState(false);
  const [showCulturalOptions, setShowCulturalOptions] = useState(false);
  const [showEvents, setShowEvents] = useState(false); 
  const [showFigures, setShowFigures] = useState(false); 
  const [showCities, setShowCities] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  

  const handleYearChange = (year) => setCurrentYear(year);

  const handleLayerChange = (layer) => setCurrentLayer(layer);

  return (
    <div className="map-page-container">
      <div className="map-page-icon-container">
        <button className="map-page-icon-button" onClick={()=>navigate('/main')} title="Home">
          <div>
            <FaHome/>
          </div>
        </button>
        <button className="map-page-icon-button" onClick={() => setShowSidebar(!showSidebar)} title="Layers">
          <div>
            <FaLayerGroup />
          </div>
        </button>
      </div>
      {showSidebar && (
        <div className="sidebar">
          <button className="back-button" onClick={navigateToMain}>Back to Main</button>
          <h2>Layers</h2>
          <div className="layer-options">
            <button onClick={() => setShowPoliticalOptions(!showPoliticalOptions)}>Political Map</button>
            {showPoliticalOptions && (
              <div className="submenu">
                <label>
                  <input type="checkbox" checked={showCities} onChange={(e) => setShowCities(e.target.checked)} /> Cities
                </label>
                <label>
                  <input type="checkbox" checked={showEvents} onChange={(e) => setShowEvents(e.target.checked)} /> Historical Events
                </label>
                <label>
                  <input type="checkbox" checked={showFigures} onChange={(e) => setShowFigures(e.target.checked)} /> Historical Figures
                </label>
              </div>
            )}
          </div>
          <div className="layer-options">
            <button onClick={() => setShowCulturalOptions(!showCulturalOptions)}>Cultural Maps</button>
            {showCulturalOptions && (
              <div className="submenu">
                <label>
                  <input type="checkbox" onChange={() => handleLayerChange(layers.CULTURAL)} /> Culture
                </label>
                <label>
                  <input type="checkbox" onChange={() => handleLayerChange(layers.LANGUAGE)} /> Language
                </label>
              </div>
            )}
          </div>
          {/* Add more layers as needed */}
        </div>
      )}
      <div className="timeline-wrapper">
        <TimelineComponent 
          years={years} 
          currentYear={currentYear} 
          onYearChange={handleYearChange} />
      </div>
      <div className="map-container">
        <Map year={currentYear} layer={currentLayer} showCities={showCities} showEvents={showEvents} showFigures={showFigures} />
      </div>
    </div>
  );
}

export default MapPage;
