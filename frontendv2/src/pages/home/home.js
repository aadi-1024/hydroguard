import * as React from 'react';
import PropTypes from 'prop-types';
import { PageContainer } from '@toolpad/core/PageContainer';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Link, useDemoRouter } from '@toolpad/core/internal';
import { useActivePage } from '@toolpad/core/useActivePage';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import invariant from 'invariant';
import HydroLogo from '../../assets/hydrogaurdlogo.png';
import HydroLogodark from '../../assets/hydrogaurdpng.png';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Headerimage from '../../assets/headerimage.jpg';
import './home.css';




// const NAVIGATION = [
//   { segment: '', title: '' },
//   { segment: '', title: '' },
// ];

export default function BasicPageContainer() {
  const router = useDemoRouter('/orders');

  const theme = useTheme();

  return (
    <AppProvider  router={router} theme={theme}>
      <Paper sx={{ width: '100%' }}>
        {/* preview-start */}
        <PageContainer><PageContainer>
          <Grid container spacing={1}>
            <Grid xs={12}>
              <Typography variant="h4" className="mainheading">
                Welcome to the HydroGuard
              </Typography>
            </Grid>
            <Grid xs={12}>
              <img src={Headerimage} alt="Header" className="header-image" />
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" className="subheading">
                Transforming Dam and Reservoir Management
              </Typography>
            </Grid>
            <Grid size={12}>
              {/* <Skeleton height={100} /> */}
              <Typography className="simpletext" >HydroGuard is a cutting-edge platform designed to ensure the safety, efficiency, and sustainability of dams and reservoirs in the face of evolving challenges. With decades-old infrastructure now facing unprecedented pressures from climate change, population growth, and shifting agricultural practices, HydroGuard delivers advanced solutions to protect and optimize water resources.</Typography>

            </Grid>
            <Grid size={12}>
              {/* <Skeleton height={100} /> */}
              <Typography variant="h6" className="subheading" >The Challenges We Address</Typography>

            </Grid>
            <Grid size={12}>
              {/* <Skeleton height={100} /> */}
              <Typography className="simpletext" >
Aging Infrastructure <br />
Many dams and reservoirs were built decades ago, with designs that no longer align with current needs and environmental realities. Over time, silting, structural stress, and inefficiencies in water storage have become critical issues.<br />

Climate Change Impact<br />Adverse climatic changes exacerbate water stress, increase the risk of structural failures, and alter hydrological patterns, requiring re-evaluation of dam operations.<br />

Shifting Agricultural Practices<br />Evolving agricultural needs, new cropping patterns, and technological advancements in farming demand a dynamic approach to water allocation and management.<br />

Resource Inefficiencies<br />The command areas of dams are shifting due to insufficient water storage and outdated infrastructure, leading to suboptimal water distribution and environmental challenges.</Typography>

            </Grid>
            <Grid size={12}>
              {/* <Skeleton height={100} /> */}
              <Typography variant="h6" className="subheading" >The HydroGuard Solution</Typography>

            </Grid>
            <Grid size={12}>
              {/* <Skeleton height={100} /> */}
              <Typography className="simpletext" >Real-Time Monitoring
We provide live data on water pressure, structural health, and environmental variables to detect risks early and enable proactive management.
      Continuous structural monitoring for aging infrastructure.
      Early warnings for extreme climatic events or potential failures.
      Analysis of water levels, flow rates, sedimentation levels, soil moisture, and water quality to maintain operational        
      efficiency.
      Predictive flood monitoring to minimize risks and ensure public safety.
Decision Support System for Water Management
Empowering water managers and policy-makers with predictive insights to optimize water allocation and distribution.
      Real-time analytics to allocate water based on current demand and environmental conditions.
      Climate and agricultural adaptation models to address shifting resource needs.
      Insights to improve water quality and maximize usage efficiency across industries.
Planning for New Dams 
HydroGuard offers innovative planning tools for future dam construction, incorporating:
Advanced hydrological models to evaluate optimal locations.
     Sustainability and environmental impact assessments.
      Long-term solutions to address growing population and agricultural demands.
AI-Powered Chatbot(If possible)
   Our smart chatbot provides:
      24/7 Assistance: Instant answers to queries for water managers and decision-makers.
      Actionable Insights: Simplified access to complex data and recommendations.
      Interactive Learning: Support for understanding advanced reports and predictive models.</Typography>

            </Grid>
            <Grid size={12}>
              {/* <Skeleton height={100} /> */}
              <Typography variant="h6" className="subheading" >How Does HydroGuard Work?</Typography>

            </Grid>
            <Grid size={12}>
              {/* <Skeleton height={100} /> */}
              <Typography className="simpletext" >HydroGuard leverages advanced technologies, real-time data, and predictive analytics to ensure efficient dam and reservoir management.
Data Collection <br />
Sensors and satellite imagery provide real-time data on water levels, flow rates, sedimentation, soil moisture, water quality, and climatic factors.
Analytics and Insights <br />
AI-powered algorithms process this data to: <br />
Monitor structural health and predict maintenance needs. <br />
Forecast floods and climate-induced risks. <br />
Optimize water quality and distribution for agricultural and industrial use. <br />
Decision Support System (DSS) <br />
A user-friendly platform offers real-time insights for: <br />
Optimizing water allocation. <br />
Prioritizing repairs. <br />
Simulating scenarios for proactive planning. <br />
Predictive Modeling <br />
Predicts climate impacts, crop water demands, and long-term hydrological trends to prevent risks and enhance efficiency. <br />
Planning for Future Infrastructure <br />
HydroGuard analyzes potential sites for new dams, considering hydrology, environmental impact, and sustainability.
With intuitive dashboards and an AI-powered chatbot, HydroGuard empowers users to make informed, proactive decisions for sustainable water management.</Typography>

            </Grid>
            
            <Grid size={12}>
              <Skeleton height={150} />
            </Grid>
            <Grid size={12}>
              <Skeleton height={14} />
            </Grid>

            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
          </Grid>
        </PageContainer></PageContainer>
        {/* preview-end */}
      </Paper>
    </AppProvider>
  );
}
