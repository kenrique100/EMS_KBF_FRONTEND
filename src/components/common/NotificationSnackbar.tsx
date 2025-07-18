// src/components/common/NotificationSnackbar.tsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotification } from '@/contexts/NotificationContext';

const NotificationSnackbar: React.FC = () => {
  const { notification, clearNotification } = useNotification();

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={5000}
      onClose={clearNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {notification ? (
        <Alert
          onClose={clearNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      ) : undefined}
    </Snackbar>

  );
};

export default NotificationSnackbar;