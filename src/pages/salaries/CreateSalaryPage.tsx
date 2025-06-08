import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';
import { createSalary } from '@/api/salaries';
import { getEmployees } from '@/api/employees';
import SalaryForm from '../../components/salaries/SalaryForm';
import PageHeader from '../../components/common/PageHeader';
import { Container, CircularProgress, Box } from '@mui/material';
import { Employee, SalaryFormData } from '@/utils/types';

const CreateSalaryPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error: any) {
        showNotification('Failed to load employees', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [showNotification]);

  const handleSubmit = async (formData: SalaryFormData) => {
    setIsSubmitting(true);
    try {
      const salaryData = {
        amount: Number(formData.amount),
        paymentDate: formData.paymentDate?.toISOString() || new Date().toISOString(),
        employeeId: formData.employeeId,
        paymentReference: formData.paymentReference || undefined,
      };

      await createSalary(salaryData);
      showNotification('Salary payment created successfully', 'success');
      navigate('/salaries');
    } catch (error: any) {
      showNotification(error.message || 'Failed to create salary', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
        employees={employees}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

export default CreateSalaryPage;