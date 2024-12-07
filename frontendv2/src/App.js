import logo from './logo.svg';
import './App.css';
import Header from './components/header/header';
import DrawerList from './components/sidebar/sidebar';
import ResponsiveDrawer from './components/sidebar/sidebar';
import DashboardLayoutBasic from './pages/maininterface/interface';
import AccountDemoSignedOut from './components/account/account';
import Sidebarfooter from './components/sidebarfootermini/sidebarfooter';
import DashboardLayoutSlots from './pages/maininterface/interface';
import CustomPageContainer from './pages/home/home';
import HomePageContainer from './pages/home/home';
import BasicPageContainer from './pages/home/home';
import BasicSignInPage from './pages/login/signin';


function App() {
  return (
    <div className="App">
    {/* <Header/> */}
    {/* <ResponsiveDrawer/> */}
    {/* <DashboardLayoutBasic/> */}
    {/* <AccountDemoSignedOut/> */}
    {/* <Sidebarfooter/> */}
    <DashboardLayoutSlots/>
    {/* <BasicPageContainer/> */}
    {/* <BasicSignInPage/> */}


    </div>
  );
}

export default App;
