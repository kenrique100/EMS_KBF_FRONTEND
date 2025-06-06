import { Alert, Snackbar } from '@mui/material';
import { useNotification } from '@/hooks/useNotification';

const Notification = () => {
    const { notification, hideNotification } = useNotification();

    return (
        <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={hideNotification}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                onClose={hideNotification}
                severity={notification.type}
                sx={{ width: '100%' }}
            >
                {notification.message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;