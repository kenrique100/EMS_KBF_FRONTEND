import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { NotificationProvider } from './hooks/useNotification';
import AppRouter from './routes/AppRouter.js';
import Notification from './components/common/Notification.js';
import '@/assets/styles/index.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <NotificationProvider>
                    <AppRouter />
                    <Notification />
                </NotificationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;