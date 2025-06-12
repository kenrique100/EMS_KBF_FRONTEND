// src/components/auth/AdminRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AdminRouteProps {
    children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
    const { user, isLoading } = useAuthStore();

    if (isLoading) return null;
    if (!user || !user.role.includes('ADMIN')) return <Navigate to="/unauthorized" replace />;

    return children;
};

export default AdminRoute;