import { useParams, useNavigate } from 'react-router-dom';
import { useSalaryById } from '@/api/salaries';
import { useEmployeeById } from '@/api/employees';
import { useNotification } from '@/contexts/NotificationContext';
import { useDeleteSalary } from '@/api/salaries';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const SalaryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const paymentId = id ? parseInt(id, 10) : undefined;
  const { data: salary, isLoading: isSalaryLoading } = useSalaryById(paymentId);
  const employeeId = salary?.employeeId || 0;
  const { data: employee, isLoading: isEmployeeLoading } = useEmployeeById(employeeId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: deleteSalary } = useDeleteSalary();
  const navigate = useNavigate();
  const hasAdminRole = useAuthStore(state => state.hasRole('ROLE_ADMIN'));
  const { showNotification } = useNotification();

  const handleDelete = () => {
    if (!paymentId) return;

    deleteSalary(paymentId, {
      onSuccess: () => {
        showNotification('Salary payment deleted successfully', 'success');
        navigate('/salaries');
      },
      onError: () => {
        showNotification('Failed to delete salary payment', 'error');
      }
    });
    setConfirmOpen(false);
  };

  if (isSalaryLoading || isEmployeeLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!salary || !paymentId) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error" gutterBottom>
          Salary payment not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/salaries')}
          variant="outlined"
        >
          Back to Salaries
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Salary Payment Details
      </Typography>

      <Box sx={{ my: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        <Typography><strong>Reference:</strong> {salary.paymentReference}</Typography>
        <Typography><strong>Amount:</strong> {formatCurrency(salary.amount)}</Typography>
        <Typography><strong>Date:</strong> {formatDate(salary.paymentDate)}</Typography>
        <Typography><strong>Status:</strong> {salary.status}</Typography>
        {salary.createdAt && (
          <Typography><strong>Created At:</strong> {formatDate(salary.createdAt)}</Typography>
        )}
      </Box>

      <Box sx={{ my: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Employee Information
        </Typography>
        <Typography><strong>Name:</strong> {employee?.name || 'N/A'}</Typography>
        <Typography><strong>Employee ID:</strong> {salary.employeeId}</Typography>
      </Box>

      <Box display="flex" gap={2} mt={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/salaries')}
          variant="outlined"
        >
          Back to Salaries
        </Button>
        {hasAdminRole && (
          <>
            <Button
              startIcon={<EditIcon />}
              onClick={() => navigate(`/salaries/${id}/edit`)}
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => setConfirmOpen(true)}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </>
        )}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this salary payment?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SalaryDetailPage;