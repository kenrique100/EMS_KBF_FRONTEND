// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types';
import Loading from '@/components/common/Loading';

interface PrivateRouteProps {
  requiredRoles?: Role[];
}

const PrivateRoute = ({ requiredRoles }: PrivateRouteProps) => {
  const { isAuthenticated, initialized, hasRole } = useAuthStore();

  if (!initialized) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;