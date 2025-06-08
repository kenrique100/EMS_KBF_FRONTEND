import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import MainLayout from '@/layouts/MainLayout';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <MainLayout>
        <Outlet />
      </MainLayout>
    </Box>
  );
}

export default App;