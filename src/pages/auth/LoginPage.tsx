// src/pages/auth/LoginPage.tsx
import { Box, Container, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';
import ParticlesBackground from '@/components/common/ParticlesBackground';

const LoginPage = () => {
  const { isAuthenticated, isLoading, initialized } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (initialized && !isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, initialized]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <ParticlesBackground />
      <Container
        maxWidth="xs"
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: theme.shadows[10],
          p: 4,
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="/logo.svg"
          alt="Company Logo"
          sx={{
            width: 80,
            height: 80,
            mb: 3,
          }}
        />
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #ff8a00, #e52e71)'
              : 'linear-gradient(45deg, #1976d2, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Employee Management
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          mb={4}
          sx={{ fontStyle: 'italic' }}
        >
          Streamline your workforce management
        </Typography>
        <Box sx={{ width: '100%', mt: 2 }}>
          <LoginForm />
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;