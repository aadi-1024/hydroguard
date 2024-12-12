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
import Prediction from './Pages/prediction.jsx'
import Cords from './Pages/cordinates'
import ContactUsForm from './Pages/contact.jsx';
import Cordid from './Pages/cordid.jsx'
import Canal from './Pages/canal.jsx'
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <> <Sidebar/> <Map/> <Right/> <MyChatBot/></>
      ),
    },
    {
      path: '/contact',
      element: (
        <> <ContactUsForm/> </>
      ),
    },
    {
      path: '/canal',
      element: (
        <> <Sidebar/><Canal/><Right/> </>
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
        <> <Sidebar/> <Dam/><Right/> <MyChatBot/></>
      ),
    },
    {
      path:'/header',
      element: <Header/>
    },
    {
      path:'/prediction',
      element: <><Sidebar/><Prediction/><Right/><MyChatBot/></>
    },
    {
      path:'/right',
      element: <Right/>
    },
    {
      path:'/polygon/:id',
      element: <><Sidebar/><Cords/><Right/> <MyChatBot/></>
    },
    {
      path:'/cordid/:damId',
      element: <><Sidebar/><Cordid/><Right/> <MyChatBot/></>
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
