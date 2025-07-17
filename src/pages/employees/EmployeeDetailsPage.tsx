import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Divider,
  IconButton,
  TableContainer,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CreditCard as CreditCardIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Paid as PaidIcon,
  History as HistoryIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
} from '@mui/icons-material';
import {
  getEmployeeById,
  deleteEmployee,
  updateEmployeeStatus,
  getEmployeeStatusHistory,
  updateEmployeeProfilePicture
} from '@/api/employees';
import { getSalaryPaymentsForEmployee } from '@/api/salaries';
import { getTasksForEmployee } from '@/api/tasks';
import {
  EmployeeStatusUpdateDTO,
  TaskDTO,
  SalaryPaymentDTO,
  EmployeeDTO,
  EmployeeStatusHistoryDTO,
} from '@/types';
import { formatDate, formatCurrency } from '@/utils/formatters';
import EmployeeStatusHistory from '@/components/employees/EmployeeStatusHistory';
import { notify } from '@/store/notificationService';
import StatusUpdateDialog from '@/components/employees/StatusUpdateDialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProfileHeader from '@/components/employees/ProfileHeader';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { useAuthStore } from '@/store/authStore';
import { EmployeeStatus } from '@/types';

const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const employeeId = Number(id);
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('ROLE_ADMIN');

  const { data: employee, isLoading: isEmployeeLoading } = useQuery<EmployeeDTO>({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(employeeId),
    enabled: !!id,
  });

  const { data: salaries, isLoading: isSalariesLoading } = useQuery<SalaryPaymentDTO[]>({
    queryKey: ['employeeSalaries', id],
    queryFn: () => getSalaryPaymentsForEmployee(employeeId),
    enabled: !!id,
  });

  const { data: statusHistory, isLoading: isStatusHistoryLoading } = useQuery<EmployeeStatusHistoryDTO[]>({
    queryKey: ['employeeStatusHistory', id],
    queryFn: () => getEmployeeStatusHistory(employeeId),
    enabled: !!id,
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery<TaskDTO[]>({
    queryKey: ['employeeTasks', id],
    queryFn: () => getTasksForEmployee(employeeId),
    enabled: !!id,
  });

  const handleProfilePictureUpdate = async (file: File) => {
    if (!id) return;
    try {
      const updatedEmployee = await updateEmployeeProfilePicture(employeeId, file);
      queryClient.setQueryData(['employee', id], updatedEmployee);
      notify('Profile picture updated successfully', 'success');
    } catch (error) {
      notify('Failed to update profile picture', 'error');
    }
  };

  const handleEdit = () => navigate(`/employees/${id}/edit`);

  const handleStatusUpdate = async (updateData: EmployeeStatusUpdateDTO) => {
    if (!employee?.id) return;
    try {
      const updatedEmployee = await updateEmployeeStatus(employee.id, updateData);
      queryClient.setQueryData(['employee', id], updatedEmployee);
      notify('Employee status updated successfully', 'success');
    } catch {
      notify('Failed to update employee status', 'error');
    } finally {
      setStatusDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!employee?.id) return;
    try {
      await deleteEmployee(employee.id);
      notify('Employee deleted successfully', 'success');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['employees'] }),
        queryClient.invalidateQueries({ queryKey: ['employeeSalaries', id] }),
        queryClient.invalidateQueries({ queryKey: ['employeeTasks', id] }),
      ]);
      navigate('/employees');
    } catch {
      notify('Failed to delete employee', 'error');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isEmployeeLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Employee not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/employees')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Employee Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileHeader
            name={employee.name}
            department={employee.department}
            status={employee.status as EmployeeStatus || 'ACTIVE'}
            profileUrl={employee.profilePicturePath}
            onEdit={isAdmin ? handleEdit : undefined}
            onDelete={isAdmin ? () => setDeleteDialogOpen(true) : undefined}
            onStatusUpdate={isAdmin ? () => setStatusDialogOpen(true) : undefined}
            onProfilePictureUpdate={handleProfilePictureUpdate}
          />

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="action" sx={{ mr: 1.5 }} />
                <Typography>{employee.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon color="action" sx={{ mr: 1.5 }} />
                <Typography>{employee.phoneNumber || 'Not provided'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon color="action" sx={{ mr: 1.5 }} />
                <Typography>{employee.username}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employment Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
                <WcIcon color="action" sx={{ mr: 1.5 }} />
                <Typography>{employee.gender}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="action" sx={{ mr: 1.5 }} />
                <Typography>
                  Joined: {formatDate(employee.dateOfEmployment)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCardIcon color="action" sx={{ mr: 1.5 }} />
                <Typography>{employee.nationalId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CakeIcon color="action" sx={{ mr: 1.5 }} />
                <Typography>
                  Born: {formatDate(employee.dateOfBirth)}
                </Typography>
              </Box>
              {employee.statusExpiration && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon color="action" sx={{ mr: 1.5 }} />
                  <Typography>
                    Status until: {formatDate(employee.statusExpiration)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
              >
                <Tab label="Salary History" icon={<PaidIcon />} />
                <Tab label="Assigned Tasks" icon={<AssignmentIcon />} />
                <Tab label="Status History" icon={<HistoryIcon />} />
              </Tabs>

              <Divider sx={{ mb: 3 }} />

              {activeTab === 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Salary Payments
                  </Typography>
                  {isSalariesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : salaries && salaries.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {salaries.map((salary) => (
                            <TableRow key={salary.id} hover>
                              <TableCell>{formatDate(salary.paymentDate)}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(salary.amount)}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={salary.status}
                                  size="small"
                                  color={
                                    salary.status === 'PROCESSED' ? 'success' :
                                      salary.status === 'PENDING' ? 'warning' : 'default'
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 4,
                      border: '1px dashed #ddd',
                      borderRadius: 1
                    }}>
                      <PaidIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography color="textSecondary">
                        No salary records found
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {activeTab === 1 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Task Assignments
                  </Typography>
                  {isTasksLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : tasks && tasks.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tasks.map((task) => (
                            <TableRow
                              key={task.id}
                              hover
                              onClick={() => navigate(`/tasks/${task.id}`)}
                              sx={{ cursor: 'pointer' }}
                            >
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
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 4,
                      border: '1px dashed #ddd',
                      borderRadius: 1
                    }}>
                      <AssignmentIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography color="textSecondary">
                        No tasks assigned
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {activeTab === 2 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Status Changes
                  </Typography>
                  {isStatusHistoryLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : statusHistory && statusHistory.length > 0 ? (
                    <EmployeeStatusHistory history={statusHistory} />
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 4,
                      border: '1px dashed #ddd',
                      borderRadius: 1
                    }}>
                      <HistoryIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography color="textSecondary">
                        No status history records
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <StatusUpdateDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onSubmit={handleStatusUpdate}
        currentStatus={employee.status as EmployeeStatus || 'ACTIVE'}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        content="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
      />
    </Container>
  );
};

export default EmployeeDetailsPage;