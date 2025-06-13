// src/router.tsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from 'react-router-dom';
import PrivateRoute from '@/routes/PrivateRoute';
import AdminRoute from '@/routes/AdminRoute';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import EmployeesPage from '@/pages/employees/EmployeesPage';
import CreateEmployeePage from '@/pages/employees/CreateEmployeePage';
import EditEmployeePage from '@/pages/employees/EditEmployeePage';
import EmployeeDetailsPage from '@/pages/employees/EmployeeDetailsPage';
import EmployeeTasksPage from '@/pages/tasks/EmployeeTasksPage';

import TasksPage from '@/pages/tasks/TasksPage';
import CreateTaskPage from '@/pages/tasks/CreateTaskPage';
import TaskDetailsPage from '@/pages/tasks/TaskDetailsPage';

import SalariesPage from '@/pages/salaries/SalariesPage';
import CreateSalaryPage from '@/pages/salaries/CreateSalaryPage';
import SalaryDetailPage from '@/pages/salaries/SalaryDetailPage';
import EmployeeSalariesPage from '@/pages/salaries/EmployeeSalariesPage';

import UnauthorizedPage from '@/pages/UnauthorizedPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Employees */}
          <Route path="employees">
            <Route index element={<EmployeesPage />} />
            <Route path="new" element={<AdminRoute><CreateEmployeePage /></AdminRoute>} />
            <Route path=":id" element={<EmployeeDetailsPage />} />
            <Route path=":id/edit" element={<AdminRoute><EditEmployeePage /></AdminRoute>} />
            <Route path=":id/salaries" element={<EmployeeSalariesPage />} />
          </Route>

          {/* Tasks */}
          <Route path="tasks">
            <Route index element={<TasksPage />} />
            <Route path="new" element={<AdminRoute><CreateTaskPage /></AdminRoute>} />
            <Route path=":id" element={<TaskDetailsPage />} />
            <Route path="employee/:id" element={<EmployeeTasksPage />} />
          </Route>

          {/* Salaries */}
          <Route path="salaries">
            <Route index element={<AdminRoute><SalariesPage /></AdminRoute>} />
            <Route path="new" element={<AdminRoute><CreateSalaryPage /></AdminRoute>} />
            <Route path=":id" element={<AdminRoute><SalaryDetailPage /></AdminRoute>} />
            <Route path="employee/:id" element={<AdminRoute><EmployeeSalariesPage /></AdminRoute>} />
          </Route>
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);