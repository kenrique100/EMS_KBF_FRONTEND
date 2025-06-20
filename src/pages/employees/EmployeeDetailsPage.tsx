import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAuthStore } from '@/store/authStore';
import { useNotification } from '@/contexts/NotificationContext';
import {
  useEmployeeById,
  useDeleteEmployee,
  useUpdateEmployee
} from '@/api/employees';
import PageHeader from '@/components/common/PageHeader';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import { useProfile } from '@/api/profile';
import { EmployeeUpdateDTO } from '@/types';

const EmployeeDetailPage = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserId, hasRole } = useAuthStore();
  const { showNotification } = useNotification();

  const currentUserId = getUserId();
  const isProfileView = !paramId || paramId === 'me';
  const parsedId = paramId && paramId !== 'me' ? parseInt(paramId, 10) : undefined;
  const employeeId = isProfileView ? currentUserId : parsedId;

  const {
    data: employee,
    isLoading,
    error,
    refetch,
  } = isProfileView ? useProfile() : useEmployeeById(employeeId);

  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();
  const { mutateAsync: updateEmployee } = useUpdateEmployee();

  const isAdmin = hasRole('ROLE_ADMIN');
  const isCurrentUser = currentUserId !== undefined && employeeId !== undefined && currentUserId === employeeId;

  const handleDeleteEmployee = async () => {
    if (employeeId === undefined) return;

    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employeeId);
        showNotification('Employee deleted successfully', 'success');
        navigate('/employees');
      } catch (err) {
        showNotification(
          err instanceof Error ? err.message : 'Failed to delete employee',
          'error'
        );
      }
    }
  };

  const handleUploadFile = async (file: File, type: 'profile' | 'document') => {
    if (!employee || employeeId === undefined) return;

    try {
      const updateData: EmployeeUpdateDTO = {
        ...employee,
        dateOfEmployment: employee.dateOfEmployment,
        [type === 'profile' ? 'profilePictureFile' : 'documentFile']: file
      };

      await updateEmployee({ id: employeeId, data: updateData });
      await refetch();
      showNotification('File updated successfully', 'success');
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : 'Failed to update file',
        'error'
      );
    }
  };

  const handleDeleteFile = async (type: 'profile' | 'document') => {
    if (!employee || employeeId === undefined) return;

    try {
      const updateData: EmployeeUpdateDTO = {
        ...employee,
        dateOfEmployment: employee.dateOfEmployment,
        [type === 'profile' ? 'profilePicturePath' : 'documentPath']: undefined
      };

      await updateEmployee({ id: employeeId, data: updateData });
      await refetch();
      showNotification('File removed successfully', 'success');
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : 'Failed to remove file',
        'error'
      );
    }
  };

  if (isLoading) {
    return (
      <Box mt={8} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !employee) {
    return (
      <Box mt={8} textAlign="center">
        <Typography variant="h6" color="error">
          {error?.message || 'Employee not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={isProfileView ? 'My Profile' : 'Employee Details'}
        breadcrumbs={[
          isProfileView
            ? { label: 'Dashboard', path: '/dashboard' }
            : { label: 'Employees', path: '/employees' },
          { label: employee.name, path: '' }
        ]}
        action={
          <Box display="flex" gap={2}>
            {!isProfileView && (
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/employees')}
                variant="outlined"
              >
                Back
              </Button>
            )}
            {(isAdmin || isCurrentUser) && (
              <Button
                startIcon={<EditIcon />}
                onClick={() =>
                  navigate(isProfileView ? '/profile/edit' : `/employees/${employeeId}/edit`)
                }
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            )}
            {isAdmin && !isProfileView && employeeId !== undefined && (
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleDeleteEmployee}
                variant="contained"
                color="error"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </Box>
        }
      />

      <EmployeeProfile
        employee={employee}
        onUploadProfilePicture={(file) => handleUploadFile(file, 'profile')}
        onDeleteProfilePicture={() => handleDeleteFile('profile')}
        onUploadDocument={(file) => handleUploadFile(file, 'document')}
        onDeleteDocument={() => handleDeleteFile('document')}
        allowEdit={isAdmin || isCurrentUser}
        isCurrentUser={isCurrentUser}
      />
    </Container>
  );
};

export default EmployeeDetailPage;