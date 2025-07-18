import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import TaskList from '@/components/tasks/TaskList';
import PageHeader from '@/components/common/PageHeader';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '@/api/tasks';
import { notify } from '@/store/notificationService';
import { useConfirm } from 'material-ui-confirm';
import { mapTaskDTOtoTask } from '@/utils/taskUtils';
import { Task } from '@/types';
import useTask from '@/hooks/useTask';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { hasRole } = useAuthStore();
  const confirm = useConfirm();
  const { deleteTask } = useTask();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        const mappedTasks = data.map(mapTaskDTOtoTask);
        setTasks(mappedTasks);
      } catch (error) {
        notify('Failed to fetch tasks', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreate = () => navigate('/tasks/create');
  const handleViewDetails = (id: number) => navigate(`/tasks/${id}`);
  const handleEdit = (id: number) => navigate(`/tasks/${id}/edit`);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await confirm({
        title: 'Delete Task',
        description: 'This action cannot be undone. Are you sure?',
        confirmationText: 'Delete',
        cancellationText: 'Cancel',
        confirmationButtonProps: { variant: 'contained', color: 'error' },
        cancellationButtonProps: { variant: 'outlined' }
      });

      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      notify('Task deleted successfully', 'success');
    } catch (error) {
      if (error !== 'cancel') {
        notify('Failed to delete task', 'error');
        console.error('Delete error:', error);
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Task Management"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Tasks', path: '/tasks' }
        ]}
        action={
          hasRole('ROLE_ADMIN') && (
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Create New Task
            </Button>
          )
        }
      />

      <TaskList
        tasks={tasks}
        onViewDetails={handleViewDetails}
        onEdit={hasRole('ROLE_ADMIN') ? handleEdit : undefined}
        onDelete={hasRole('ROLE_ADMIN') ? handleDelete : undefined}
        deletingId={deletingId}
      />
    </Container>
  );
};

export default TasksPage;