import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/common/Loading';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isAuthenticated, initialized } = useAuthStore();

  if (!initialized) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flexGrow={1} display="flex" flexDirection="column">
        <Navbar />
        <Box component="main" flexGrow={1} p={3}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;