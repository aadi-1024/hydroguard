/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, Paper, Button } from "@mui/material";
import "./dam.css";
import SessionsChart from "../components/sessionchart";
import { useLocation } from "react-router-dom"; 

const Dam = () => {
  const { damId } = useParams();
  const navigate = useNavigate();  // Initialize useNavigate
  const [damData, setDamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waterCover, setWaterCover] = useState(null);
  const [volume, setVolume] = useState(null);
  const [sedimentation, setSediment] = useState(null);
  const location = useLocation();
  const { processData } = location.state || {};

  const handleLoad = async () => {
    try {
      console.log(`Fetching data for damId: ${damId}`);
      const response = await axios.get(`http://127.0.0.1:8080/dam/${damId}`);
      setDamData(response.data.data);

      console.log(`Fetching analysis for dam`);
      let res = await axios.get(`http://127.0.0.1:8080/dam/analysis/${damId}`);
      console.log(res.data);
      let x = res.data.data.map((i) => i.water_cover);

      if (x.length == 0) {
        const res = await axios.post(`http://127.0.0.1:8080/dam/analysis/${damId}`);
        if (res.status != 200) {
          console.log(res.data)
        }
      }

      res = await axios.get(`http://127.0.0.1:8080/dam/analysis/${damId}`);
      x = res.data.data.map((i) => i.water_cover);
      setVolume(res.data.data.map((i) => i.live_volume));
      setSediment(res.data.data.map((i) => i.sedimentation));
      setWaterCover(x);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  // Function to handle the navigation to cordid/:id
  const handleNavigate = () => {
    navigate(`/cordid/${damId}`);
  };

  return (
    <Box className="cont">
      {/* Button to navigate to cordid/:id placed at the top right */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNavigate}
        >
          Go to Cordid
        </Button>
      </Box>

      <Box className="heading">
        <Typography className="heading2" variant="h3">
          {/* Govind Sagar Dam */}
        </Typography>
      </Box>
      {loading && <Typography>Loading...</Typography>}

      {!loading && damData && waterCover && (
        <>
          <Box sx={{display:"flex", alignItems:'center', flexWrap:"wrap", width:"55vw", gap:'1vw'}}> 
            {waterCover.length > 0 && <SessionsChart d={waterCover} order={waterCover[0] > waterCover[waterCover.length - 1] ? 'Increasing' : 'Decreasing'} h={150} w='52vw' position='center' />}
            {volume.length > 0 && <SessionsChart d={volume} order={volume[0] > volume[volume.length - 1] ? 'Increasing' : 'Decreasing'} h={150} w='23vw' />}
            {sedimentation.length > 0 && <SessionsChart d={sedimentation} order={sedimentation[0] > sedimentation[sedimentation.length - 1] ? 'Increasing' : 'Decreasing'} h={150} w='28vw' />}
          </Box>
          <Box className="Boxy">
            <Paper className="dam-box" sx={{ borderRadius: "20px" }}>
              <Typography className="typography-title" variant="h6">
                Name:
              </Typography>
              <Typography className="typography-content">
                {damData.name || "N/A"}
              </Typography>
              <Typography className="typography-title" variant="h6">
                GrossVolume:
              </Typography>
              <Typography className="typography-content">
                {damData.gross_volume || "N/A"}
              </Typography>
            </Paper>
            <Paper className="dam-box" sx={{ borderRadius: "20px" }}>
              <Typography className="typography-title" variant="h6">
                Latitude:
              </Typography>
              <Typography className="typography-content">
                {damData.latitude || "N/A"}
              </Typography>
              <Typography className="typography-title" variant="h6">
                Longitude:
              </Typography>
              <Typography className="typography-content">
                {damData.longitude || "N/A"}
              </Typography>
            </Paper>
          </Box>

          <Box className="Boxy">
            <Paper className="dam-box" sx={{ borderRadius: "20px" }}>
              <Typography className="typography-title" variant="h6">
                Mean Depth:
              </Typography>
              <Typography className="typography-content">
                {damData.mean_depth || "N/A"}
              </Typography>
            </Paper>
            <Paper className="dam-box" sx={{ borderRadius: "20px" }}>
              <Typography className="typography-title" variant="h6">
                Status:
              </Typography>
              <Typography className="typography-content">
                {damData.status || "N/A"}
              </Typography>
              <Typography className="typography-title" variant="h6">
                Last Maintenance:
              </Typography>
              <Typography className="typography-content">
                {damData.last_maintenance || "N/A"}
              </Typography>
            </Paper>
          </Box>
        </>
      )}

      {!loading && !damData && (
        <Typography>No data available for the selected dam.</Typography>
      )}

      <Box sx={{ padding: 2 }}>
        {/* Display results if they exist */}
        {processData && (
          <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#274C77", marginBottom: 2 }}>
                Results from /crops/process:
              </Typography>

              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body1" sx={{ color: "#274C77" }}>
                  <strong>Water Requirement:</strong> {processData.data?.crop_water_requirement}
                </Typography>
                <Typography variant="body1" sx={{ color: "#274C77" }}>
                  <strong>Water Configuration:</strong> {processData.data?.water_given_config}
                </Typography>
                <Typography variant="body1" sx={{ color: "#274C77" }}>
                  <strong>Optimal Water Usage:</strong> {processData.data?.optimal_water_usage}
                </Typography>
                <Typography variant="body1" sx={{ color: "#274C77" }}>
                  <strong>Suggestions:</strong> {processData.data?.suggestions}
                </Typography>
                <Typography variant="body1" sx={{ color: "#274C77" }}>
                  <strong>Configuration Error:</strong> {processData.data?.config_errors}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Dam;
