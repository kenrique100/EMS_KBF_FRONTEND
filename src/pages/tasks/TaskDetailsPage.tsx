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
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const { hasRole } = useAuthStore();
  const MotionCard = motion(Card);
  const MotionBox = motion(Box);

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

  const handleValidate = async (approve: boolean) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await validateTask({
          taskId: Number(id),
          approve
        });
        notify(`Task ${approve ? 'approved' : 'rejected'}`, 'success');
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
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button variant="contained" onClick={() => navigate(`/tasks/${id}/edit`)}>
              Edit
            </Button>
          </motion.div>
        }
      />

      {task && (
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            mt: 2,
            boxShadow: 3,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <TaskStatus
              task={task}
              onStatusChange={handleStatusChange}
              isSubmitting={isSubmitting}
            />

            {hasRole('ROLE_ADMIN') && task.status === 'COMPLETED' && !task.isValidated && (
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
                <MotionBox
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
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
                </MotionBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <MotionBox
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
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
                </MotionBox>
              </Grid>
            </Grid>
          </CardContent>
        </MotionCard>
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