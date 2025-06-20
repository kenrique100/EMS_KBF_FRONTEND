import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import TaskForm from '@/components/tasks/TaskForm';
import PageHeader from '@/components/common/PageHeader';
import { getEmployees } from '@/api/employees';
import useTask from '@/hooks/useTask';
import { TaskDTO } from '@/types';
import { notify } from '@/store/notificationService';

const TaskEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    task,
    fetchTaskById,
    modifyTask,
    loading: taskLoading,
  } = useTask();

  const [employees, setEmployees] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Fetch task + employee list in parallel and
   * **await** the promises so ESLint/TS knows we’ve handled them.
   */
  const loadData = useCallback(async () => {
    try {
      // ─── 1. Fetch task details (if we have an id) ────────────────────
      if (id) {
        await fetchTaskById(Number(id));
      }

      // ─── 2. Fetch employee options ───────────────────────────────────
      const data = await getEmployees();
      setEmployees(data.map((e) => ({ id: e.id, name: e.name })));
    } catch {
      notify('Failed to load task or employees', 'error');
    } finally {
      setLoadingEmployees(false);
    }
  }, [id, fetchTaskById]);

  /** Kick off initial load */
  useEffect(() => {
    void loadData(); //  👈 `void` silences “returned promise is ignored” safely
  }, [loadData]);

  // ──────────────────────────────────────────────────────────────────────
  // Form submit handler
  // ──────────────────────────────────────────────────────────────────────
  const handleSubmit = async (taskData: TaskDTO) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await modifyTask(Number(id), taskData);
      notify('Task updated successfully', 'success');
      navigate(`/tasks/${id}`);
    } catch {
      notify('Failed to update task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────
  // Render logic
  // ──────────────────────────────────────────────────────────────────────
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

  const initialData: TaskDTO = {
    title: task.title,
    description: task.description ?? '',
    deadline: task.deadline,
    employeeId: task.employeeId,
    expectedHours: task.expectedHours,
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
        initialValues={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        employees={employees}
      />
    </Container>
  );
};

export default TaskEditPage;
