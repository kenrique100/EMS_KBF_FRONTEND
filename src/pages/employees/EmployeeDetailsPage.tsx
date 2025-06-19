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
  useUpdateProfilePicture,
  useDeleteProfilePicture,
  useUpdateDocument,
  useDeleteDocument
} from '@/api/employees';
import PageHeader from '@/components/common/PageHeader';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import { useProfile } from '@/api/profile';

const EmployeeDetailPage = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserId, hasRole } = useAuthStore();
  const { showNotification } = useNotification();

  const currentUserId = getUserId();

  // Determine if we're showing profile view or another employee
  const isProfileView = !paramId || paramId === 'me';

  // Safely parse numeric ID
  const parsedId = paramId && paramId !== 'me' ? parseInt(paramId, 10) : undefined;

  // Final resolved ID for employee (profile or specific employee)
  const employeeId = isProfileView ? currentUserId : parsedId;

  // Use the correct hook based on view type
  const {
    data: employee,
    isLoading,
    error,
    refetch,
  } = isProfileView ? useProfile() : useEmployeeById(employeeId);

  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();
  const { mutateAsync: updateProfilePicture } = useUpdateProfilePicture();
  const { mutateAsync: deleteProfilePicture } = useDeleteProfilePicture();
  const { mutateAsync: updateDocument } = useUpdateDocument();
  const { mutateAsync: deleteDocument } = useDeleteDocument();

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

  const handleUploadProfilePicture = async (file: File) => {
    if (employeeId === undefined) return;
    try {
      await updateProfilePicture({ id: employeeId, file });
      await refetch();
      showNotification('Profile picture updated successfully', 'success');
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : 'Failed to update profile picture',
        'error'
      );
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (employeeId === undefined) return;
    try {
      await deleteProfilePicture(employeeId);
      await refetch();
      showNotification('Profile picture removed successfully', 'success');
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : 'Failed to remove profile picture',
        'error'
      );
    }
  };

  const handleUploadDocument = async (file: File) => {
    if (employeeId === undefined) return;
    try {
      await updateDocument({ id: employeeId, file });
      await refetch();
      showNotification('Document uploaded successfully', 'success');
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : 'Failed to upload document',
        'error'
      );
    }
  };

  const handleDeleteDocument = async () => {
    if (employeeId === undefined) return;
    try {
      await deleteDocument(employeeId);
      await refetch();
      showNotification('Document removed successfully', 'success');
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : 'Failed to remove document',
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
        onUploadProfilePicture={employeeId ? handleUploadProfilePicture : undefined}
        onDeleteProfilePicture={employeeId ? handleDeleteProfilePicture : undefined}
        onUploadDocument={employeeId ? handleUploadDocument : undefined}
        onDeleteDocument={employeeId ? handleDeleteDocument : undefined}
        allowEdit={isAdmin || isCurrentUser}
        isCurrentUser={isCurrentUser}
      />
    </Container>
  );
};

export default EmployeeDetailPage;