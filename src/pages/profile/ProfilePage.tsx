import React, { useState, useEffect } from 'react';
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import { useNavigate } from 'react-router-dom';
import { getOwnProfile } from '@/api/employees';
import { getTasksForEmployee } from '@/api/tasks';
import { getSalaryPaymentsForEmployee } from '@/api/salaries';
import { TaskDTO, SalaryPaymentDTO, EmployeeProfileDTO } from '@/types';
import { formatDate } from '@/utils/formatters';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaidIcon from '@mui/icons-material/Paid';
import { notify } from '@/store/notificationService';
import { uploadProfilePicture } from '@/api/profilePictures';
import { useQuery } from '@tanstack/react-query';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const { data: employee, isLoading: isEmployeeLoading } = useQuery<EmployeeProfileDTO>({
    queryKey: ['ownProfile'],
    queryFn: getOwnProfile,
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery<TaskDTO[]>({
    queryKey: ['ownTasks'],
    queryFn: () => employee?.id ? getTasksForEmployee(employee.id) : [],
    enabled: !!employee?.id,
  });

  const { data: salaries, isLoading: isSalariesLoading } = useQuery<SalaryPaymentDTO[]>({
    queryKey: ['ownSalaries'],
    queryFn: () => employee?.id ? getSalaryPaymentsForEmployee(employee.id) : [],
    enabled: !!employee?.id,
  });

  const handleProfilePictureUpdate = async (file: File) => {
    if (!employee?.id) return;

    try {
      await uploadProfilePicture(employee.id, file);
      notify('Profile picture updated successfully', 'success');
    } catch (error) {
      notify('Failed to update profile picture', 'error');
    }
  };

  if (isEmployeeLoading || !employee) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        title="My Profile"
        breadcrumbs={[{ label: 'Profile', path: '/profile' }]}
      />

      <EmployeeProfile employee={employee} onProfilePictureUpdate={handleProfilePictureUpdate} />

      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{ mt: 3 }}
        variant="fullWidth"
      >
        <Tab label="My Tasks" icon={<AssignmentIcon />} />
        <Tab label="My Salary History" icon={<PaidIcon />} />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Assigned Tasks
            </Typography>
            {isTasksLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : tasks && tasks.length > 0 ? (
              <TableContainer component={Paper}>
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
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{formatDate(task.deadline)}</TableCell>
                        <TableCell>
                          <Chip
                            label={task.status}
                            size="small"
                            color={
                              task.status === 'COMPLETED'
                                ? 'success'
                                : task.status === 'IN_PROGRESS'
                                  ? 'warning'
                                  : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography align="center" sx={{ py: 4 }}>
                No tasks assigned to you
              </Typography>
            )}
          </>
        )}

        {activeTab === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Salary Payments
            </Typography>
            {isSalariesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : salaries && salaries.length > 0 ? (
              <TableContainer component={Paper}>
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
                      <TableRow
                        key={salary.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/salaries/${salary.id}`)}
                      >
                        <TableCell>{formatDate(salary.paymentDate)}</TableCell>
                        <TableCell align="right">${salary.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={salary.status}
                            size="small"
                            color={
                              salary.status === 'PROCESSED'
                                ? 'success'
                                : salary.status === 'PENDING'
                                  ? 'warning'
                                  : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography align="center" sx={{ py: 4 }}>
                No salary records found
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default ProfilePage;