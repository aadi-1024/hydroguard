import Sidebar from './Pages/sidebar';
import Map from './Pages/gui.jsx';  
import { Box } from '@mui/material';
import './app.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Box >
          <Sidebar /> <Map />
         
        </Box>
      ),
    },
    {
      path: '/home',
      element: (
        <Box sx={{ padding: 2 }}>
          <h1>HOME</h1>
        </Box>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
