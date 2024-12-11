import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper, Grid2 } from "@mui/material";
import "./dam.css";
import SessionsChart from "../components/sessionchart";
import { Grid } from "@mui/system";

const Dam = () => {
  const { damId } = useParams();
  const [damData, setDamData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waterCover, setWaterCover] = useState(null);
  const [volume, setVolume] = useState(null);
  const [sedimentation, setSediment] = useState(null);

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
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoad(); // Load data when the component mounts and damId is available
  }, []);

  return (

    <Box className="cont">
      <Box className="heading">
        <Typography className="heading2" variant="h3">
          {/* Govind Sagar Dam */}
        </Typography>
      </Box>
      {loading && <Typography>Loading...</Typography>}
      {/* {error && <Typography color="error">{error}</Typography>} */}

      {!loading && damData && waterCover && (
        <>
          {waterCover.length > 0 && <SessionsChart d={waterCover} order={waterCover[0] > waterCover[waterCover.length - 1] ? 'Increasing' : 'Decreasing'} h={150} w='97.5%' />}
          {volume.length > 0 && <SessionsChart d={volume} order={volume[0] > volume[volume.length - 1] ? 'Increasing' : 'Decreasing'} h={150} w='95%' />}
          {sedimentation.length > 0 && <SessionsChart d={sedimentation} order={sedimentation[0] > sedimentation[sedimentation.length - 1] ? 'Increasing' : 'Decreasing'} h={150} w='95%' />}
          <Box className="Boxy">
            <Paper className="dam-box" sx={{ borderRadius: "20px" }}>
              <Typography className="typography-title" variant="h6">
                Name:
              </Typography>
              <Typography className="typography-content">
                {damData.name || "N/A"}
              </Typography>
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
            <Paper className="dam-box" sx={{ borderRadius: "20px" }}>
              <Typography className="typography-title" variant="h6">
                GrossVolume:
              </Typography>
              <Typography className="typography-content">
                {damData.gross_volume || "N/A"}
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
    </Box>
  );
};

export default Dam;
