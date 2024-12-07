import './interface.css';
import HydroLogo from '../assets/hydroguardlogo.png';
import HydroLogodark from '../assets/hydroguardpng.png';
import AccountDemoSignedOut from './account.jsx';
import Sidebarfooter from './sidebarfooter.jsx';
import BasicPageContainer from './home.jsx';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { extendTheme, useTheme } from '@mui/material/styles';
import { useContext, useMemo, useState } from 'react';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatBot from '@mui/icons-material/Assistant';

// Navigation
const NAVIGATION = [
  { kind: 'header', title: '' },
  { segment: 'home', title: 'Home', icon: <HomeIcon /> },
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Analytics' },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      { segment: 'sales', title: 'Sales', icon: <DescriptionIcon /> },
      { segment: 'traffic', title: 'Traffic', icon: <DescriptionIcon /> },
    ],
  },
  { segment: 'chatbot', title: 'Chatbot', icon: <ChatBot /> },
];

// Light and dark mode settings
const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

// Router Hook
function useDemoRouter(initialPath) {
  const [pathname, setPathname] = useState(initialPath);

  return useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    }),
    [pathname]
  );
}

// Main Component
function DashboardLayoutSlots() {
  const router = useDemoRouter('/dashboard');
  const theme = useTheme();
  const session = useContext(SessionContext);
  const authentication = useContext(AuthenticationContext);

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      branding={{
        logo: (
          <img
            src={theme.palette.mode === 'dark' ? HydroLogo : HydroLogodark}
            alt="HydroGuard logo"
            className="logo"
            style={{ maxHeight: '60px' }}
          />
        ),
        title: 'HydroGuard',
      }}
      router={router}
      theme={demoTheme}
      account={AccountDemoSignedOut}
    >
      <DashboardLayout
        slots={{
          toolbarActions: ThemeSwitcher,
          toolbarAccount: AccountDemoSignedOut,
          sidebarFooter: Sidebarfooter,
        }}
      >
        <BasicPageContainer />
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutSlots;
