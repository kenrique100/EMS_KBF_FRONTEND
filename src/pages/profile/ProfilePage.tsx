// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
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
  Chip
} from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import { useNavigate } from 'react-router-dom';
import { getOwnProfile, updateOwnProfilePicture } from '@/api/employees';
import { getTasksForEmployee } from '@/api/tasks';
import { getSalaryPaymentsForEmployee } from '@/api/salaries';
import { Task, SalaryPayment, EmployeeProfileDTO } from '@/types';
import { formatDate } from '@/utils/formatters';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaidIcon from '@mui/icons-material/Paid';
import { notify } from '@/store/notificationService';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [employee, setEmployee] = useState<EmployeeProfileDTO | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [salaries, setSalaries] = useState<SalaryPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await getOwnProfile();
        setEmployee(profileData);

        if (profileData.id !== undefined) {
          const [taskData, salaryData] = await Promise.all([
            getTasksForEmployee(profileData.id),
            getSalaryPaymentsForEmployee(profileData.id)
          ]);
          setTasks(taskData as Task[]);
          setSalaries(salaryData as SalaryPayment[]);
        }
      } catch (err) {
        console.error('Error fetching profile info:', err);
        notify('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfilePictureUpdate = async (file: File) => {
    try {
      const updatedProfile = await updateOwnProfilePicture(file);
      setEmployee(updatedProfile);
      notify('Profile picture updated successfully', 'success');
    } catch (error) {
      notify('Failed to update profile picture', 'error');
    }
  };

  if (loading || !employee) return <Loading />;

  return (
    <Container maxWidth="md">
      <PageHeader
        title="My Profile"
        breadcrumbs={[{ label: 'Profile', path: '/profile' }]}
      />

      <EmployeeProfile employee={employee} />

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
            {tasks.length > 0 ? (
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
                    {tasks.map((task: Task) => (
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
            {salaries.length > 0 ? (
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
                    {salaries.map((salary: SalaryPayment) => (
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
