import Sidebar from './Pages/sidebar';
import Map from './Pages/gui.jsx';  
import MyChatBot from './components/chatbot.jsx';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './Pages/header.jsx'
import Home from './Pages/home.jsx'
import Int from './Pages/interface.jsx'
import Sign from './Pages/signin.jsx'
import Right from './Pages/right.jsx'
import Dam from './Pages/dam.jsx'
import Litter from './Pages/litter.jsx'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <> <Sidebar/> <Map/> <Right/> <MyChatBot/></>
      ),
    },
    {
      path: '/litter',
      element: (
        <><Sidebar/> <Litter/><Right/> </>
      ),
    },
    {
      path: '/dam/:damId',
      element: (
        <> <Sidebar/> <Dam/><Right/></>
      ),
    },
    {
      path:'/header',
      element: <Header/>
    },
    
    {
      path:'/right',
      element: <Right/>
    },
    {
      path:'/home',
      element: <><Sidebar/><Home/> </>

    },
    {
      path:'/interface',
      element: <Int/> 
    },
    {
      path:'/signin',
      element: <Sign/>
    }
    
  ]);

  return <RouterProvider router={router} />;
}

export default App;
