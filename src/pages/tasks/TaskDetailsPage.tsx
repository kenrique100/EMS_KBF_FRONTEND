// src/pages/tasks/TaskDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Card, CardContent, Grid, Divider } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import TaskStatus from '@/components/tasks/TaskStatus';
import useTask from '@/hooks/useTask';
import { formatDate } from '@/utils/formatters';
import { notify } from '@/store/notificationService';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { task, fetchTaskById, updateTaskStatus, loading, error } = useTask();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (id) {
      fetchTaskById(Number(id));
    }
  }, [id, fetchTaskById]);

  useEffect(() => {
    if (error) {
      notify(error, 'error');
    }
  }, [error]);

  const handleStatusChange = async (action: string) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await updateTaskStatus(Number(id), action);
        notify('Task status updated successfully', 'success');
      }
    } catch (err) {
      notify('Failed to update task status', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !task) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Task Details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Tasks', path: '/tasks' },
          { label: task?.title || 'Details', path: `/tasks/${id}` }
        ]}
        action={
          <Button
            variant="contained"
            onClick={() => navigate(`/tasks/${id}/edit`)}
          >
            Edit
          </Button>
        }
      />
      {task && (
        <Card>
          <CardContent>
            <TaskStatus
              task={task}
              onStatusChange={handleStatusChange}
              isSubmitting={isSubmitting}
            />
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Task Information
                </Typography>
                <Box mb={2}>
                  <Typography variant="subtitle2">Title</Typography>
                  <Typography>{task.title}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography>{task.description || 'N/A'}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2">Deadline</Typography>
                  <Typography>
                    {formatDate(task.deadline)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Assignment Details
                </Typography>
                <Box mb={2}>
                  <Typography variant="subtitle2">Assigned To</Typography>
                  <Typography>{task.employeeName}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2">Expected Hours</Typography>
                  <Typography>{task.expectedHours}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="subtitle2">Actual Hours</Typography>
                  <Typography>{task.actualHours || 'N/A'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default TaskDetailPage;