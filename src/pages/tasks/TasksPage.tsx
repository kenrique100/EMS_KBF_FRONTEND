// src/pages/tasks/TasksPage.tsx
import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import TaskList from '@/components/tasks/TaskList';
import PageHeader from '@/components/common/PageHeader';
import { useAuthStore } from '@/store/authStore';
import { Task, TaskDTO } from '@/types';
import Loading from '@/components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '@/api/tasks';
import { notify } from '@/store/notificationService';

const mapTaskDTOtoTask = (dto: TaskDTO): Task => {
  if (!dto.id) {
    throw new Error('Task ID is required');
  }

  return {
    id: dto.id,
    title: dto.title,
    description: dto.description || '',
    deadline: dto.deadline,
    employeeId: dto.employeeId,
    employeeName: dto.employeeName || '',
    status: dto.status || 'PENDING',
    expectedHours: dto.expectedHours || 0,
    actualHours: dto.actualHours || 0,
    totalWorkedMinutes: dto.totalWorkedMinutes || 0,
    startTime: dto.startTime,
    stopTime: dto.stopTime,
    lastResumeTime: dto.lastResumeTime,
    isValidated: dto.isValidated || false,
    validationTime: dto.validationTime,
    submitted: dto.submitted || false,
    createdAt: dto.createdAt || new Date().toISOString(),
    updatedAt: dto.updatedAt || new Date().toISOString(),
  };
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { hasRole } = useAuthStore();

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

  const handleCreate = () => {
    navigate('/tasks/create');
  };

  const handleViewDetails = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/tasks/${id}/edit`);
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
        onDelete={hasRole('ROLE_ADMIN') ? (id) => console.log('Delete', id) : undefined}
      />
    </Container>
  );
};


export default TasksPage;