import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import TaskForm from '@/components/tasks/TaskForm';
import PageHeader from '@/components/common/PageHeader';
import { getEmployees } from '@/api/employees';
import useTask from '@/hooks/useTask';
import { TaskDTO, EmployeeDTO } from '@/types';
import { notify } from '@/store/notificationService';

interface EmployeeOption {
  id: number;
  name: string;
}

const TaskEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    task,
    fetchTaskById,
    modifyTask,
    loading: taskLoading,
  } = useTask();

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      if (id) {
        await fetchTaskById(Number(id));
      }

      const data: EmployeeDTO[] = await getEmployees();
      const validEmployees = data
        .filter((e): e is EmployeeDTO & { id: number } => e.id !== undefined)
        .map((e) => ({
          id: e.id as number,
          name: e.name
        }));
      setEmployees(validEmployees);
    } catch {
      notify('Failed to load task or employees', 'error');
    } finally {
      setLoadingEmployees(false);
    }
  }, [id, fetchTaskById]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSubmit = async (taskData: TaskDTO) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await modifyTask(Number(id), {
        ...taskData,
        employeeId: Number(taskData.employeeId),
        expectedHours: Number(taskData.expectedHours || 0)
      });
      notify('Task updated successfully', 'success');
      navigate(`/tasks/${id}`);
    } catch {
      notify('Failed to update task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (taskLoading || loadingEmployees) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          Failed to load task data
        </Typography>
      </Container>
    );
  }

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
        initialValues={task}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        employees={employees}
      />
    </Container>
  );
};

export default TaskEditPage;