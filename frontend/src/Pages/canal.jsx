import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container } from '@mui/material';

const CanalForm = () => {
  const [canalData, setCanalData] = useState({
    qe: '',
    width: '',
    soilType: '',
    canalArea: '',
    canalType: '',
    canalDepth: '',
    canalLength: '',
  });

  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCanalData({ ...canalData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert inputs to the appropriate type (e.g., float32 for numeric values)
    const dataToSend = {
      qe: parseFloat(canalData.qe) || undefined,
      width: parseFloat(canalData.width) || undefined,
      soil_type: canalData.soilType || undefined,
      canal_area: parseFloat(canalData.canalArea) || undefined,
      canal_type: canalData.canalType || undefined,
      canal_depth: parseFloat(canalData.canalDepth) || undefined,
      canal_length: parseFloat(canalData.canalLength) || undefined,
    };

    try {
      // Send request to backend
      const response = await axios.post('http://127.0.0.1:8080/canal', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResponseData(response.data); // Store the response
    } catch (error) {
      console.error('Error submitting data:', error);
      setResponseData({ error: 'There was an error with the request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ marginBottom: 3, color: '#274C77' }}>
          Canal Information
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              fullWidth
              label="Qe"
              name="qe"
              value={canalData.qe}
              onChange={handleChange}
              type="number"
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              fullWidth
              label="Width"
              name="width"
              value={canalData.width}
              onChange={handleChange}
              type="number"
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              fullWidth
              label="Soil Type"
              name="soilType"
              value={canalData.soilType}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              fullWidth
              label="Canal Area"
              name="canalArea"
              value={canalData.canalArea}
              onChange={handleChange}
              type="number"
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              fullWidth
              label="Canal Type"
              name="canalType"
              value={canalData.canalType}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              fullWidth
              label="Canal Depth"
              name="canalDepth"
              value={canalData.canalDepth}
              onChange={handleChange}
              type="number"
              variant="outlined"
              margin="normal"
            />
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              fullWidth
              label="Canal Length"
              name="canalLength"
              value={canalData.canalLength}
              onChange={handleChange}
              type="number"
              variant="outlined"
              margin="normal"
            />
          </Box>

          <Box sx={{ marginTop: 1 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ padding: '10px 20px', borderRadius: 3, backgroundColor: '#274C77' }}
            >
              Submit
            </Button>
          </Box>
        </form>

        {/* Show output below the form */}
        {loading && <Typography variant="h6">Submitting...</Typography>}

        {responseData && !loading && (
          <Box sx={{ marginTop: 4 }}>
            {responseData.error ? (
              <Typography color="error">{responseData.error}</Typography>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'left' }}>
                <strong>Response from backend:</strong>
                <pre>{JSON.stringify(responseData, null, 2)}</pre>
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CanalForm;
