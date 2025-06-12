import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <NotificationProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
