import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { registerNotificationFn } from '@/store/notificationService';

type NotificationSeverity = 'error' | 'success' | 'info' | 'warning';

interface NotificationState {
    message: string;
    severity: NotificationSeverity;
    open: boolean;
}

interface NotificationContextType {
    showNotification: (message: string, severity?: NotificationSeverity) => void;
    hideNotification: () => void;
    notification: NotificationState | null;
}

const NotificationContext = createContext<NotificationContextType>({
    showNotification: () => {},
    hideNotification: () => {},
    notification: null,
});

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showNotification = (message: string, severity: NotificationSeverity = 'info') => {
        setNotification({ message, severity, open: true });
    };

    const hideNotification = () => {
        setNotification(prev => prev ? { ...prev, open: false } : null);
    };

    useEffect(() => {
        registerNotificationFn(showNotification);
    }, []);

    return (
      <NotificationContext.Provider value={{ showNotification, hideNotification, notification }}>
          {children}
          {notification && (
            <Snackbar
              open={notification.open}
              autoHideDuration={6000}
              onClose={hideNotification}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                  onClose={hideNotification}
                  severity={notification.severity}
                  sx={{ width: '100%' }}
                  variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
          )}
      </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);
