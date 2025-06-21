// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from '@/components/common/LoadingScreen';
import React from 'react';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  roles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, user, initialized } = useAuthStore();

  if (!initialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.some(role => user?.roles.includes(role))) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;