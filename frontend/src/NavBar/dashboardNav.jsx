import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Logo from '../assets/Logo/Logo.png';
import { Stack } from '@mui/material';
import Pasiya from '../assets/Img/pa.jpg'
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;
const navItems = [
  { label: 'My Cards', path: '/cards' },
  { label: 'All Cards', path: '/all-cardsnw' },
];

const avatarMenuItems = [
  { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  { label: 'Logout', path: '/', icon: <LogoutIcon /> },
];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} component={Link} to={item.path}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: '#1F509A' }}>
        <Toolbar>
          <Link to="/dashboard">
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{ height: 40, width: 40, mr: 2 }}
            />
          </Link>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
              textAlign: 'center',
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                sx={{ color: '#fff', mx: 1 }}
                component={Link}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Stack direction={'row'} gap={2}>
            <IconButton
              color="inherit"
              aria-label="add"
              sx={{ marginRight: 1, border: 'solid 1px #ffffff', borderRadius: '8px' }}
              LinkComponent={Link}
              to={'/createcard'}
            >
              <AddIcon />
            </IconButton>
            <Avatar
              alt="User Avatar"
              src={Pasiya}
              onClick={handleAvatarClick}
              sx={{ cursor: 'pointer' }}
            />
            <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  PaperProps={{
    elevation: 8,
    sx: {
      overflow: 'visible',
      mt: 1.5,
      borderRadius: '12px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      minWidth: 200,
      '& .MuiMenuItem-root': {
        px: 2,
        py: 1.5,
        fontSize: '1rem',
        fontWeight: 500,
        color: '#1F509A',
        borderRadius: '8px',
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  }}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
>
  {avatarMenuItems.map((item) => (
    <MenuItem
      key={item.label}
      component={Link}
      to={item.path}
      onClick={handleMenuClose}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {item.icon}
        <Typography>{item.label}</Typography>
      </Box>
    </MenuItem>
  ))}
</Menu>
          </Stack>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
