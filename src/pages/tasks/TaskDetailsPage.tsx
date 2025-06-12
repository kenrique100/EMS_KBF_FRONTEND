// src/pages/tasks/TaskDetailsPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useTask, useUpdateTaskStatus, useDeleteTask } from '@/api/tasks';
import TaskStatusButton from '@/components/tasks/TaskStatusButton';
import PageHeader from '@/components/common/PageHeader';
import { Container, Button, Box, Typography, Paper, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatDate } from '@/utils/formatters';
import { useAuthStore } from '@/store/authStore';

const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();

  const { data: task, isLoading, isError } = useTask(id!);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus();
  const { mutate: deleteTask } = useDeleteTask();

  const handleStatusChange = (action: 'START' | 'STOP' | 'COMPLETE') => {
    if (id) {
      updateStatus({ taskId: id, action });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id!, {
        onSuccess: () => {
          navigate('/tasks');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !task) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          Failed to load task data
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tasks')}
          sx={{ mt: 2 }}
        >
          Back to Tasks
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Task Details"
        action={
          <Box display="flex" gap={1}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/tasks')}
              variant="outlined"
            >
              Back
            </Button>
            {isAdmin && (
              <>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/tasks/${id}/edit`)}
                  variant="contained"
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
              </>
            )}
            <TaskStatusButton
              task={task}
              onStatusChange={handleStatusChange}
              disabled={isUpdating}
            />
          </Box>
        }
      />
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Assigned to: {task.employeeName || `Employee ID: ${task.employeeId}`}
        </Typography>

        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">
            {task.description || 'No description provided'}
          </Typography>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={4}>
          <Box>
            <Typography variant="subtitle2">Status</Typography>
            <Typography variant="body1">{task.status}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Deadline</Typography>
            <Typography variant="body1">{formatDate(task.deadline)}</Typography>
          </Box>
          {task.expectedHours && (
            <Box>
              <Typography variant="subtitle2">Expected Hours</Typography>
              <Typography variant="body1">{task.expectedHours}</Typography>
            </Box>
          )}
          {task.startTime && (
            <Box>
              <Typography variant="subtitle2">Started At</Typography>
              <Typography variant="body1">{formatDate(task.startTime)}</Typography>
            </Box>
          )}
          {task.stopTime && (
            <Box>
              <Typography variant="subtitle2">Stopped At</Typography>
              <Typography variant="body1">{formatDate(task.stopTime)}</Typography>
            </Box>
          )}
          {task.actualHours && (
            <Box>
              <Typography variant="subtitle2">Actual Hours</Typography>
              <Typography variant="body1">{task.actualHours.toFixed(2)}</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskDetailsPage;