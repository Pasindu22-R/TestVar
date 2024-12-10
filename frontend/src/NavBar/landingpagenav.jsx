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
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';

// Logo
import Logo from '../assets/Logo/Logo.png';
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact Us'];

function DrawerAppBar(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 2 }} />
            {/* Add Create and Login buttons inside the Drawer for small screens */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<AddTwoToneIcon />}
                    sx={{
                        textTransform: 'none',
                        border: 'solid 2px #02824f',
                        color: '#02824f',
                        transition: '0.7s',
                        '&:hover': {
                            border: 'solid 2px #0056b3',
                            color: '#0056b3',
                            transition: '0.7s',
                        },
                    }}
                >
                    Create
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<LoginTwoToneIcon />}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#0056b3',
                        transition: '0.7s',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#003c8f',
                            color: '#ffffff',
                            transition: '0.7s',
                        },
                    }}
                >
                    Login
                </Button>
            </Box>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                component="nav"
                elevation={0}
                sx={{
                    bgcolor: '#e3f2fd',
                    color: '#0d47a1',
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {/* Hamburger menu for small screens */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <img
                            src={Logo}
                            alt="Logo"
                            style={{
                                height: '50px',
                                backgroundColor:'#0A3981',
                                borderRadius:'25px'
                            }}
                        />
                    </Box>

                    {/* Navigation Links */}
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            justifyContent: 'center',
                            gap: 3,
                            flexGrow: 1,
                        }}
                    >
                        {navItems.map((item) => (
                            <Button
                                key={item}
                                sx={{
                                    color: '#0d47a1',
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        color: '#003c8f',
                                    },
                                }}
                            >
                                {item}
                            </Button>
                        ))}
                    </Box>

                    {/* Create and Login Buttons */}
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            gap: 1,
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            component={Link}
                            to={'/login'}
                            startIcon={<LoginTwoToneIcon />}
                            sx={{
                                textTransform: 'none',
                                backgroundColor: '#0056b3',
                                transition: '0.7s',
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#003c8f',
                                    color: '#ffffff',
                                    transition: '0.7s',
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile */}
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
    window: PropTypes.func,
};

export default DrawerAppBar;
