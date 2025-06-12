// src/pages/tasks/EmployeeTasksPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useTasksByEmployee } from '@/api/tasks';
import { useEmployeeById } from '@/api/employees';
import TaskList from '@/components/tasks/TaskList';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, CircularProgress, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';

const EmployeeTasksPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const {
    data: employee,
    isLoading: isEmployeeLoading,
    isError: isEmployeeError,
  } = useEmployeeById(id!);

  const {
    data: tasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useTasksByEmployee(id!);

  const handleViewDetails = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  if (isEmployeeLoading || isTasksLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isEmployeeError || isTasksError) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          Failed to load employee or tasks
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={`Tasks for ${employee?.name}`}
        action={
          <Box display="flex" gap={1}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/employees/${id}`)}
              variant="outlined"
            >
              Back to Employee
            </Button>
            {isAdmin && (
              <Button
                startIcon={<AddIcon />}
                onClick={() => navigate(`/tasks/new?employeeId=${id}`)}
                variant="contained"
              >
                Add Task
              </Button>
            )}
          </Box>
        }
      />
      <TaskList
        tasks={tasks?.map(task => ({
          ...task,
          employeeName: employee?.name,
        })) || []}
        onViewDetails={handleViewDetails}
      />
    </Container>
  );
};

export default EmployeeTasksPage;