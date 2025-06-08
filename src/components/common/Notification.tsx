import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Snackbar, Alert } from '@mui/material';

const Notification = () => {
  const { notification, hideNotification } = useNotification();

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={hideNotification}
        severity={notification.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
