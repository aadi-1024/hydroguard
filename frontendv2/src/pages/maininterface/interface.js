import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import ChatBot from '@mui/icons-material/Assistant';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Headerimage from '../../assets/headerimage.jpg';
import './interface.css';
import HydroLogo from '../../assets/hydrogaurdlogo.png';
import HydroLogodark from '../../assets/hydrogaurdpng.png';
import { useTheme } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import AccountDemoSignedOut from '../../components/account/account';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import Sidebarfooter from '../../components/sidebarfootermini/sidebarfooter';
import BasicPageContainer from '../home/home';



const NAVIGATION = [
  {
    kind: 'header',
    title: '',
  },
  {
    segment: 'home',
    title: 'Home',
    icon: <HomeIcon />,
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'chatbot',
    title: 'Chatbot',
    icon: <ChatBot />,
  },
];


//light mode and dark mode ka scene idhar ho raha hai
const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});




//pathname specify karta hai yeh function and routing mein use use hota hai
function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}






function DashboardLayoutSlots(props) {
  const router = useDemoRouter('/dashboard');
  const theme = useTheme();
  const session = React.useContext(SessionContext);
  const authentication = React.useContext(AuthenticationContext);
  const { window } = props;




  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      branding={{
        logo: (
          <img
            src={theme.palette.mode === 'dark' ? HydroLogo : HydroLogodark}
            alt="Hydroguard logo"
            className="logo"
            style={{ maxHeight: '60px' }}
          />
        ),
        title: 'HydroGuard',
      }}
      router={router}
      theme={demoTheme}
      account = {AccountDemoSignedOut}
    >
      <DashboardLayout
        slots={{
          toolbarActions: ThemeSwitcher,
          toolbarAccount: AccountDemoSignedOut,
          sidebarFooter: Sidebarfooter,
        }}
      >
        <BasicPageContainer/>
        
      </DashboardLayout>
    </AppProvider>
  );
}



export default DashboardLayoutSlots;

