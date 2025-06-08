// src/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from './MainLayout';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

const AdminLayout = () => {
  const { isAdmin } = useAuth();

  return isAdmin ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <UnauthorizedPage />
  );
};

export default AdminLayout;