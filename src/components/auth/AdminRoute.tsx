import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
    children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;
    if (!user || user.role !== 'ADMIN') return <Navigate to="/unauthorized" replace />;

    return children;
};

export default AdminRoute;