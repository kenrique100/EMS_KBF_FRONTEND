import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from '@/api/employees';
import EmployeeForm from '@/components/employees/EmployeeForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, Box } from '@mui/material';
import { EmployeeFormData } from '@/utils/types';
import { useNotification } from '@/contexts/NotificationContext';

const CreateEmployeePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (formData: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      await createEmployee(formData);
      showNotification('Employee created successfully', 'success');
      navigate('/employees');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create employee';
      showNotification(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <PageHeader
          title="Create New Employee"
          breadcrumbs={[
            { label: 'Employees', path: '/employees' },
            { label: 'Create', path: '' }
          ]}
        />
      </Box>
      <EmployeeForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Create Employee"
        submitButtonProps={{
          variant: 'contained',
          size: 'large',
          fullWidth: false,
        }}
      />
    </Container>
  );
};

export default CreateEmployeePage;