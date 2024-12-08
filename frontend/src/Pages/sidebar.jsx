import { Drawer, List, ListItem, ListItemText, Divider, Typography, Box } from '@mui/material';
import { Home, Info, AccountBox, ContactMail } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './side.css'; 
import logo from '../assets/hydrogaurdlogo.png';

function Sidebar() {
  return (
    <Drawer
    anchor="left"
    open={true} // Sidebar is always open
    hideBackdrop // Disable the backdrop
    variant="persistent" 
    sx={{
      '& .MuiDrawer-paper': {
        backgroundColor: ' rgb(242, 249, 251);', 
        width: '22vw',
        height: '100vh',
        boxSizing: 'border-box',
        pointerEvents: 'auto', 
        position: 'fixed', // Prevent affecting layout flow
        overflowY: 'auto', // Enable sidebar scrolling
        zIndex: 2,
      },
    }}
  >
      <Box sx={{ width: '21vw', padding: 2 }}>
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <Divider className="drawer-divider" sx={{ my: 2 }} />

        <List className="opt" sx={{ mx: 1 }}>
          <Link to="/home" className="link">
            <ListItem button>
              <Home sx={{ fontSize: '2rem', marginRight: 2 }} />
              <ListItemText primary="Home" />
            </ListItem>
          </Link>
          <Link to="/about" className="link">
            <ListItem button>
              <Info sx={{ fontSize: '2rem', marginRight: 2 }} />
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
          <Link to="/profile" className="link">
            <ListItem button>
              <AccountBox sx={{ fontSize: '2rem', marginRight: 2 }} />
              <ListItemText primary="Profile" />
            </ListItem>
          </Link>
          <Link to="/contact" className="link">
            <ListItem button>
              <ContactMail sx={{ fontSize: '2rem', marginRight: 2 }} />
              <ListItemText primary="Contact" />
            </ListItem>
          </Link>
        </List>

        <Divider className="drawer-divider" sx={{ my: 2 }} />
        <Typography variant="caption" className="drawer-footer">
          © {new Date().getFullYear()} Made with ❤️ by Team Chakravyuh
        </Typography>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
