import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, CircularProgress, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Cordinates = () => {
  const { coordinates } = useParams();
  const [data, setData] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState('wheat');
  const [irrigationType, setIrrigationType] = useState('drip');
  const [landCover, setLandCover] = useState('');
  const [rain, setRain] = useState(''); 

  useEffect(() => {
    const handleLoad = async () => {
      try {
        setLoading(true);
        const coordinateString = coordinates.replace(/^coordinates=/, "");
        const coordinateArray = JSON.parse(decodeURIComponent(coordinateString));

        const payload = {
          coordinates: coordinateArray.map(coord => ({
            latitude: coord[0],
            longitude: coord[1]
          }))
        };

        console.log('Initial Payload:', payload); // Log the payload to ensure it's correct

        const initResponse = await axios.post('http://127.0.0.1:8080/crops/init', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Initial Response:', initResponse.data); // Log the response from the server
        setData(initResponse.data);
      } catch (error) {
        console.error('Error during initial load:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates) {
      handleLoad();
    }
  }, [coordinates]);

  const handleProcessSubmit = async () => {
    try {
      setLoading(true);
      const processPayload = {
        token: data?.data?.token,
        rain: parseFloat(rain) || 0, // Ensure it's a number
        crops: [
          {
            crop_type: cropType,
            irrigation_type: irrigationType,
            land_cover: parseFloat(landCover) || 0, // Ensure it's a number
          }
        ]
      };
  
      console.log('Process Payload:', processPayload); // Log the payload
  
      const processResponse = await axios.post('http://127.0.0.1:8080/crops/process', processPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      setProcessData(processResponse.data);
    } catch (error) {
      setError(error);
      console.error('Error during processing:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          Error: {error?.response?.data?.message || error?.message || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50vw',
      flexDirection: 'column',
      overflowY: 'auto',
      padding: 2,
      margin: '0 auto',
    }}>
      <Box sx={{ width: '100%', padding: 2 }}>
        <Typography variant="h4" sx={{ color: '#274C77', marginBottom: 3, textAlign: 'center' }}>
          Coordinate Analysis Results
        </Typography>

        {loading && !processData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#274C77' }} />
          </Box>
        ) : (
          <>
            {data && (
              <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3, marginBottom: 2 }}>
                <CardContent>
                  <Box >
                    <Typography variant="body1" sx={{ color: '#274C77' }}>
                      <strong>Area:</strong> {data.data?.area}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Box sx={{ marginBottom: 2 }}>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="crop-type-label">Crop Type</InputLabel>
                <Select
                  labelId="crop-type-label"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  label="Crop Type"
                >
                  <MenuItem value="wheat">Wheat</MenuItem>
                  <MenuItem value="rice">Rice</MenuItem>
                  <MenuItem value="corn">Corn</MenuItem>
                  <MenuItem value="barley">Barley</MenuItem>
                  <MenuItem value="millet">Millet</MenuItem>
                  <MenuItem value="potato">Potato</MenuItem>
                  <MenuItem value="cotton">Cotton</MenuItem>
                  <MenuItem value="sugarcane">Sugarcane</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="irrigation-type-label">Irrigation Type</InputLabel>
                <Select
                  labelId="irrigation-type-label"
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  label="Irrigation Type"
                >
                  <MenuItem value="drip">Drip</MenuItem>
                  <MenuItem value="flood">Flood</MenuItem>
                  <MenuItem value="sprinkler">Sprinkler</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Land Cover"
                type="number"
                value={landCover}
                onChange={(e) => setLandCover(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              <TextField
                fullWidth
                label="Rain (mm)"
                type="number"
                value={rain}
                onChange={(e) => setRain(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              <Button
                variant="contained"
                color="primary"
                sx={{ padding: '10px 20px', borderRadius: 3, bgcolor: '#274C77' }}
                onClick={handleProcessSubmit}
              >
                Submit
              </Button>
            </Box>

            {processData && (
              <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#274C77', marginBottom: 2 }}>
                    Results from /crops/process:
                  </Typography>

                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body1" sx={{ color: '#274C77' }}>
                      <strong>Water Requirement:</strong> {processData.data?.crop_water_requirement}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#274C77' }}>
                      <strong>Water Configuration:</strong> {processData.data?.water_given_config}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#274C77' }}>
                      <strong>Optimal Water Usage:</strong> {processData.data?.optimal_water_usage}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#274C77' }}>
                      <strong>Suggestions:</strong> {processData.data?.suggestions}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#274C77' }}>
                      <strong>Configuration Error:</strong> {processData.data?.config_errors}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3, padding: '10px 20px', borderRadius: 3, display: 'block', margin: '20px auto', bgcolor: '#274C77' }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default Cordinates;
