// src/pages/auth/LoginPage.tsx
import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  const { isAuthenticated, isLoading, initialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, initialized]);

  return (
    <Container maxWidth="xs" sx={{
      mt: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Employee Management
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" mb={4}>
        Please sign in to continue
      </Typography>
      <Box sx={{ width: '100%', mt: 2 }}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;