// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import EmployeesPage from '@/pages/employees/EmployeesPage';
import EmployeeCreatePage from '@/pages/employees/EmployeeCreatePage';
import EmployeeEditPage from '@/pages/employees/EmployeeEditPage';
import EmployeeDetailPage from '@/pages/employees/EmployeeDetailsPage';
import TasksPage from '@/pages/tasks/TasksPage';
import TaskCreatePage from '@/pages/tasks/TaskCreatePage';
import TaskEditPage from '@/pages/tasks/TaskEditPage';
import TaskDetailPage from '@/pages/tasks/TaskDetailsPage';
import SalariesPage from '@/pages/salaries/SalariesPage';
import SalaryCreatePage from '@/pages/salaries/SalaryCreatePage';
import SalaryEditPage from '@/pages/salaries/SalaryEditPage';
import SalaryDetailPage from '@/pages/salaries/SalaryDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from '@/components/common/LoadingScreen';
import ProtectedRoute from '@/routes/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';

const AppRoutes: React.FC = () => {
  const { initialized, isAuthenticated } = useAuthStore();

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout children={<Outlet />} />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Authenticated Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Shared Access (e.g. Admin + User) */}
        <Route path="/salaries" element={<SalariesPage />} />
        <Route path="/salaries/:id" element={<SalaryDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
      </Route>

      {/* Admin-Only Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </ProtectedRoute>
      }>
        <Route path="/tasks/create" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <TaskCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/tasks/:id/edit" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <TaskEditPage />
          </ProtectedRoute>
        } />
        <Route path="/employees" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <EmployeesPage />
          </ProtectedRoute>
        } />
        <Route path="/employees/create" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <EmployeeCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/employees/:id/edit" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <EmployeeEditPage />
          </ProtectedRoute>
        } />
        <Route path="/salaries/create" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <SalaryCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/salaries/:id/edit" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <SalaryEditPage />
          </ProtectedRoute>
        } />
        <Route path="/employees/:id/delete" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <EmployeesPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* Default Fallback Routes */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
      } />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
