import { useState, useParams, useEffect } from 'react'
import axios from 'axios'

const Cordinates = () => {
  const { cordinates } = useParams(); 
  const [data, setData] = useState(null); 

  useEffect(() => {
    const handleLoad = async () => {
      try {
        const coordinateArray = JSON.parse(cordinates); // Assuming coordinates are passed as a stringified array
        const responses = await Promise.all(coordinateArray.map(async (coordinate) => {
          const response = await axios.get(`http//127.0.0.1/crop/init/${coordinate}`); 
          return response.data;
        }));

        setData(responses);
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    };

    if (cordinates) {
      handleLoad(); 
    }
  }, [cordinates]); 
  return (
    <div>
      {data ? (
        <div>
          {/* Render data for each coordinate */}
          {data.map((item, index) => (
            <div key={index}>
              {/* Render each response here */}
              <p>{item}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Cordinates;
