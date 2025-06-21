import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button,
  Card, CardContent, Grid, Link, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import { getEmployeeById, deleteEmployee } from '@/api/employees';
import { Employee } from '@/types';
import { formatDate } from '@/utils/formatters';
import Loading from '@/components/common/Loading';
import { useAuthStore } from '@/store/authStore';
import { getSalaryPaymentsForEmployee } from '@/api/salaries';
import { getTasksForEmployee } from '@/api/tasks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/store/notificationService';
import { getFileUrl } from '@/utils/fileUtils';
import { getDepartmentDisplayName } from '@/utils/departmentUtils';

const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuthStore();

  // Fetch salary data
  const { data: salaries, isLoading: isSalariesLoading } = useQuery({
    queryKey: ['employeeSalaries', id],
    queryFn: () => getSalaryPaymentsForEmployee(Number(id!)),
    enabled: !!id,
  });

  // Fetch task data
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['employeeTasks', id],
    queryFn: () => getTasksForEmployee(Number(id!)),
    enabled: !!id,
  });

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

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this employee and all associated files?')) {
      try {
        await deleteEmployee(Number(id));
        notify('Employee deleted successfully', 'success');

        // Invalidate all relevant queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['employees'] }),
          queryClient.invalidateQueries({ queryKey: ['employeeSalaries'] }),
          queryClient.invalidateQueries({ queryKey: ['employeeTasks'] }),
          queryClient.invalidateQueries({ queryKey: ['salaries'] }),
          queryClient.invalidateQueries({ queryKey: ['tasks'] }),
        ]);

        navigate('/employees');
      } catch (error) {
        console.error('Failed to delete employee:', error);
        notify('Failed to delete employee', 'error');
      }
    }
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

  // Construct file URLs
  const profileUrl = employee?.profilePicturePath
    ? getFileUrl(employee.profilePicturePath)
    : null;

  const documentUrl = employee?.documentPath
    ? getFileUrl(employee.documentPath, true)
    : null;

  return (
    <Container maxWidth="md">
      <PageHeader
        title={employee.name}
        action={
          hasRole('ROLE_ADMIN') && (
            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={handleEdit}>
                Edit Employee
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete Employee
              </Button>
            </Box>
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
              {profileUrl ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    src={profileUrl}
                    sx={{
                      width: 300,
                      height: 300,
                      borderRadius: 1,
                      objectFit: 'cover'
                    }}
                  />
                  <Typography variant="caption" mt={1}>
                    Profile picture extracted from document
                  </Typography>
                </Box>
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

              {documentUrl && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Employee Document
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Link
                      href={documentUrl}
                      target="_blank"
                      download
                    >
                      Download Full Document
                    </Link>
                    <Typography variant="body2" color="textSecondary">
                      (Profile picture extracted from this document)
                    </Typography>
                  </Box>
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
                  <Typography>{getDepartmentDisplayName(employee.department)}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Date of Employment</Typography>
                  <Typography>{formatDate(employee.dateOfEmployment)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Salary History Section */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Salary History
            </Typography>
            {isSalariesLoading ? (
              <Typography>Loading salaries...</Typography>
            ) : salaries && salaries.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment Date</TableCell>
                      <TableCell align="right">Amount ($)</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salaries.map((salary) => (
                      <TableRow key={salary.id}>
                        <TableCell>{formatDate(salary.paymentDate)}</TableCell>
                        <TableCell align="right">{salary.amount.toFixed(2)}</TableCell>
                        <TableCell>{salary.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2">No salary records found</Typography>
            )}
          </Box>

          {/* Tasks Section */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Assigned Tasks
            </Typography>
            {isTasksLoading ? (
              <Typography>Loading tasks...</Typography>
            ) : tasks && tasks.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{formatDate(task.deadline)}</TableCell>
                        <TableCell>
                          <Chip
                            label={task.status}
                            color={
                              task.status === 'COMPLETED' ? 'success' :
                                task.status === 'IN_PROGRESS' ? 'warning' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2">No tasks assigned</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmployeeDetailsPage;