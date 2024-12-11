
import { PageContainer } from '@toolpad/core/PageContainer';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useDemoRouter } from '@toolpad/core/internal';
import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import Headerimage from '../assets/headerimage.jpg';
import './home.css';

export default function BasicPageContainer() {
  const router = useDemoRouter('/orders');
  const theme = useTheme();

  return (
    <AppProvider router={router} theme={theme}>
      <Paper sx={{ width: '100%' , paddingLeft: '25%'}}>
        <PageContainer>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <Typography variant="h4" className="mainheading">
                Welcome to the HydroGuard
              </Typography>
            </Grid>
            <Grid xs={12}>
              <img src={Headerimage} alt="Header" className="header-image" />
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" className="subheading" sx={{ fontWeight: 'bold' }}>
                Transforming Dam and Reservoir Management
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography className="simpletext">
                HydroGuard is a cutting-edge platform designed to ensure the safety, efficiency, and sustainability of dams and reservoirs in the face of evolving challenges. With decades-old infrastructure now facing unprecedented pressures from climate change, population growth, and shifting agricultural practices, HydroGuard delivers advanced solutions to protect and optimize water resources.
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" className="subheading" sx={{ fontWeight: 'bold' }}>
                The Challenges We Address
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography className="simpletext">
                <br /><Typography className="subheading" sx={{ fontWeight: 'bold' }}>
                Aging Infrastructure
              </Typography>
                Many dams and reservoirs were built decades ago, with designs that no longer align with current needs and environmental realities. Over time, silting, structural stress, and inefficiencies in water storage have become critical issues.<br /><br />
                
                
                <Typography className="subheading" sx={{ fontWeight: 'bold' }}>
                Climate Change Impact<br />
              </Typography>
                Adverse climatic changes exacerbate water stress, increase the risk of structural failures, and alter hydrological patterns, requiring re-evaluation of dam operations.<br /><br />
                <Typography className="subheading" sx={{ fontWeight: 'bold' }}>
                Shifting Agricultural Practices<br />
              </Typography>
                
                Evolving agricultural needs, new cropping patterns, and technological advancements in farming demand a dynamic approach to water allocation and management.<br /><br />
                
                <Typography className="subheading" sx={{ fontWeight: 'bold' }}>
                Resource Inefficiencies<br /><br />
              </Typography>
                
                The command areas of dams are shifting due to insufficient water storage and outdated infrastructure, leading to suboptimal water distribution and environmental challenges.
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" className="subheading" sx={{ fontWeight: 'bold' }}>
                The HydroGuard Solution
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography className="simpletext">
              <Typography className="subheading" sx={{ fontWeight: 'bold' }}>
              Real-Time Monitoring<br />
              </Typography>
                
                We provide live data on water pressure, structural health, and environmental variables to detect risks early and enable proactive management.<br /><br />
                Decision Support System for Water Management<br />
                Empowering water managers and policy-makers with predictive insights to optimize water allocation and distribution.<br /><br />
                Planning for New Dams<br />
                HydroGuard offers innovative planning tools for future dam construction, incorporating advanced hydrological models and sustainability assessments.<br /><br />
                AI-Powered Chatbot (If possible)<br />
                Our smart chatbot provides instant answers, actionable insights, and interactive learning for water managers and decision-makers.
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" className="subheading" sx={{ fontWeight: 'bold' }}>
                How Does HydroGuard Work?
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Typography className="simpletext">
                HydroGuard leverages advanced technologies, real-time data, and predictive analytics to ensure efficient dam and reservoir management.<br />
                Sensors and satellite imagery provide real-time data on water levels, flow rates, sedimentation, soil moisture, water quality, and climatic factors.<br />
                AI-powered algorithms process this data to monitor structural health, forecast risks, and optimize water distribution.<br />
                A user-friendly platform offers real-time insights for optimizing water allocation and planning new infrastructure.
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Skeleton height={150} />
            </Grid>
          </Grid>
        </PageContainer>
      </Paper>
    </AppProvider>
  );
}
