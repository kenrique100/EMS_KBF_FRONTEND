// src/pages/tasks/TasksPage.tsx
import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import TaskList from '@/components/tasks/TaskList';
import PageHeader from '@/components/common/PageHeader';
import { useAuthStore } from '@/store/authStore';
import { Task } from '@/types';
import Loading from '@/components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '@/api/tasks';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { hasRole } = useAuthStore();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreate = () => {
    navigate('/tasks/create');
  };

  const handleViewDetails = (id: string) => {
    navigate(`/tasks/${id}`);
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
      />
    </Container>
  );
};

export default TasksPage;