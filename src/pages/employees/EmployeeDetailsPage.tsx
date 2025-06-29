import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
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
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  Assignment as AssignmentIcon,
  Paid as PaidIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  getEmployeeById,
  deleteEmployee,
  updateEmployeeStatus,
  getEmployeeStatusHistory,
  getProductivityStats,
  updateEmployeeProfilePicture
} from '@/api/employees';
import { getSalaryPaymentsForEmployee, downloadSalaryReceipt } from '@/api/salaries';
import { getTasksForEmployee } from '@/api/tasks';
import { EmployeeStatusUpdateDTO, Task, SalaryPaymentDTO, EmployeeDTO } from '@/types';
import { formatDate, formatCurrency } from '@/utils/formatters';
import EmployeeStatusHistory from '@/components/employees/EmployeeStatusHistory';
import { notify } from '@/store/notificationService';
import StatusUpdateDialog from '@/components/employees/StatusUpdateDialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProfileHeader from '@/components/employees/ProfileHeader';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import ProductivityDashboard from '@/pages/dashboard/ProductivityDashboard';
import EditableAvatar from '@/components/common/EditableAvatar';
import { useAuthStore } from '@/store/authStore';

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

  const { data: salaries, isLoading: isSalariesLoading } = useQuery({
    queryKey: ['employeeSalaries', id],
    queryFn: () => getSalaryPaymentsForEmployee(employeeId),
    enabled: !!id,
  });

  const { data: statusHistory, isLoading: isStatusHistoryLoading } = useQuery({
    queryKey: ['employeeStatusHistory', id],
    queryFn: () => getEmployeeStatusHistory(employeeId),
    enabled: !!id,
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['employeeTasks', id],
    queryFn: () => getTasksForEmployee(employeeId),
    enabled: !!id,
  });

  const { data: productivityStats, isLoading: isProductivityLoading } = useQuery({
    queryKey: ['employeeProductivity', id],
    queryFn: () => getProductivityStats(employeeId),
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
      const updatedEmployee = await updateEmployeeStatus(employee.id!, updateData);
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
      await deleteEmployee(employee.id!);
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

      {!isProductivityLoading && productivityStats && (
        <ProductivityDashboard employeeId={employee.id} />
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileHeader
            name={employee.name}
            department={employee.department}
            status={employee.status}
            profileUrl={employee.profilePicturePath}
            onEdit={handleEdit}
            onDelete={() => setDeleteDialogOpen(true)}
            onStatusUpdate={() => setStatusDialogOpen(true)}
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="action" sx={{ mr: 1.5 }} />
                <Typography>
                  Joined: {formatDate(employee.dateOfEmployment)}
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

          {employee.documentPath && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Documents
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  fullWidth
                  href={employee.documentPath}
                  download
                >
                  Download Document
                </Button>
              </CardContent>
            </Card>
          )}
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
                <Tab label="Productivity" icon={<BarChartIcon />} />
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
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {salaries.map((salary: SalaryPaymentDTO) => (
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
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => downloadSalaryReceipt(salary.id!)}
                                  title="Download Receipt"
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
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
                          {(tasks as Task[]).map((task) => (
                            <TableRow key={task.id} hover>
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

              {activeTab === 3 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Detailed Productivity Metrics
                  </Typography>
                  {isProductivityLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : productivityStats ? (
                    <Box>
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2">Period Start</Typography>
                            <Typography>{formatDate(productivityStats.periodStartDate)}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2">Period End</Typography>
                            <Typography>{formatDate(productivityStats.periodEndDate)}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2">Working Days</Typography>
                            <Typography>{productivityStats.workingDays}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle2">Daily Average</Typography>
                            <Typography>{productivityStats.dailyAverage.toFixed(1)} hours</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <Typography color="textSecondary">
                      No productivity data available
                    </Typography>
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
        currentStatus={employee.status}
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