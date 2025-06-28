import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import TaskList from '@/components/tasks/TaskList';
import PageHeader from '@/components/common/PageHeader';
import { useAuthStore } from '@/store/authStore';
import { Task, TaskDTO } from '@/types';
import Loading from '@/components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { getTasks } from '@/api/tasks';
import ValidationDialog from '@/components/tasks/ValidationDialog';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { hasRole } = useAuthStore();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(); // returns TaskDTO[]
        // Convert TaskDTO[] to Task[]
        const mappedTasks: Task[] = data
          .filter((t): t is Required<TaskDTO> => typeof t.id === 'number' && typeof t.expectedHours === 'number' && !!t.createdAt && !!t.updatedAt)
          .map((t) => ({
            id: t.id!,
            title: t.title,
            description: t.description,
            deadline: t.deadline,
            employeeId: t.employeeId,
            employeeName: t.employeeName,
            status: t.status ?? 'PENDING',
            expectedHours: t.expectedHours!,
            actualHours: t.actualHours,
            totalWorkedMinutes: t.totalWorkedMinutes,
            startTime: t.startTime,
            stopTime: t.stopTime,
            lastResumeTime: t.lastResumeTime,
            isValidated: t.isValidated,
            validationTime: t.validationTime,
            createdAt: t.createdAt!,
            updatedAt: t.updatedAt!
          }));

        setTasks(mappedTasks);
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

  const handleEdit = (id: string) => {
    navigate(`/tasks/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    console.log('Delete task', id);
  };

  const handleValidateClick = (id: string) => {
    setSelectedTaskId(id);
    setValidationDialogOpen(true);
  };

  const handleValidate = async (approve: boolean) => {
    if (!selectedTaskId) return;

    try {
      console.log(`Validating task ${selectedTaskId}: ${approve ? 'approve' : 'reject'}`);
      setValidationDialogOpen(false);
    } catch (error) {
      console.error('Failed to validate task:', error);
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
        onValidate={hasRole('ROLE_ADMIN') ? handleValidateClick : undefined}
      />

      <ValidationDialog
        open={validationDialogOpen}
        onClose={() => setValidationDialogOpen(false)}
        onConfirm={handleValidate}
      />
    </Container>
  );
};

export default TasksPage;
