import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

const PopulationDensityLayer = ({ year }) => {
    const [geoJsonData, setGeoJsonData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/geojson/population_density_${year}.geojson`);
                const data = await response.json();
                setGeoJsonData(data);
            } catch (error) {
                console.error('Error fetching population density data:', error);
            }
        };

        fetchData();
    }, [year]);

    const densityStyle = (feature) => {
        return {
            fillColor: getDensityColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    // Function to determine color based on population density
    const getDensityColor = (density) => {
        return density > 1000 ? '#800026' :
               density > 500  ? '#BD0026' :
               density > 200  ? '#E31A1C' :
               density > 100  ? '#FC4E2A' :
               density > 50   ? '#FD8D3C' :
               density > 20   ? '#FEB24C' :
               density > 10   ? '#FED976' :
                                '#FFEDA0';
    };

    return geoJsonData ? (
        <GeoJSON 
            data={geoJsonData} 
            style={densityStyle}
        />
    ) : null;
};

export default PopulationDensityLayer;
