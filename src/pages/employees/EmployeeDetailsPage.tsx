import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '@/components/common/PageHeader';
import { useEmployeeById } from '@/api/employees';
import { useDeleteEmployee, useUpdateEmployee } from '@/api/employees';
import { useNotification } from '@/contexts/NotificationContext';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import FileActions from '@/components/common/FileActions';
import FileUpload from '@/components/common/FileUpload';
import { useAuthStore } from '@/store/authStore';
import { Employee, EmployeeFormData, FileUploadResponse } from '@/types';

const EmployeeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuthStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { data: employee, isLoading, refetch } = useEmployeeById(id!);
  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();
  const { mutateAsync: updateEmployee } = useUpdateEmployee();

  // Helper to convert Employee -> EmployeeFormData
  const toEmployeeFormData = (employee: Employee): EmployeeFormData => ({
    id: employee.id,
    username: employee.username,
    name: employee.name,
    email: employee.email ?? '',
    phoneNumber: employee.phoneNumber ?? '',
    department: employee.department ?? '',
    password: employee.password ?? '',
    dateOfEmployment:
      typeof employee.dateOfEmployment === 'string'
        ? new Date(employee.dateOfEmployment)
        : employee.dateOfEmployment,
    status: employee.status,
    profilePicture: employee.profilePicture ?? null,
    document: employee.document ?? null,
  });

  const handleDeleteEmployee = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id!);
        showNotification('Employee deleted successfully', 'success');
        navigate('/employees');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee';
        showNotification(errorMessage, 'error');
      }
    }
  };

  const handleDocumentUploadSuccess = async (response: FileUploadResponse) => {
    try {
      const formData = {
        ...toEmployeeFormData(employee!),
        document: response.filename,
      };
      await updateEmployee({ id: id!, data: formData });
      await refetch();
      showNotification('Document uploaded successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update document';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDocumentDeleteSuccess = async () => {
    try {
      const formData = {
        ...toEmployeeFormData(employee!),
        document: null,
      };
      await updateEmployee({ id: id!, data: formData });
      await refetch();
      showNotification('Document deleted successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove document';
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

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Employee Details"
        breadcrumbs={[
          { label: 'Employees', path: '/employees' },
          { label: employee.name, path: '' },
        ]}
        action={
          <Box display="flex" gap={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/employees')}
              variant="outlined"
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>
            {isAdmin && (
              <>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/employees/${id}/edit`)}
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 120 }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteEmployee}
                  variant="contained"
                  color="error"
                  sx={{ minWidth: 120 }}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </>
            )}
          </Box>
        }
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <EmployeeProfile employee={employee} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Divider sx={{ my: 2 }} />
              {employee.document ? (
                <FileActions
                  filename={employee.document as string}
                  subDirectory="documents"
                  onDeleteSuccess={handleDocumentDeleteSuccess}
                  disabled={!isAdmin}
                />
              ) : isAdmin ? (
                <FileUpload
                  label="Upload Document"
                  subDirectory="documents"
                  accept=".pdf,.doc,.docx"
                  onUploadSuccess={handleDocumentUploadSuccess}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No documents uploaded
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDetailsPage;
