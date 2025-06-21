// src/layouts/MainLayout.tsx
import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box component="main" flexGrow={1} p={3}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;