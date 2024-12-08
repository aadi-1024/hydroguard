import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import indiaGeoJson from '../assets/india.json'; 
import indiaStatesGeoJson from '../assets/indian-states.json'; 
import L from 'leaflet';
import './gui.css';

const Gui = () => {

  const worldBounds = [
    [-90, -180], // Southwest corner of the world
    [-90, 180],  // Southeast corner of the world
    [100, 180],   // Northeast corner of the world
    [100, -180],  // Northwest corner of the world
    [-90, -180],  // Close the rectangle
  ];

  const styleMask = {
    fillColor: "rgb(243, 240, 240)", 
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
    event.target._map.fitBounds(bounds, { padding: [50, 50] }); // Zoom into the state with some padding
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
      </MapContainer>
    </div>
    </div>
  );
};

export default Gui;
