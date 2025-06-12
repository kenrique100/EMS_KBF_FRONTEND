// src/pages/tasks/TasksPage.tsx
import { useNavigate } from 'react-router-dom';
import { useTasks } from '@/api/tasks';
import TaskList from '@/components/tasks/TaskList';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, CircularProgress, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/contexts/AuthContext';

const TasksPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data: tasks, isLoading, isError } = useTasks();

  const handleViewDetails = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          Failed to load tasks
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Tasks"
        action={
          isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tasks/new')}
            >
              Add Task
            </Button>
          )
        }
      />
      <TaskList
        tasks={tasks || []}
        onViewDetails={handleViewDetails}
      />
    </Container>
  );
};

export default TasksPage;