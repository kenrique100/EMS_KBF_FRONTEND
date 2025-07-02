import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '@/store/authStore';

interface NavbarProps {
  handleDrawerToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleDrawerToggle }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{
              fontWeight: 700,
              '& a': {
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center'
              }
            }}
          >
            <Link to="/">
              Farm Management
            </Link>
          </Typography>
        </Box>

        {isAuthenticated ? (
          <Box display="flex" alignItems="center" gap={2}>
            {/* Desktop View */}
            <Box
              display={{ xs: 'none', sm: 'flex' }}
              alignItems="center"
              gap={1}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
            >
              <Avatar
                alt={user?.name || 'User avatar'}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="body1">
                {user?.name}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  ml: 2,
                  borderRadius: 8,
                  textTransform: 'none'
                }}
              >
                Logout
              </Button>
            </Box>

            {/* Mobile View */}
            <Box display={{ xs: 'flex', sm: 'none' }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar
                  alt={user?.name || 'User avatar'}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Typography>{user?.name}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        ) : (
          <Button
            component={Link}
            to="/login"
            color="primary"
            variant="contained"
            sx={{
              borderRadius: 8,
              px: 3,
              textTransform: 'none'
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;