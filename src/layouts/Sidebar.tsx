import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';

const Sidebar: React.FC = () => {
  const { hasRole } = useAuthStore();
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar /> {/* For proper spacing under AppBar */}
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/profile">
          <ListItemIcon><ProfileIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        {hasRole('ROLE_ADMIN') && (
          <>
            <ListItem button component={Link} to="/employees">
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Employees" />
            </ListItem>
            <ListItem button component={Link} to="/tasks">
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItem>
            <ListItem button component={Link} to="/salaries">
              <ListItemIcon><PaymentIcon /></ListItemIcon>
              <ListItemText primary="Salaries" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;