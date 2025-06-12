import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Paper,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/common/PageHeader';
import EmployeeList from '@/components/employees/EmployeeList';
import { useEmployees } from '@/api/employees';
import { useDeleteEmployee } from '@/api/employees';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

const EmployeesPage = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { showNotification } = useNotification();
    const { data: employees, isLoading, error } = useEmployees();
    const deleteMutation = useDeleteEmployee();

    const handleViewDetails = (id: string) => {
        navigate(`/employees/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/employees/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            showNotification('Employee deleted successfully', 'success');
        } catch (err) {
            showNotification('Failed to delete employee', 'error');
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
          <Typography color="error">
              Error loading employees: {error.message}
          </Typography>
        );
    }

    return (
      <Container maxWidth="lg">
          <PageHeader
            title="Employees"
            action={
              isAdmin && (
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