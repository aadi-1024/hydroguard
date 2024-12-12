import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, CircularProgress, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Cordinates = () => {
  const { damId } = useParams();
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [data, setData] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState([{
    crop_type: 'wheat',
    irrigation_type: 'drip',
    land_cover: '',
    rain: ''
  }]);

  // Shared inputs
  const [soilType, setSoilType] = useState('');
  const [rain, setRain] = useState('');
  const [canalArea, setCanalArea] = useState('');
  const [depth, setDepth] = useState('');
  const [qe, setQe] = useState('');
  const [canalType, setCanalType] = useState('');

  useEffect(() => {
    const handleLoad = async () => {
      try {
        const initResponse = await axios.post('http://127.0.0.1:8080/crops/init', {
          dam_id: Number(damId)
        });
        setData(initResponse.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    console.log(damId)

    if (damId) {
      handleLoad();
    }
  }, [damId]);

  const handleProcessSubmit = async () => {
    try {
      setLoading(true);
      const processPayload = {
        token: data?.data?.token,
        rain: parseFloat(rain),
        crops: crops.map(crop => ({
          crop_type: crop.crop_type,
          irrigation_type: crop.irrigation_type,
          land_cover: Number(crop.land_cover),
        }))
      };

      const processResponse = await axios.post('http://127.0.0.1:8080/crops/process', processPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setProcessData(processResponse.data);

      // Navigate to the same route with process data as state
      navigate(`/dam/${damId}`, { state: { processData: processResponse.data } });

    } catch (error) {
      setError(error);
      console.error('Error during processing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = () => {
    setCrops([...crops, { crop_type: 'wheat', irrigation_type: 'drip', land_cover: '', rain: '' }]);
  };

  const handleChangeCrop = (index, field, value) => {
    const newCrops = [...crops];
    newCrops[index][field] = value;
    setCrops(newCrops);
  };

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          Error: {error?.response?.data?.message || error.message}
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
                  <Box>
                    <Typography variant="body1" sx={{ color: '#274C77', margin: '10px' }}>
                      <strong>Area:</strong> {data.data?.area}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#274C77', margin: '10px' }}>
                      <strong>Token:</strong> {data.data?.token}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Shared Inputs */}
            <Box sx={{ marginBottom: 2 }}>
              {/* <TextField
                fullWidth
                label="Soil Type"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                sx={{ marginBottom: 2 }}
              /> */}
              <TextField
                fullWidth
                label="Rain"
                type="number"
                value={rain}
                onChange={(e) => setRain(e.target.value)}
                sx={{ marginBottom: 2 }}/>
              {/* <TextField
                fullWidth
                label="Canal Area"
                type="number"
                value={canalArea}
                onChange={(e) => setCanalArea(e.target.value)}
                sx={{ marginBottom: 2 }}
              /> */}
              {/* <TextField
                fullWidth
                label="Depth"
                type="number"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                sx={{ marginBottom: 2 }}
              /> */}
              {/* <TextField
                fullWidth
                label="Qe"
                type="number"
                value={qe}
                onChange={(e) => setQe(e.target.value)}
                sx={{ marginBottom: 2 }}
              /> */}
              {/* <TextField
                fullWidth
                label="Canal Type"
                value={canalType}
                onChange={(e) => setCanalType(e.target.value)}
                sx={{ marginBottom: 2 }}
              /> */}
            </Box>

            {/* Form for multiple crops */}
            {crops.map((crop, index) => (
              <Box sx={{ marginBottom: 2 }} key={index}>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id={`crop-type-label-${index}`}>Crop Type</InputLabel>
                  <Select
                    labelId={`crop-type-label-${index}`}
                    value={crop.crop_type}
                    onChange={(e) => handleChangeCrop(index, 'crop_type', e.target.value)}
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
                  <InputLabel id={`irrigation-type-label-${index}`}>Irrigation Type</InputLabel>
                  <Select
                    labelId={`irrigation-type-label-${index}`}
                    value={crop.irrigation_type}
                    onChange={(e) => handleChangeCrop(index, 'irrigation_type', e.target.value)}
                    label="Irrigation Type"
                  >
                    <MenuItem value="drip">Drip</MenuItem>
                    <MenuItem value="flood">Flood</MenuItem>
                    <MenuItem value="sprinkler">Sprinkler</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Crop Land Cover"
                  type="number"
                  value={crop.land_cover}
                  onChange={(e) => handleChangeCrop(index, 'land_cover', e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
              </Box>
            ))}

            <Button
              variant="contained"
              color="primary"
              sx={{ padding: '10px 20px', borderRadius: 3, bgcolor: '#274C77', marginBottom: 2 }}
              onClick={handleAddCrop}
            >
              + Add Crop
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ padding: '10px 20px', borderRadius: 3, bgcolor: '#274C77', marginBottom: 2, marginLeft: 2 }}
              onClick={handleProcessSubmit}
            >
              Submit
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Cordinates;
