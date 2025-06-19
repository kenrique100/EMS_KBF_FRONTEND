import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Paper,
  Box,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/common/PageHeader';
import EmployeeList from '@/components/employees/EmployeeList';
import { useEmployees } from '@/api/employees';
import { useDeleteEmployee } from '@/api/employees';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuthStore } from '@/store/authStore';

const EmployeesPage = () => {
  const navigate = useNavigate();
  const hasAdminRole = useAuthStore(state => state.hasRole('ROLE_ADMIN'));
  const { showNotification } = useNotification();
  const { data: employees, isLoading, error } = useEmployees();
  const { mutateAsync: deleteEmployee } = useDeleteEmployee();

  const handleViewDetails = (id: number) => {
    navigate(`/employees/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      showNotification('Employee deleted successfully', 'success');
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : 'Failed to delete employee',
        'error'
      );
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          Error loading employees: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Employees"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Employees', path: '/employees' }
        ]}
        action={
          hasAdminRole && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/employees/new')}
            >
              Add Employee
            </Button>
          )
        }
      />
      <Paper sx={{ mt: 3 }}>
        {employees && employees.length > 0 ? (
          <EmployeeList
            employees={employees}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Typography variant="body1" sx={{ p: 3 }}>
            No employees found
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default EmployeesPage;