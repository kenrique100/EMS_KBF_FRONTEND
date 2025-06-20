import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import TaskForm from '../../components/tasks/TaskForm';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { getEmployees } from '@/api/employees';
import { notify } from '@/store/notificationService';
import { createTask } from '@/api/tasks';

const TaskCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data.map(e => ({ id: e.id, name: e.name })));
      } catch (error) {
        notify('Failed to fetch employees', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createTask(data);
      notify('Task created successfully', 'success');
      navigate('/tasks');
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
      />
    </Container>
  );
};

export default TaskCreatePage;