import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <LoadingSpinner />;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
