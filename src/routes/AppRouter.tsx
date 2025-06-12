// src/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import AdminRoute from '@/components/auth/AdminRoute';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import EmployeesPage from '@/pages/employees/EmployeesPage';
import CreateEmployeePage from '@/pages/employees/CreateEmployeePage';
import EditEmployeePage from '@/pages/employees/EditEmployeePage';
import EmployeeDetailsPage from '@/pages/employees/EmployeeDetailsPage';
import TasksPage from '@/pages/tasks/TasksPage';
import CreateTaskPage from '@/pages/tasks/CreateTaskPage';
import TaskDetailsPage from '@/pages/tasks/TaskDetailsPage';
import SalariesPage from '@/pages/salaries/SalariesPage';
import CreateSalaryPage from '@/pages/salaries/CreateSalaryPage';
import EmployeeSalariesPage from '@/pages/salaries/EmployeeSalariesPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import SalaryDetailPage from '@/pages/salaries/SalaryDetailPage';
import EmployeeTasksPage from '@/pages/tasks/EmployeeTasksPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Employee Routes */}
          <Route path="/employees">
            <Route index element={<EmployeesPage />} />
            <Route path="new" element={<AdminRoute><CreateEmployeePage /></AdminRoute>} />
            <Route path=":id" element={<EmployeeDetailsPage />} />
            <Route path=":id/edit" element={<AdminRoute><EditEmployeePage /></AdminRoute>} />
            <Route path=":id/salaries" element={<EmployeeSalariesPage />} />
          </Route>

          {/* Task routes */}
          <Route path="/tasks">
            <Route index element={<TasksPage />} />
            <Route path="new" element={<AdminRoute><CreateTaskPage /></AdminRoute>} />
            <Route path=":id" element={<TaskDetailsPage />} />
            <Route path="employee/:id" element={<EmployeeTasksPage />} />
          </Route>

          {/* Salary routes */}
          <Route path="/salaries">
            <Route index element={<AdminRoute><SalariesPage /></AdminRoute>} />
            <Route path="new" element={<AdminRoute><CreateSalaryPage /></AdminRoute>} />
            <Route path=":id" element={<AdminRoute><SalaryDetailPage /></AdminRoute>} />
            <Route path="employee/:id" element={<AdminRoute><EmployeeSalariesPage /></AdminRoute>} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;