import React, { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import TaskList from '@/components/tasks/TaskList';
import SalaryList from '@/components/salaries/SalaryList';
import { useAuthStore } from '@/store/authStore';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import { Employee, Task, SalaryPayment } from '@/types';
import { useNavigate } from 'react-router-dom';
import { getSalaryPaymentsForEmployee } from '@/api/salaries';
import { getTasksForEmployee } from '@/api/tasks';
import { getEmployeeProfile } from '@/api/employees';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [salaries, setSalaries] = useState<SalaryPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch employee profile
        const profileData = await getEmployeeProfile();
        setEmployee(profileData);

        if (profileData.id) {
          // Fetch employee-specific tasks
          const tasksData = await getTasksForEmployee(profileData.id);
          setTasks(tasksData);

          // Fetch employee-specific salaries
          const salariesData = await getSalaryPaymentsForEmployee(profileData.id);
          setSalaries(salariesData);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleViewSalaryDetails = (id: number) => {
    navigate(`/salaries/${id}`);
  };

  const handleViewTaskDetails = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  if (loading || !employee) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        title="My Profile"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Profile', path: '/profile' }
        ]}
      />

      <EmployeeProfile employee={employee} />

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mt: 3 }}>
        <Tab label="My Tasks" />
        <Tab label="My Salary History" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <>
            {tasks.length > 0 ? (
              <TaskList
                tasks={tasks}
                onViewDetails={handleViewTaskDetails}
              />
            ) : (
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                No tasks assigned to you
              </Typography>
            )}
          </>
        )}

        {activeTab === 1 && (
          <SalaryList
            salaries={salaries}
            onViewDetails={handleViewSalaryDetails}
            isProfileView={true}
          />
        )}
      </Box>
    </Container>
  );
};

export default ProfilePage;