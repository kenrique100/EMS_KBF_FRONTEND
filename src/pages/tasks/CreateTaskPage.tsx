import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateTask } from '@/api/tasks';
import { getEmployees } from '@/api/employees';
import TaskForm from '@/components/tasks/TaskForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, CircularProgress, Box } from '@mui/material';
import { useNotification } from '@/contexts/NotificationContext';
import { CreateTaskDTO } from '@/types';

interface EmployeeOption {
  id: number;
  name: string;
}

const CreateTaskPage = () => {
  const [searchParams] = useSearchParams();
  const employeeIdParam = searchParams.get('employeeId');
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { mutate: createTask, isPending } = useCreateTask();

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
        setIsLoading(false);
      }
    };

    void fetchEmployees();
  }, [showNotification]);

  const handleSubmit = (taskData: CreateTaskDTO) => {
    createTask(taskData, {
      onSuccess: () => {
        showNotification('Task created successfully', 'success');
        navigate('/tasks');
      },
      onError: (error: Error) => {
        showNotification(error.message || 'Failed to create task', 'error');
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
        initialData={{
          employeeId: employeeIdParam ? Number(employeeIdParam) : 0,
        }}
      />
    </Container>
  );
};

export default CreateTaskPage;
