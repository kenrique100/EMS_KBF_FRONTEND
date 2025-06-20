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
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/types';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  roles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.some((r) => hasRole(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/unauthorized" element={<MainLayout><UnauthorizedPage /></MainLayout>} />

      {/* Protected routes with DashboardLayout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Tasks routes */}
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route
          path="/tasks/create"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <TaskCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id/edit"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <TaskEditPage />
            </ProtectedRoute>
          }
        />

        {/* Employees routes */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <EmployeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/create"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <EmployeeCreatePage />
            </ProtectedRoute>
          }
        />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route
          path="/employees/:id/edit"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <EmployeeEditPage />
            </ProtectedRoute>
          }
        />

        {/* Salaries routes */}
        <Route path="/salaries" element={<SalariesPage />} />
        <Route path="/salaries/:id" element={<SalaryDetailPage />} />
        <Route
          path="/salaries/create"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <SalaryCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salaries/:id/edit"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <SalaryEditPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
    </Routes>
  );
};

export default AppRoutes;