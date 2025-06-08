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
import ErrorBoundary from '@/components/common/ErrorBoundary';

const AppRouter = () => {
  return (
    <ErrorBoundary>
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

            {/* Employee routes */}
            <Route path="/employees">
              <Route index element={<EmployeesPage />} />
              <Route path="new" element={<AdminRoute><CreateEmployeePage /></AdminRoute>} />
              <Route path=":id">
                <Route index element={<EmployeeDetailsPage />} />
                <Route path="edit" element={<AdminRoute><EditEmployeePage /></AdminRoute>} />
                <Route path="salaries" element={<EmployeeSalariesPage />} />
              </Route>
            </Route>

            {/* Task routes */}
            <Route path="/tasks">
              <Route index element={<TasksPage />} />
              <Route path="new" element={<AdminRoute><CreateTaskPage /></AdminRoute>} />
              <Route path=":id" element={<TaskDetailsPage />} />
            </Route>

            {/* Salary routes */}
            <Route path="/salaries">
              <Route index element={<AdminRoute><SalariesPage /></AdminRoute>} />
              <Route path="new" element={<AdminRoute><CreateSalaryPage /></AdminRoute>} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRouter;