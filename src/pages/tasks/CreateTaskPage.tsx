// src/pages/tasks/CreateTaskPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTask } from '@/api/tasks';
import { getEmployees } from '@/api/employees';
import TaskForm from '@/components/tasks/TaskForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, CircularProgress, Box } from '@mui/material';
import { useNotification } from '@/contexts/NotificationContext';
import { CreateTaskDTO } from '@/types';

const CreateTaskPage = () => {
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { mutate: createTask, isPending } = useCreateTask();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(
          data.map((employee) => ({
            id: employee.id,
            name: employee.name,
          }))
        );
      } catch (error) {
        showNotification('Failed to load employees', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchEmployees();
  }, [showNotification]);

  const handleSubmit = (taskData: CreateTaskDTO) => {
    createTask(taskData, {
      onSuccess: () => {
        navigate('/tasks');
      },
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Create New Task"
        breadcrumbs={[
          { label: 'Tasks', path: '/tasks' },
          { label: 'Create', path: '' },
        ]}
      />
      <TaskForm
        employees={employees}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitButtonText="Create Task"
      />
    </Container>
  );
};

export default CreateTaskPage;