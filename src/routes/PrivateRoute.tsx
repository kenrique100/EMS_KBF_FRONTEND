// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types';
import Loading from '@/components/common/Loading';
import { useEffect, useState } from 'react';

interface PrivateRouteProps {
  requiredRoles?: Role[];
}

const PrivateRoute = ({ requiredRoles }: PrivateRouteProps) => {
  const { isAuthenticated, initialized, hasRole } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (initialized) {
      if (!isAuthenticated) {
        setIsAuthorized(false);
        return;
      }

      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => hasRole(role));
        setIsAuthorized(hasRequiredRole);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [initialized, isAuthenticated, requiredRoles, hasRole]);

  if (!initialized) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;