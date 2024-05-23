import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./MapPage.css";
import Map from "../../components/map/Map";
import { useNavigate } from 'react-router-dom';
import TimelineComponent from "../../components/map/Utils/TimelineComponent"
import { FaLayerGroup, FaHome, FaCity, FaHistory, FaUser } from "react-icons/fa";
import { MdHistoryEdu } from "react-icons/md";
import { GiCaesar, GiGreekTemple, GiOpenBook  } from "react-icons/gi";

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

  const handleLayerChange = (layer) => {
    setCurrentLayer(layer);
    if (layer === layers.POLITICAL) {
      setShowPoliticalOptions(!showPoliticalOptions);
    } else {
      setShowPoliticalOptions(false);  // Close the political options if another layer is selected
    }
  };

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
          <h2>Map Layers</h2>
          <div className="layer-options">
          <div className={`layer-item political ${currentLayer === layers.POLITICAL ? 'active' : ''}`} onClick={() => handleLayerChange(layers.POLITICAL)}>
              <span className="layer-name">Political</span>
            </div>
            {showPoliticalOptions && (
              <div className="map-page-submenu">
                <button className={`map-submenu-icon-button ${showCities ? 'active' : ''}`} onClick={() => setShowCities(!showCities)} title="Show Cities">
                  <GiGreekTemple />
                </button>
                <button className={`map-submenu-icon-button ${showEvents ? 'active' : ''}`} onClick={() => setShowEvents(!showEvents)} title="Show Events">
                  <GiOpenBook />
                </button>
                <button className={`map-submenu-icon-button ${showFigures ? 'active' : ''}`} onClick={() => setShowFigures(!showFigures)} title="Show Figures">
                  <GiCaesar />
                </button>
              </div>
            )}
            <div className={`layer-item cultural ${currentLayer === layers.CULTURAL ? 'active' : ''}`} onClick={() => handleLayerChange(layers.CULTURAL)}>
              <span className="layer-name">Cultural</span>
            </div>
            <div className={`layer-item religious ${currentLayer === layers.RELIGIOUS ? 'active' : ''}`} onClick={() => handleLayerChange(layers.RELIGIOUS)}>
              <span className="layer-name">Religious</span>
            </div>
            <div className={`layer-item population ${currentLayer === layers.POPULATION_DENSITY ? 'active' : ''}`} onClick={() => handleLayerChange(layers.POPULATION_DENSITY)}>
              <span className="layer-name">Population</span>
            </div>
          </div>
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
