// src/pages/NotFoundPage.tsx
import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

interface NotFoundPageProps {
  error?: Error;
  onRetry?: () => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          {error ? 'Oops! Something went wrong.' : 'Page Not Found'}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {error ? error.message : 'The page you are looking for does not exist.'}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleRetry}>
          {error ? 'Retry' : 'Go Home'}
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;