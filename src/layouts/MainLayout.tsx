import React, { useState, ReactNode } from 'react';
import { Outlet, Link } from 'react-router-dom';
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
    ListItemButton,
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
import { useAuthStore } from '@/store/authStore';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
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
}));

interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    const [open, setOpen] = useState(true);
    const { user, logout } = useAuthStore();

    const toggleDrawer = () => setOpen(!open);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const menuItems = [
        { icon: <DashboardIcon />, text: 'Dashboard', path: '/' },
        { icon: <PeopleIcon />, text: 'Employees', path: '/employees' },
        { icon: <AssignmentIcon />, text: 'Tasks', path: '/tasks' },
        { icon: <PaymentIcon />, text: 'Salaries', path: '/salaries' },
    ];

    return (
      <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                ...(open && {
                    width: `calc(100% - ${drawerWidth}px)`,
                    marginLeft: `${drawerWidth}px`,
                }),
            }}
          >
              <Toolbar>
                  <IconButton
                    color="inherit"
                    onClick={toggleDrawer}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}
                  >
                      <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                      Employee Management
                  </Typography>
                  <Box display="flex" alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
                      <Typography variant="subtitle1">{user?.name}</Typography>
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
                      {menuItems.map((item) => (
                        <ListItemButton key={item.text} component={Link} to={item.path}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                      ))}
                  </List>
              </Box>
              <Box sx={{ mt: 'auto', p: 2 }}>
                  <List>
                      <ListItemButton onClick={handleLogout}>
                          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                          <ListItemText primary="Logout" />
                      </ListItemButton>
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
