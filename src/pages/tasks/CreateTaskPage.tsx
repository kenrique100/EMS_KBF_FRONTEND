import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';
import { useCreateTask } from '@/api/tasks';
import { getEmployees } from '@/api/employees';
import TaskForm from '@/components/tasks/TaskForm';
import PageHeader from '@/components/common/PageHeader';
import { Container, CircularProgress, Box } from '@mui/material';
import { CreateTaskDTO } from '@/utils/types';

const CreateTaskPage = () => {
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { mutate: createTask } = useCreateTask();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data.map(e => ({ id: e.id, name: e.name })));
            } catch (error) {
                showNotification('Failed to load employees', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, [showNotification]);

    const handleSubmit = (taskData: CreateTaskDTO) => {
        createTask(taskData, {
            onSuccess: () => {
                navigate('/tasks');
            }
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
          <PageHeader title="Create New Task" />
          <TaskForm
            employees={employees}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
      </Container>
    );
};

export default CreateTaskPage;
