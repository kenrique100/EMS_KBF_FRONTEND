import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
    open: boolean;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
    notification: Notification;
    showNotification: (message: string, type?: Notification['type']) => void;
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

    const showNotification = (message: string, type: Notification['type'] = 'info') => {
        setNotification({ open: true, message, type });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const value = {
        notification,
        showNotification,
        hideNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};