// src/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useEmployees } from '@/api/employees';
import { useTasks } from '@/api/tasks';
import { useSalaries } from '@/hooks/useEmployee';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, loading }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Box display="flex" alignItems="center" mb={2}>
      {icon}
      <Typography variant="h6" sx={{ ml: 2 }}>
        {title}
      </Typography>
    </Box>
    {loading ? (
      <CircularProgress size={24} />
    ) : (
      <Typography variant="h4">{value}</Typography>
    )}
  </Paper>
);

const DashboardPage: React.FC = () => {
  const { showNotification } = useNotification();

  // Use individual queries
  const {
    data: employees,
    isLoading: isEmployeesLoading,
    error: employeesError,
  } = useEmployees();

  const {
    data: tasks,
    isLoading: isTasksLoading,
    error: tasksError,
  } = useTasks();

  const {
    data: salaries,
    isLoading: isSalariesLoading,
    error: salariesError,
  } = useSalaries();

  // Show error notifications
  useEffect(() => {
    if (employeesError) {
      showNotification('Failed to load employees data', 'error');
    }
    if (tasksError) {
      showNotification('Failed to load tasks data', 'error');
    }
    if (salariesError) {
      showNotification('Failed to load salaries data', 'error');
    }
  }, [employeesError, tasksError, salariesError, showNotification]);

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
            value={employees?.length ?? 0}
            loading={isEmployeesLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<AssignmentIcon color="secondary" fontSize="large" />}
            title="Tasks"
            value={tasks?.length ?? 0}
            loading={isTasksLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<PaymentIcon color="success" fontSize="large" />}
            title="Salary Payments"
            value={salaries?.length ?? 0}
            loading={isSalariesLoading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;