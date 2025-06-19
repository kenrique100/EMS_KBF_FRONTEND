import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import { useEmployeeById } from '@/api/employees';
import { useUpdateEmployee } from '@/api/employees';
import { useNotification } from '@/contexts/NotificationContext';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { EmployeeFormData } from '@/types';

const EditEmployeePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const employeeId = id ? parseInt(id, 10) : 0;
  const { data: employee, isLoading } = useEmployeeById(employeeId);
  const { mutateAsync: updateEmployee, isPending: isUpdating } = useUpdateEmployee();

  const handleSubmit = async (formData: EmployeeFormData) => {
    try {
      await updateEmployee({ id: employeeId, data: formData });
      showNotification('Employee updated successfully', 'success');
      navigate(`/employees/${id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update employee';
      showNotification(errorMessage, 'error');
    }
  };

  if (isLoading || !employee) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const initialFormData: EmployeeFormData = {
    id: employee.id,
    username: employee.username,
    name: employee.name,
    email: employee.email || '',
    phoneNumber: employee.phoneNumber || '',
    department: employee.department || '',
    password: '', // Don't prefill passwords
    dateOfEmployment: employee.dateOfEmployment ? new Date(employee.dateOfEmployment) : null,
    status: employee.status,
    profilePicturePath: employee.profilePicturePath || null,
    documentPath: employee.documentPath || null,
    profilePictureFile: null,
    documentFile: null,
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Edit Employee"
        breadcrumbs={[
          { label: 'Employees', path: '/employees' },
          { label: employee.name, path: `/employees/${id}` },
          { label: 'Edit', path: '' }
        ]}
      />
      <EmployeeForm
        employee={initialFormData}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitButtonText="Update Employee"
        submitButtonProps={{
          variant: 'contained',
          size: 'large',
        }}
      />
    </Container>
  );
};

export default EditEmployeePage;