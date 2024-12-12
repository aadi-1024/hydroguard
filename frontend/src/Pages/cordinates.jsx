import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Cordinates = () => {
  const { coordinates } = useParams(); 
  const [data, setData] = useState(null); 
  const [error, setError] = useState(null);
  const [processData, setProcessData] = useState(null); // To store the response of /crops/process

  useEffect(() => {
    const handleLoad = async () => {
      try {
        console.log("Raw coordinates:", coordinates);
  
        // Remove "coordinates=" from the start of the parameter (if it's part of the URL)
        const coordinateString = coordinates.replace(/^coordinates=/, "");
        
        // Decode and parse the coordinate array
        const coordinateArray = JSON.parse(decodeURIComponent(coordinateString));
        console.log('Parsed coordinates:', coordinateArray);
  
        const payload = {
          coordinates: coordinateArray.map(coord => ({
            latitude: coord[0],
            longitude: coord[1]
          }))
        };
  
        // First request to /crops/init
        const response = await axios.post(
          'http://127.0.0.1:8080/crops/init', 
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log(response.data);
        setData(response.data); // Set data from /crops/init

        // Prepare crops data (this is just a placeholder, you should adjust this based on your logic)
        const crops = [
          {
            crop_type: "Rice", // Replace with dynamic data if available
            irrigation_type: "Flooded", // Replace with dynamic data if available
            land_cover: 50.5 // Replace with dynamic data if available
          },
          {
            crop_type: "Wheat", // Replace with dynamic data if available
            irrigation_type: "Drip", // Replace with dynamic data if available
            land_cover: 30.0 // Replace with dynamic data if available
          }
        ];

        // Request to /crops/process with token and crop data
        if (response.data && response.data.data?.token) {
          const processResponse = await axios.post(
            'http://127.0.0.1:8080/crops/process', 
            {
              token: response.data.data.token,
              rain: 120.5, // You should replace this with the actual rain data if available
              crops: crops
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
  
          console.log("Process Response:", processResponse.data);
          setProcessData(processResponse.data); // Set data from /crops/process
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };
  
    if (coordinates) {
      handleLoad(); 
    }
  }, [coordinates]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Coordinate Analysis</h2>
      {data ? (
        <div>
          <h3>Results from /crops/init:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <div>
            <p>Area: {data.data?.area}</p>
            <p>Token: {data.data?.token}</p>
            <p>Weather: {data.data?.weather}</p>
          </div>
        </div>
      ) : (
        <p>Loading coordinate data...</p>
      )}

      {processData ? (
        <div>
          <h3>Results from /crops/process:</h3>
          <pre>{JSON.stringify(processData, null, 2)}</pre>
          {/* Add specific data from processData to display as needed */}
        </div>
      ) : (
        <p>Loading crop processing data...</p>
      )}
    </div>
  );
}

export default Cordinates;
