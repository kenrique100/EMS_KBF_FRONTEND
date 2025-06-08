import { useParams, useNavigate } from 'react-router-dom';
import { deleteEmployee } from '@/api/employees';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEmployee } from '@/hooks/useEmployee';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

const EmployeeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { employee, isLoading } = useEmployee(id!);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id!);
        showNotification('Employee deleted successfully', 'success');
        navigate('/employees');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete employee';
        showNotification(message, 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Employee Details"
        breadcrumbs={[
          { label: 'Employees', path: '/employees' },
          { label: employee?.name || 'Employee', path: '' }
        ]}
        action={
          <Box display="flex" gap={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/employees')}
              variant="outlined"
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>
            {isAdmin && (
              <>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/employees/${id}/edit`)}
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 120 }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  variant="contained"
                  color="error"
                  sx={{ minWidth: 120 }}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        }
      />
      {employee && <EmployeeProfile employee={employee} />}
    </Container>
  );
};

export default EmployeeDetailsPage;