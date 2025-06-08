import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSalaryById, deleteSalary } from '@/api/salaries';
import { Salary, Employee } from '@/utils/types';
import { Box, Button, CircularProgress, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { getEmployeeById } from '@/api/employees';

const SalaryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [salary, setSalary] = useState<Salary | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const data = await getSalaryById(id!);
        setSalary(data);

        const empData = await getEmployeeById(data.employeeId);
        setEmployee(empData);
      } catch {
        showNotification('Failed to load salary details', 'error');
        navigate('/salaries');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSalary();
  }, [id, navigate, showNotification]);

  const handleDelete = async () => {
    try {
      await deleteSalary(id!);
      showNotification('Salary deleted successfully', 'success');
      navigate('/salaries');
    } catch {
      showNotification('Failed to delete salary', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!salary) return null;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Salary Details</Typography>
      <Typography><strong>Employee:</strong> {employee?.name ?? 'N/A'}</Typography>
      <Typography><strong>Amount:</strong> ${salary.amount}</Typography>
      <Typography><strong>Date:</strong> {new Date(salary.paymentDate).toLocaleDateString()}</Typography>

      <Box mt={4} display="flex" gap={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/salaries')} variant="outlined">
          Back
        </Button>
        {isAdmin && (
          <Button startIcon={<DeleteIcon />} onClick={() => setConfirmOpen(true)} color="error" variant="contained">
            Delete
          </Button>
        )}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this salary?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SalaryDetailPage;