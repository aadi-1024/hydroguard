import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, CircularProgress } from '@mui/material';

const Cordinates = () => {
  const { coordinates } = useParams();
  const [data, setData] = useState(null);
  const [processData, setProcessData] = useState(null); // State to store the second request's data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      try {
        setLoading(true);
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

        // First request to '/crops/init'
        const initResponse = await axios.post(
          'http://127.0.0.1:8080/crops/init', 
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(initResponse.data);
        setData(initResponse.data);

        // Second request to '/crops/process' with the received token
        const cropsData = [
          {
            crop_type: 'wheat',
            irrigation_type: 'drip',
            land_cover: 0.7
          },
          {
            crop_type: 'rice',
            irrigation_type: 'flood',
            land_cover: 0.9
          }
        ];

        const processPayload = {
          token: initResponse.data.data?.token, // Use the token received from the first request
          rain: 200, // Example rainfall value, adjust based on your needs
          crops: cropsData
        };

        const processResponse = await axios.post(
          'http://127.0.0.1:8080/crops/process', 
          processPayload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(processResponse.data);
        setProcessData(processResponse.data); // Set the second request's data
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates) {
      handleLoad();
    }
  }, [coordinates]);

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50vw',  // Adjusted to 50% of the viewport width
      flexDirection: 'column',
      overflowY: 'auto',
      padding: 2,
      margin: '0 auto',
    }}>
      <Box sx={{ width: '100%', padding: 2 }}>
        <Typography variant="h4" sx={{ color: '#274C77', marginBottom: 3, textAlign: 'center' }}>
          Coordinate Analysis
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#274C77' }} />
          </Box>
        ) : data ? (
          <>
            <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3, marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#274C77', marginBottom: 2 }}>
                  Results from /crops/init:
                </Typography>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body1" sx={{ color: '#274C77' }}>
                    <strong>Area:</strong> {data.data?.area}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#274C77' }}>
                    <strong>Token:</strong> {data.data?.token}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#274C77' }}>
                    <strong>Weather:</strong> {data.data?.weather}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Display results from the second request */}
            {processData && (
              <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#274C77', marginBottom: 2 }}>
                    Results from /crops/process:
                  </Typography>
                  <pre>{JSON.stringify(processData, null, 2)}</pre>
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body1" sx={{ color: '#274C77' }}>
                      <strong>Processed Data:</strong> {processData?.result}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Typography variant="body1" sx={{ color: '#274C77' }}>
            Loading coordinate data...
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3, padding: '10px 20px', borderRadius: 3, display: 'block', margin: '20px auto',bgcolor:'#274C77' }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
}

export default Cordinates;
