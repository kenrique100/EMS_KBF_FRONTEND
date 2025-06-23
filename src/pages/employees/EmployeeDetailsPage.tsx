// src/pages/employees/EmployeeDetailsPage.tsx
import React, { useState, useEffect } from 'react';
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
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Skeleton
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Person as PersonIcon,
  AttachFile as AttachFileIcon,
  History as HistoryIcon,
  Paid as PaidIcon,
  Assignment as AssignmentIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { getEmployeeById, deleteEmployee, updateEmployeeStatus, getEmployeeStatusHistory } from '@/api/employees';
import { getSalaryPaymentsForEmployee } from '@/api/salaries';
import { getTasksForEmployee } from '@/api/tasks';
import { Employee, EmployeeStatusUpdateDTO } from '@/types';
import { getDepartmentDisplayName } from '@/utils/departmentUtils';
import { getFileUrl } from '@/utils/fileUtils';
import EmployeeStatusHistory from '@/components/employees/EmployeeStatusHistory';
import { notify } from '@/store/notificationService';
import StatusUpdateDialog from '@/components/employees/StatusUpdateDialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/utils/formatters';
import DetailCard from '@/components/employees/DetailCard';
import ProfileHeader from '@/components/employees/ProfileHeader';

const ConfirmationDialog = ({
                              open,
                              onClose,
                              onConfirm,
                              title,
                              content,
                              confirmText = 'Confirm',
                              confirmColor = 'primary'
                            }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          sx={{ ml: 1 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EmployeeDetailsPage: React.FC = () => {
  const { id: rawId } = useParams<{ id?: string }>();
  const id = rawId ?? '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { data: salaries, isLoading: isSalariesLoading } = useQuery({
    queryKey: ['employeeSalaries', id],
    queryFn: () => getSalaryPaymentsForEmployee(Number(id)),
    enabled: !!id,
  });

  const { data: statusHistory, isLoading: isStatusHistoryLoading } = useQuery({
    queryKey: ['employeeStatusHistory', id],
    queryFn: () => getEmployeeStatusHistory(Number(id)),
    enabled: !!id,
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['employeeTasks', id],
    queryFn: () => getTasksForEmployee(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (!rawId) {
          notify('No employee ID provided', 'error');
          navigate('/employees');
          return;
        }

        const data = await getEmployeeById(Number(rawId));
        setEmployee(data);
      } catch (error) {
        notify('Failed to load employee details', 'error');
        navigate('/employees', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [rawId, navigate]);

  const handleEdit = () => {
    if (id) navigate(`/employees/${id}/edit`);
  };

  const handleStatusUpdate = async (updateData: EmployeeStatusUpdateDTO) => {
    try {
      if (!employee) return;
      const updatedEmployee = await updateEmployeeStatus(employee.id, updateData);
      setEmployee(updatedEmployee);
      notify('Employee status updated successfully', 'success');
    } catch (error) {
      notify('Failed to update employee status', 'error');
    } finally {
      setStatusDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!employee) return;
      await deleteEmployee(employee.id);
      notify('Employee deleted successfully', 'success');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['employees'] }),
        queryClient.invalidateQueries({ queryKey: ['employeeSalaries', id] }),
        queryClient.invalidateQueries({ queryKey: ['employeeTasks', id] }),
      ]);

      navigate('/employees');
    } catch (error) {
      notify('Failed to delete employee', 'error');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ProfileHeader loading />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
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

  const profileUrl = getFileUrl(employee.profilePicturePath);
  const documentUrl = getFileUrl(employee.documentPath, true);

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
        {/* Left Column - Profile Section */}
        <Grid item xs={12} md={4}>
          <ProfileHeader
            name={employee.name}
            department={getDepartmentDisplayName(employee.department)}
            status={employee.status}
            profileUrl={profileUrl}
            onEdit={handleEdit}
            onDelete={() => setDeleteDialogOpen(true)}
            onStatusUpdate={() => setStatusDialogOpen(true)}
          />

          <DetailCard
            title="Contact Information"
            icon={<PersonIcon color="primary" />}
          >
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
          </DetailCard>

          <DetailCard
            title="Employment Details"
            icon={<WorkIcon color="primary" />}
          >
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
          </DetailCard>

          {documentUrl && (
            <DetailCard
              title="Documents"
              icon={<AttachFileIcon color="primary" />}
            >
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                component="a"
                href={documentUrl}
                download
                fullWidth
              >
                Download Document
              </Button>
            </DetailCard>
          )}
        </Grid>

        {/* Right Column - Details Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
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
                                ${salary.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={salary.status}
                                  size="small"
                                  color={
                                    salary.status === 'PAID' ? 'success' :
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs */}
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