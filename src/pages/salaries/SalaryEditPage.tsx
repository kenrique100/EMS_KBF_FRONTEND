import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';
import SalaryForm from '@/components/salaries/SalaryForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, CircularProgress, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SalaryPaymentDTO } from '@/types';
import { useSalaryById, useUpdateSalary } from '@/hooks/salaryHooks';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '@/api/employees';

const SalaryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const paymentId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const { data: salary, isLoading: isSalaryLoading } = useSalaryById(paymentId);
  const { data: employees, isLoading: isEmployeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
  const { mutate: updateSalary, isPending: isSubmitting } = useUpdateSalary();

  const handleSubmit = (formData: SalaryPaymentDTO) => {
    if (!paymentId || !salary) return;

    const updateData: SalaryPaymentDTO = {
      amount: formData.amount,
      paymentDate: formData.paymentDate,
      employeeId: formData.employeeId,
      paymentReference: formData.paymentReference || '',
    };

    updateSalary(
      { id: paymentId, ...updateData },
      {
        onSuccess: () => {
          showNotification('Salary payment updated successfully', 'success');
          navigate(`/salaries/${paymentId}`);
        },
        onError: (error: Error) => {
          showNotification(error.message || 'Failed to update salary', 'error');
        },
      }
    );
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
          { label: `Edit Salary #${paymentId}`, path: '' },
        ]}
      />
      <SalaryForm
        initialValues={{
          id: salary.id,
          amount: salary.amount,
          paymentDate: salary.paymentDate,
          employeeId: salary.employeeId,
          paymentReference: salary.paymentReference,
        }}
        employees={employees?.map(e => ({ id: e.id, name: e.name })) || []}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

export default SalaryEditPage;