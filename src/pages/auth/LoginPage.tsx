// src/pages/auth/LoginPage.tsx
import { Box, Container, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('LoginPage - useEffect: isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    if (!isLoading && isAuthenticated) {
      console.log('Redirecting to home...');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <Box mt={2}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;
