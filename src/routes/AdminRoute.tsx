// src/components/auth/AdminRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/common/Loading';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading, hasRole } = useAuthStore();

  if (isLoading) return <Loading />;
  if (!user || !hasRole('ROLE_ADMIN')) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

export default AdminRoute;