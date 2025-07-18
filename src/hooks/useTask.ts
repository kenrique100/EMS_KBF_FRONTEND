import { useState, useCallback } from 'react';
import { notify } from '@/store/notificationService';
import { mapTaskDTOtoTask } from '@/utils/taskUtils';
import {
  getTaskById,
  updateTask,
  deleteTask as deleteTaskApi,
  updateTaskStatus as updateTaskStatusApi,
  validateTask as validateTaskApi
} from '@/api/tasks';
import { Task, TaskDTO, TaskActionDTO, TaskValidationDTO } from '@/types';

const useTask = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskById = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await getTaskById(id);
      const mapped = mapTaskDTOtoTask(data);
      setTask(mapped);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch task';
      setError(message);
      notify(message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyTask = useCallback(async (id: number, taskData: TaskDTO) => {
    setLoading(true);
    try {
      const updatedTaskDTO = await updateTask(id, taskData);
      const mapped = mapTaskDTOtoTask(updatedTaskDTO);
      setTask(mapped);
      setError(null);
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      notify(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (actionDTO: TaskActionDTO) => {
    setLoading(true);
    try {
      const updatedTaskDTO = await updateTaskStatusApi(actionDTO);
      const mapped = mapTaskDTOtoTask(updatedTaskDTO);
      setTask(mapped);
      setError(null);
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task status';
      setError(message);
      notify(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateTask = useCallback(async (validationDTO: TaskValidationDTO) => {
    setLoading(true);
    try {
      const validatedTaskDTO = await validateTaskApi(validationDTO);
      const mapped = mapTaskDTOtoTask(validatedTaskDTO);
      setTask(mapped);
      setError(null);
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate task';
      setError(message);
      notify(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await deleteTaskApi(id);
      setTask(null);
      setError(null);
      return true;
    } catch (err) {
      let errorMessage = 'Failed to delete task';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err && 'response' in err) {
        const response = (err as any).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      notify(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    task,
    loading,
    error,
    fetchTaskById,
    modifyTask,
    updateTaskStatus,
    validateTask,
    deleteTask,
  };
};

export default useTask;
