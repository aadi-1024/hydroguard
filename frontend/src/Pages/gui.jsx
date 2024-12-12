import { MapContainer, TileLayer, GeoJSON, Marker, Popup, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import indiaGeoJson from "../assets/akhandbharat.json";
import indiaStatesGeoJson from "../assets/chal.json";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "./gui.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Gui = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [polygonSelected, setPolygonSelected] = useState(false);
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

  const indiaBounds = [
    [11.462, 68.174],
    [35.676, 97.395],
  ];
  const navigate = useNavigate();

  const fetchCoordinates = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/dam");

      if (Array.isArray(response.data.data)) {
        const coords = response.data.data.map((dam) => ({
          latitude: dam.latitude,
          longitude: dam.longitude,
          name: dam.name,
          damId: dam.id,
        }));
        setCoordinates(coords);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handlePolygonCreated = (e) => {
    const layer = e.layer; // Access the drawn polygon
    if (layer instanceof L.Polygon) {
      const latLngs = layer.getLatLngs()[0]; // Get the coordinates of the polygon
      const coordinates = latLngs.map((latLng) => [latLng.lat, latLng.lng]);
      setPolygonCoordinates(coordinates);
      setPolygonSelected(true);
      // console.log("Polygon Coordinates:", coordinates);
    }
  };

  const handleNavigate = () => {
    navigate(`/polygon/${encodeURIComponent(JSON.stringify(polygonCoordinates))}`);
  };

  return (
    <div className="bgmap">
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
          <GeoJSON className="ind" data={indiaGeoJson} sx={{ fillColor: "rgb(51, 26, 109);" }} />
          <GeoJSON
            className="states"
            data={indiaStatesGeoJson}
            onEachFeature={(feature, layer) =>
              layer.on({
                click: (e) => {
                  const bounds = e.target.getBounds();
                  console.log("State clicked. Bounds:", bounds);
                  e.target._map.fitBounds(bounds, { padding: [50, 50] });
                },
              })
            }
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
                <strong>{coord.name}</strong>
                <br />
                Coordinates: {coord.latitude}, {coord.longitude}
              </Popup>
            </Marker>
          ))}
          
          <button
            style={{
              position: "absolute",
              top: "18px",
              right: "40px",
              backgroundColor: "#274C77",
              color: "white",
              border: "none",
              padding: "13px 13px",
              cursor: "pointer",
              width:'12vw',
              borderRadius: "5px",
              zIndex: 1000,
            }}
            onClick={fetchCoordinates}
          >
            Get Coordinates
          </button>
          
          {/* FeatureGroup for Drawing */}
          <FeatureGroup>
            <EditControl
              onCreated={handlePolygonCreated}
              draw={{
                rectangle: false,
                circle: false,
                marker: false,
                polyline: false,
                circlemarker: false,
                polygon: {
                  allowIntersection: false, // Prevent self-intersecting polygons
                  shapeOptions: {
                    color: "yellow",
                  },
                },
              }}
            
            />
          </FeatureGroup>
          {polygonSelected && (
          <button
            style={{
              position: "absolute",
              top: "10vh",
              right: "40px",
              width:'12vw',
              backgroundColor: "#274C77",
              color: "white",
              border: "none",
              padding: "13px 13px",
              cursor: "pointer",
              borderRadius: "5px",
              zIndex: 1000,
            }}
            onClick={handleNavigate}
          >
            View Polygon Details
          </button>
        )}
         
        </MapContainer>

        

        {polygonCoordinates.length > 0 && (
          <div>
            <h3 style={{color:'#274C77'}}>Polygon Coordinates:</h3>
            <ul >
              {polygonCoordinates.map((coord, index) => (
                <li key={index} style={{color:'#274C77'}}>
                  {coord[0]}, {coord[1]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gui;
