import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AuthProvider } from '@/contexts/AuthContext';
import App from '@/App';
import theme from '@/assets/styles/theme';
import '@/assets/styles/index.css';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Notification from '@/components/common/Notification';

// Import your page components
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create your app routes
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <NotificationProvider>
          <AuthProvider>
            <App />
            <Notification />
          </AuthProvider>
        </NotificationProvider>
      </ErrorBoundary>
    ),
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/unauthorized', element: <UnauthorizedPage /> },

      // Employee routes
      { path: '/employees', element: <EmployeesPage /> },
      { path: '/employees/new', element: <CreateEmployeePage /> },
      {
        path: '/employees/:id',
        element: <EmployeeDetailsPage />,
        children: [
          { path: 'edit', element: <EditEmployeePage /> },
          { path: 'salaries', element: <EmployeeSalariesPage /> },
        ]
      },

      // Task routes
      { path: '/tasks', element: <TasksPage /> },
      { path: '/tasks/new', element: <CreateTaskPage /> },
      { path: '/tasks/:id', element: <TaskDetailsPage /> },

      // Salary routes
      { path: '/salaries', element: <SalariesPage /> },
      { path: '/salaries/new', element: <CreateSalaryPage /> },

      // Catch-all route
      { path: '*', element: <NotFoundPage /> }
    ],
  },
], {
  future: {
    // Correct future flags for React Router v6
    v7_normalizeFormMethod: true,
    v7_prependBasename: true,
    v7_throwAbortReason: true
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);