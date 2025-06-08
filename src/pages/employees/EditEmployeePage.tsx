import { useParams, useNavigate } from 'react-router-dom';
import { updateEmployee } from '@/api/employees';
import EmployeeForm from '@/components/employees/EmployeeForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, CircularProgress, Box } from '@mui/material';
import { useEmployee } from '@/hooks/useEmployee';
import { Employee, EmployeeFormData } from '@/utils/types';
import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

const EditEmployeePage = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const { employee, isLoading } = useEmployee(id!);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      await updateEmployee(id!, formData);
      showNotification('Employee updated successfully', 'success');
      navigate(`/employees/${id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update employee';
      showNotification(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const toFormData = (emp: Employee): EmployeeFormData => ({
    id: emp.id,
    username: emp.username,
    name: emp.name,
    password: '', // leave empty for editing
    dateOfEmployment: emp.dateOfEmployment ? new Date(emp.dateOfEmployment) : null,
    status: emp.status,
    profilePicture: emp.profilePicture instanceof File ? emp.profilePicture : null,
    document: emp.document instanceof File ? emp.document : null,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <PageHeader
          title="Edit Employee"
          breadcrumbs={[
            { label: 'Employees', path: '/employees' },
            { label: employee?.name || 'Employee', path: `/employees/${id}` },
            { label: 'Edit', path: '' }
          ]}
        />
      </Box>
      {employee && (
        <EmployeeForm
          employee={toFormData(employee)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Update Employee"
          submitButtonProps={{
            variant: 'contained',
            size: 'large',
            fullWidth: false,
          }}
        />
      )}
    </Container>
  );
};

export default EditEmployeePage;