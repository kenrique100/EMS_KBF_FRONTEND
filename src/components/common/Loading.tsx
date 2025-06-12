// src/components/common/Loading.tsx
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading = ({ message, fullScreen = true }: LoadingSpinnerProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={fullScreen ? '100vh' : '100%'}
      p={4}
    >
      <CircularProgress size={60} thickness={4} />
      {message && (
        <Typography variant="body1" mt={2}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading;