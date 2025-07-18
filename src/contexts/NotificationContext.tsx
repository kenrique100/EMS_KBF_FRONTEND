// src/contexts/NotificationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { AlertColor } from '@mui/material';
import { registerNotification, unregisterNotification } from '@/store/notificationService';

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
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    registerNotification(showNotification);
    return () => {
      unregisterNotification();
    };
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