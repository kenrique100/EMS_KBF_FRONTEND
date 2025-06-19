// src/contexts/NotificationContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';
import { AlertColor } from '@mui/material';
import { registerNotification } from '@/store/notificationService';

interface Notification {
    message: string;
    severity: AlertColor;
}

interface NotificationContextType {
    notification: Notification | null;
    showNotification: (message: string, severity: AlertColor) => void;
    clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    notification: null,
    showNotification: () => {},
    clearNotification: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                  children,
                                                                              }) => {
    const [notification, setNotification] = useState<Notification | null>(null);

    const showNotification = useCallback((message: string, severity: AlertColor) => {
        setNotification({ message, severity });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    // ✅ Register with the service once the context is ready
    useEffect(() => {
        registerNotification(showNotification);
    }, [showNotification]);

    return (
      <NotificationContext.Provider
        value={{ notification, showNotification, clearNotification }}
      >
          {children}
      </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
