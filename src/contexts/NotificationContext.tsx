import { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
    open: boolean;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    notification: Notification;
    showNotification: (message: string, type?: NotificationType) => void;
    hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notification, setNotification] = useState<Notification>({
        open: false,
        message: '',
        type: 'info',
    });

    const showNotification = (message: string, type: NotificationType = 'info') => {
        setNotification({ open: true, message, type });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const value = {
        notification,
        showNotification,
        hideNotification
    };

    return (
      <NotificationContext.Provider value={value}>
          {children}
      </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};