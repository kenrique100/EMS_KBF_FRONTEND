import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <ThemeProvider>
      <CssBaseline />
      <NotificationProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </NotificationProvider>
    </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
