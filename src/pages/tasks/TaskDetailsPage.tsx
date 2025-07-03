// src/pages/tasks/TaskDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Card, CardContent, Grid, Divider } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import TaskStatus from '@/components/tasks/TaskStatus';
import ValidationDialog from '@/components/tasks/ValidationDialog';
import useTask from '@/hooks/useTask';
import { formatDate } from '@/utils/formatters';
import { notify } from '@/store/notificationService';
import { useAuthStore } from '@/store/authStore';
import { ActionType } from '@/types';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    task,
    fetchTaskById,
    updateTaskStatus,
    validateTask,
    loading,
    error
  } = useTask();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const { hasRole } = useAuthStore();

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

  const handleStatusChange = async (action: ActionType) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await updateTaskStatus({
          taskId: Number(id),
          action
        });
        notify('Task status updated successfully', 'success');
        await fetchTaskById(Number(id));
      }
    } catch (err) {
      notify('Failed to update task status', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidate = async (approve: boolean) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await validateTask({
          taskId: Number(id),
          approve
        });
        notify(`Task ${approve ? 'approved' : 'rejected'}`, 'success');
        await fetchTaskById(Number(id));
      }
    } catch (err) {
      notify('Failed to validate task', 'error');
    } finally {
      setIsSubmitting(false);
      setValidationDialogOpen(false);
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
          hasRole('ROLE_ADMIN') && (
            <Button
              variant="contained"
              onClick={() => navigate(`/tasks/${id}/edit`)}
            >
              Edit
            </Button>
          )
        }
      />

      {task && (
        <Card sx={{ mt: 2, boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <TaskStatus
              task={task}
              onStatusChange={handleStatusChange}
              isSubmitting={isSubmitting}
            />

            {hasRole('ROLE_ADMIN') && task.status === 'IN_PROGRESS' && task.submitted && (
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setValidationDialogOpen(true)}
                  disabled={isSubmitting}
                >
                  Validate Task
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
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
                    <Typography>{formatDate(task.deadline)}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Assignment Details
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Assigned To</Typography>
                    <Typography>{task.employeeName || 'N/A'}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Expected Hours</Typography>
                    <Typography>{task.expectedHours || 'N/A'}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2">Actual Hours</Typography>
                    <Typography>{task.actualHours || 'N/A'}</Typography>
                  </Box>
                  {task.startTime && (
                    <Box mb={2}>
                      <Typography variant="subtitle2">Start Time</Typography>
                      <Typography>{formatDate(task.startTime)}</Typography>
                    </Box>
                  )}
                  {task.stopTime && (
                    <Box mb={2}>
                      <Typography variant="subtitle2">Stop Time</Typography>
                      <Typography>{formatDate(task.stopTime)}</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <ValidationDialog
        open={validationDialogOpen}
        onClose={() => setValidationDialogOpen(false)}
        onConfirm={handleValidate}
      />
    </Container>
  );
};

export default TaskDetailPage;