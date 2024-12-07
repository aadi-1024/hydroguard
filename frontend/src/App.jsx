

import DashboardLayoutSlots from './Pages/interface.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

import{createBrowserRouter,RouterProvider} from 'react-router-dom';
function App() {
  const router=createBrowserRouter([
    
    {
      path: "/interface",
      element:<><DashboardLayoutSlots/></>
    }
   
    
  ])

  return (
    <>
       <RouterProvider router={router}/>
    </>
  )
}

export default App
