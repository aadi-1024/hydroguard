import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Cordinates = () => {
  const { cordinates } = useParams(); 
  const [data, setData] = useState(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleLoad = async () => {
      try {
      
        const coordinateArray = JSON.parse(decodeURIComponent(cordinates));
      
        const payload = {
          coordinates: coordinateArray.map(coord => ({
            latitude: coord[0],
            longitude: coord[1]
          }))
        };


        const response = await axios.post(
          'http://127.0.0.1:8080/crops/init', 
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(response.data)
        setData(response.data);
      } 
      catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };

    if (cordinates) {
      handleLoad(); 
    }
  }, [cordinates]); 

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Coordinate Analysis</h2>
      {data ? (
        <div>
          <h3>Results:</h3>
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
       </div>
  );
}

export default Cordinates;