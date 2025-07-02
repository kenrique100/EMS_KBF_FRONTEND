import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/common/Loading';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, initialized } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!initialized) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box display="flex" minHeight="100vh" sx={{ backgroundColor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        sx={{
          marginLeft: { sm: '240px' },
          width: { sm: `calc(100% - 240px)` }
        }}
      >
        <Navbar handleDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          flexGrow={1}
          p={{ xs: 2, md: 3 }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;