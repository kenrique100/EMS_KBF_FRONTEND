import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Farm Management System
          </Link>
        </Typography>

        {isAuthenticated ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Button component={Link} to="/profile">Profile</Button>
            <Button component={Link} to="/employees">Employees</Button>
            <Button component={Link} to="/tasks">Tasks</Button>
            <Button component={Link} to="/salaries">Salaries</Button>

            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                alt={user?.name}
                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="body1">{user?.name}</Typography>
              <Button variant="outlined" onClick={handleLogout} sx={{ ml: 2 }}>
                Logout
              </Button>
            </Box>
          </Box>
        ) : (
          <Button component={Link} to="/login" color="primary" variant="contained">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;