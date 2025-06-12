// src/pages/NotFoundPage.tsx
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
    const navigate = useNavigate();

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
              <Typography variant="h3" gutterBottom>
                  404 - Page Not Found
              </Typography>
              <Typography variant="body1" paragraph>
                  The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
                sx={{ mt: 3 }}
              >
                  Go to Homepage
              </Button>
          </Box>
      </Container>
    );
};

export default NotFoundPage;