// src/pages/salaries/CreateSalaryPage.tsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';
import { useCreateSalary } from '@/api/salaries';
import { useEmployees } from '@/api/employees';
import SalaryForm from '@/components/salaries/SalaryForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, CircularProgress, Box } from '@mui/material';
import { SalaryFormData } from '@/types';

const CreateSalaryPage = () => {
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();
  const { mutate: createSalary, isPending: isSubmitting } = useCreateSalary();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (formData: SalaryFormData) => {
    const salaryData = {
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate?.toString() || new Date().toISOString(),
      employeeId: formData.employeeId,
      paymentReference: formData.paymentReference
    };

    createSalary(salaryData, {
      onSuccess: () => {
        showNotification('Salary payment created successfully', 'success');
        navigate('/salaries');
      },
      onError: (error) => {
        showNotification(error.message || 'Failed to create salary', 'error');
      }
    });
  };

  if (isEmployeesLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader title="Create Salary Payment" />
      <SalaryForm
        employees={employees || []}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialValues={employeeId ? { employeeId } : undefined}
      />
    </Container>
  );
};

export default CreateSalaryPage;