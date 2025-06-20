import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { useCreateEmployee } from '@/api/employees';
import { useNotification } from '@/contexts/NotificationContext';
import { EmployeeFormData } from '@/types';

const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { mutateAsync: createEmployee, isPending: isCreating } = useCreateEmployee();

  const handleSubmit = async (formData: EmployeeFormData) => {
    try {
      await createEmployee(formData);
      showNotification('Employee created successfully', 'success');
      navigate('/employees');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create employee';
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Create Employee"
        breadcrumbs={[
          { label: 'Employees', path: '/employees' },
          { label: 'Create', path: '' }
        ]}
      />
      <EmployeeForm
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
        submitButtonText="Create Employee"
        submitButtonProps={{
          variant: 'contained',
          size: 'large',
        }}
      />
    </Container>
  );
};

export default CreateEmployeePage;