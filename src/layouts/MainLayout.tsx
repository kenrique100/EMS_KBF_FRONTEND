import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
    Box,
    CssBaseline,
    Toolbar,
    AppBar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Payment as PaymentIcon,
    ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.js';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
);

const MainLayout = () => {
    const [open, setOpen] = useState(true);
    const { user, logout } = useAuth();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            // Redirect to login page after logout
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    ...(open && { width: `calc(100% - ${drawerWidth}px)`, marginLeft: `${drawerWidth}px` }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Employee Management System
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
                        <Typography variant="subtitle1">{user?.username}</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button component="a" href="/">
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button component="a" href="/employees">
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Employees" />
                        </ListItem>
                        <ListItem button component="a" href="/tasks">
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tasks" />
                        </ListItem>
                        <ListItem button component="a" href="/salaries">
                            <ListItemIcon>
                                <PaymentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Salaries" />
                        </ListItem>
                    </List>
                </Box>
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <List>
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Main open={open}>
                <Toolbar />
                <Outlet />
            </Main>
        </Box>
    );
};

export default MainLayout;