// src/App.tsx
import React, { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuthStore } from './store/authStore';
import LoadingScreen from './components/common/LoadingScreen';

const App: React.FC = () => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const initialized = useAuthStore(state => state.initialized);
  const isLoading = useAuthStore(state => state.isLoading);

  useEffect(() => {
    void (async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
    })();
  }, [initializeAuth]);

  if (!initialized || isLoading) {
    return <LoadingScreen />;
  }

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
};

export default App;
