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
import { motion } from 'framer-motion';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { task, fetchTaskById, updateTaskStatus, loading, error } = useTask();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
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
    </Container>
  );
};

export default TaskDetailPage;