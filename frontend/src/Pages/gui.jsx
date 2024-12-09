import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import indiaGeoJson from '../assets/india.json'; 
import indiaStatesGeoJson from '../assets/indian-states.json'; 
import L from 'leaflet';
import './gui.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Gui = () => {

  const [coordinates, setCoordinates] = useState([]); 
  const worldBounds = [
    [-90, -180], 
    [-90, 180],  
    [100, 180],   
    [100, -180],  
    [-90, -180],  
  ];

  const styleMask = {
    fillColor: "rgb(227, 235, 238)", 
    color: "#000",     
    fillOpacity: 1,
    weight: 0,
  };

  const mask = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            worldBounds, 
            ...indiaGeoJson.features.flatMap((f) =>
              f.geometry.type === "Polygon"
                ? f.geometry.coordinates
                : f.geometry.coordinates.flat() 
            ),
          ],
        },
      },
    ],
  };

  const onStateClick = (event) => {
    const bounds = event.target.getBounds();
    console.log("State clicked. Bounds: ", bounds); 
    event.target._map.fitBounds(bounds, { padding: [50, 50] }); 
  };

  const onEachState = (feature, layer) => {
    console.log("Feature:", feature); 
    layer.on({
      click: onStateClick, 
    });
  };

  const indiaBounds = [
    [6.462, 68.174], 
    [35.676, 97.395] 
  ];
 
 
  const navigate = useNavigate(); 
 

  const fetchCoordinates = async () => {
    try {
      const response = await axios.get('http://0.0.0.0:8080/dam'); 
      
      if (Array.isArray(response.data.data)) {
        const coords = response.data.data.map(dam => ({
          latitude: dam.latitude,
          longitude: dam.longitude,
          name: dam.name,
          damId:dam.id
        }));
        setCoordinates(coords); 
      } 
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  return (
    <div className='bgmap'>
      <div className="map">
        <MapContainer
          center={[22.5937, 82.9629]} 
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          maxBounds={L.latLngBounds(indiaBounds)} 
          maxBoundsViscosity={1.0} 
          minZoom={5} 
          maxZoom={10} 
          zoomControl={true} 
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <GeoJSON data={mask} style={styleMask} />
          <GeoJSON className="ind" data={indiaGeoJson} />
          <GeoJSON 
            className="states" 
            data={indiaStatesGeoJson} 
            onEachFeature={onEachState} 
          />
          
          {coordinates.map((coord, index) => (
  <Marker
    key={index}
    position={[coord.latitude, coord.longitude]}
    eventHandlers={{
      click: () => navigate(`/dam/${coord.damId}`), 
      mouseover: (e) => {
        e.target.openPopup();
      },
      mouseout: (e) => {
        e.target.closePopup();
      },
    }}
  >
    <Popup>
      <strong>{coord.name}</strong><br />
      Coordinates: {coord.latitude}, {coord.longitude}
    </Popup>
  </Marker>
))}
       <button
          style={{
            position: 'absolute',
            top: '18px',
            right: '60px',
            backgroundColor: '#274C77',
            color: 'white',
            border: 'none',
            padding: '13px 13px',
            cursor: 'pointer',
            borderRadius: '5px',
            zIndex: 1000
          }}
          onClick={fetchCoordinates}
        >
          Get Coordinates
        </button>

        </MapContainer>
        
    
       
      </div>
    </div>
  );
};

export default Gui;