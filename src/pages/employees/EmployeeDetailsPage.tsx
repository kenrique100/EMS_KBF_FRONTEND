import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button,
  Card, CardContent, Grid, Link, Chip, Avatar
} from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import { getEmployeeById } from '@/api/employees';
import { Employee } from '@/types';
import { formatDate } from '@/utils/formatters';
import Loading from '@/components/common/Loading';
import { useAuthStore } from '@/store/authStore';

const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuthStore();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      try {
        const data = await getEmployeeById(Number(id));
        setEmployee(data);
      } catch (error) {
        console.error('Failed to fetch employee details:', error);
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const handleEdit = () => {
    if (id) navigate(`/employees/${id}/edit`);
  };

  if (loading) {
    return <Loading />;
  }

  if (!employee) {
    return (
      <Container>
        <Typography variant="h6">Employee not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        title={employee.name}
        action={
          hasRole('ROLE_ADMIN') && (
            <Button variant="contained" onClick={handleEdit}>
              Edit Employee
            </Button>
          )
        }
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Employees', path: '/employees' },
          { label: employee.name, path: `/employees/${employee.id}` }
        ]}
      />

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {employee.profilePicturePath ? (
                <Avatar
                  src={`${import.meta.env.VITE_API_BASE_URL}/api/files/${employee.profilePicturePath}`}
                  sx={{ width: 300, height: 300, borderRadius: 1 }}
                />
              ) : (
                <Box
                  sx={{
                    height: 300,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                  }}
                >
                  <Typography>No profile picture</Typography>
                </Box>
              )}

              {employee.documentPath && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Document:</Typography>
                  <Link
                    href={`${import.meta.env.VITE_API_BASE_URL}/api/files/${employee.documentPath}`}
                    target="_blank"
                    download
                  >
                    Download Document
                  </Link>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                {employee.name}
              </Typography>

              <Box mb={2}>
                <Chip
                  label={employee.status}
                  color={
                    employee.status === 'ACTIVE' ? 'success' :
                      employee.status === 'ON_LEAVE' ? 'warning' : 'error'
                  }
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Username</Typography>
                  <Typography>{employee.username}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>{employee.email}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography>{employee.phoneNumber || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Department</Typography>
                  <Typography>{employee.department.displayName}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Date of Employment</Typography>
                  <Typography>{formatDate(employee.dateOfEmployment)}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Member Since</Typography>
                  <Typography>{formatDate(employee.createdAt)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmployeeDetailsPage;