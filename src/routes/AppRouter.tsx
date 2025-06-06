import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import PrivateRoute from '../components/auth/PrivateRoute.js';
import MainLayout from '../layouts/MainLayout.js';
import AuthLayout from '../layouts/AuthLayout.js';
import LoginPage from '../pages/auth/LoginPage.js';
import DashboardPage from '../pages/DashboardPage.js';
import EmployeesPage from '../pages/employees/EmployeesPage.js';
import CreateEmployeePage from '../pages/employees/CreateEmployeePage.js';
import EditEmployeePage from '../pages/employees/EditEmployeePage.js';
import EmployeeDetailsPage from '../pages/employees/EmployeeDetailsPage.js';
import TasksPage from '../pages/tasks/TasksPage.js';
import CreateTaskPage from '../pages/tasks/CreateTaskPage.js';
import TaskDetailsPage from '../pages/tasks/TaskDetailsPage.js';
import SalariesPage from '../pages/salaries/SalariesPage.js';
import CreateSalaryPage from '../pages/salaries/CreateSalaryPage.js';
import EmployeeSalariesPage from '../pages/salaries/EmployeeSalariesPage.js';
import NotFoundPage from '../pages/NotFoundPage.js';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import AdminRoute from "@/components/auth/AdminRoute.tsx";

const AppRouter = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/" replace />
                    ) : (
                        <AuthLayout>
                            <LoginPage />
                        </AuthLayout>
                    )
                }
            />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<DashboardPage />} />
                <Route path="employees">
                    <Route index element={<EmployeesPage />} />
                    <Route
                        path="new"
                        element={
                            <AdminRoute>
                                <CreateEmployeePage />
                            </AdminRoute>
                        }
                    />
                    <Route path=":id">
                        <Route index element={<EmployeeDetailsPage />} />
                        <Route
                            path="edit"
                            element={
                                <AdminRoute>
                                    <EditEmployeePage />
                                </AdminRoute>
                            }
                        />
                        <Route path="salaries" element={<EmployeeSalariesPage />} />
                    </Route>
                </Route>
                <Route path="tasks">
                    <Route index element={<TasksPage />} />
                    <Route
                        path="new"
                        element={
                            <AdminRoute>
                                <CreateTaskPage />
                            </AdminRoute>
                        }
                    />
                    <Route path=":id" element={<TaskDetailsPage />} />
                </Route>
                <Route path="salaries">
                    <Route
                        index
                        element={
                            <AdminRoute>
                                <SalariesPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="new"
                        element={
                            <AdminRoute>
                                <CreateSalaryPage />
                            </AdminRoute>
                        }
                    />
                </Route>
                <Route path="unauthorized" element={<UnauthorizedPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter;