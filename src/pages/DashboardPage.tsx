import { useState, useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import { Container, Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import {
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Payment as PaymentIcon,
} from '@mui/icons-material';
import {getEmployees} from "@/api/employees.ts";
import {getTasks} from "@/api/tasks.ts";
import {getSalaries} from "@/api/salaries.ts";

const DashboardPage = () => {
    const [stats, setStats] = useState({
        employeeCount: 0,
        taskCount: 0,
        salaryCount: 0,
        loading: true,
    });
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [employees, tasks, salaries] = await Promise.all([
                    getEmployees(),
                    getTasks(),
                    getSalaries(),
                ]);
                setStats({
                    employeeCount: employees.length,
                    taskCount: tasks.length,
                    salaryCount: salaries.length,
                    loading: false,
                });
            } catch (error) {
                showNotification('Failed to load dashboard data', 'error');
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, [showNotification]);

    const StatCard = ({ icon, title, value }) => (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
                {icon}
                <Typography variant="h6" sx={{ ml: 2 }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4">{value}</Typography>
        </Paper>
    );

    if (stats.loading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<PeopleIcon color="primary" fontSize="large" />}
                        title="Employees"
                        value={stats.employeeCount}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<AssignmentIcon color="secondary" fontSize="large" />}
                        title="Tasks"
                        value={stats.taskCount}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        icon={<PaymentIcon color="success" fontSize="large" />}
                        title="Salary Payments"
                        value={stats.salaryCount}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardPage;