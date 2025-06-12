// src/pages/UnauthorizedPage.tsx
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
      <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="70vh"
            textAlign="center"
          >
              <LockOutlinedIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h3" gutterBottom>
                  Access Denied
              </Typography>
              <Typography variant="body1" paragraph>
                  You don't have permission to access this page. Please contact your administrator if you believe this is an error.
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                  >
                      Go Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                  >
                      Go to Homepage
                  </Button>
              </Box>
          </Box>
      </Container>
    );
};

export default UnauthorizedPage;