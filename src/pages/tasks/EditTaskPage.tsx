import { useParams, useNavigate } from 'react-router-dom';
import { useTaskById, useUpdateTask } from '@/api/tasks';
import { getEmployees } from '@/api/employees';
import TaskForm from '@/components/tasks/TaskForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import { useNotification } from '@/contexts/NotificationContext';
import { CreateTaskDTO } from '@/types';
import { useEffect, useState } from 'react';

interface EmployeeOption {
  id: number;
  name: string;
}

const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { data: task, isLoading, isError } = useTaskById(Number(id));
  const { mutate: updateTask, isPending } = useUpdateTask();
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data.map((e) => ({ id: e.id, name: e.name })));
      } catch (error) {
        showNotification(
          error instanceof Error ? error.message : 'Failed to load employees',
          'error'
        );
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    void fetchEmployees();
  }, [showNotification]);


  const handleSubmit = (taskData: CreateTaskDTO) => {
    if (!task) return;

    updateTask(
      {
        id: task.id,
        data: taskData,
      },
      {
        onSuccess: () => {
          showNotification('Task updated successfully', 'success');
          navigate(`/tasks/${id}`);
        },
        onError: (error: Error) => {
          showNotification(error.message || 'Failed to update task', 'error');
        },
      }
    );
  };

  if (isLoading || isLoadingEmployees) {
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
      </Container>
    );
  }

  const initialData: CreateTaskDTO = {
    title: task.title,
    description: task.description,
    deadline: task.deadline instanceof Date
      ? task.deadline.toISOString()
      : task.deadline,
    employeeId: task.employeeId,
    status: task.status,
    expectedHours: task.expectedHours,
    actualHours: task.actualHours,
    startTime: task.startTime ?? undefined,
    stopTime: task.stopTime ?? undefined,
  };


  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Edit Task"
        breadcrumbs={[
          { label: 'Tasks', path: '/tasks' },
          { label: task.title, path: `/tasks/${task.id}` },
          { label: 'Edit', path: '' },
        ]}
      />
      <TaskForm
        employees={employees}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitButtonText="Update Task"
        initialData={initialData}
      />
    </Container>
  );
};

export default EditTaskPage;
