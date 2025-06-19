import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/common/Loading';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading, hasRole, initialized, initializeAuth } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      const init = async () => {
        try {
          await initializeAuth();
        } catch (error) {
          console.error('Auth initialization failed:', error);
        }
      };
      void init();
    }
  }, [initialized, initializeAuth]);

  if (!initialized || isLoading) {
    return <Loading />;
  }

  if (!user || !hasRole('ROLE_ADMIN')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
