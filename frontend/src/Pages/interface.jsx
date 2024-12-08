import './interface.css';
import HydroLogo from '../assets/hydrogaurdlogo.png';
import HydroLogodark from '../assets/hydrogaurdpng.png';
import AccountDemoSignedOut from './account.jsx';
import Sidebarfooter from './sidebarfooter.jsx';
import BasicPageContainer from './home.jsx';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { extendTheme, useTheme } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';

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

  return {
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  };
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
