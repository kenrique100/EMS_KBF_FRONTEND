import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';
import { useSalaryById, useUpdateSalary } from '@/api/salaries';
import { useEmployees } from '@/api/employees';
import SalaryForm from '@/components/salaries/SalaryForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, CircularProgress, Box, Typography, Button } from '@mui/material';
import { SalaryFormData, UpdateSalaryPayload } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditSalaryPage = () => {
  const { id } = useParams<{ id: string }>();
  const paymentId = id ? parseInt(id, 10) : undefined;
  const { data: salary, isLoading: isSalaryLoading } = useSalaryById(paymentId);
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();
  const { mutate: updateSalary, isPending: isSubmitting } = useUpdateSalary();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (formData: SalaryFormData) => {
    if (!paymentId) return;

    const updateData: UpdateSalaryPayload = {
      id: paymentId,
      amount: formData.amount,
      paymentDate: formData.paymentDate?.toISOString() || new Date().toISOString(),
      employeeId: formData.employeeId,
      paymentReference: formData.paymentReference || '',
    };

    updateSalary(updateData, {
      onSuccess: () => {
        showNotification('Salary payment updated successfully', 'success');
        navigate(`/salaries/${paymentId}`);
      },
      onError: (error: Error) => {
        showNotification(error.message || 'Failed to update salary', 'error');
      }
    });
  };

  if (isSalaryLoading || isEmployeesLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!salary) {
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
    <Container maxWidth="lg">
      <PageHeader
        title="Edit Salary Payment"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Salaries', path: '/salaries' },
          { label: `Edit Salary #${paymentId}`, path: '' }
        ]}
      />
      <SalaryForm
        salary={{
          id: salary.id,
          amount: salary.amount,
          paymentDate: new Date(salary.paymentDate),
          employeeId: salary.employeeId,
          paymentReference: salary.paymentReference,
          status: salary.status
        }}
        employees={employees || []}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Update"
      />
    </Container>
  );
};

export default EditSalaryPage;