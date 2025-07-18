import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import TaskForm from '@/components/tasks/TaskForm';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import { getEmployees } from '@/api/employees';
import { notify } from '@/store/notificationService';
import { createTask } from '@/api/tasks';
import { TaskDTO, EmployeeDTO } from '@/types';

interface EmployeeOption {
  id: number;
  name: string;
}

const TaskCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data: EmployeeDTO[] = await getEmployees();
        const employeeOptions = data
          .filter((e): e is EmployeeDTO & { id: number } => e.id !== undefined)
          .map((e) => ({
            id: e.id as number,
            name: e.name
          }));
        setEmployees(employeeOptions);
      } catch (error) {
        notify('Failed to fetch employees', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (taskData: TaskDTO) => {
    setIsSubmitting(true);
    try {
      const createdTask = await createTask({
        ...taskData,
        employeeId: Number(taskData.employeeId), // Ensure this is a number
        expectedHours: Number(taskData.expectedHours || 0)
      });
      notify('Task created successfully', 'success');
      navigate(`/tasks/${createdTask.id}`);
    } catch (error) {
      notify('Failed to create task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Create New Task"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Tasks', path: '/tasks' },
          { label: 'Create', path: '/tasks/create' }
        ]}
      />
      <TaskForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        employees={employees}
        initialValues={{
          employeeId: '', // Empty string for initial value
          expectedHours: 0,
        }}
      />
    </Container>
  );
};

export default TaskCreatePage;