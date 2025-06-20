// src/hooks/useTask.ts
import { useState, useCallback } from 'react';
import { notify } from '@/store/notificationService';
import {
  getTaskById,
  updateTask,
  deleteTask as deleteTaskApi,
  updateTaskStatus as updateTaskStatusApi
} from '@/api/tasks';
import { Task, TaskDTO } from '@/types';

const useTask = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskById = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await getTaskById(id);
      setTask(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch task');
      notify('Failed to fetch task', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyTask = useCallback(async (id: number, taskData: TaskDTO) => {
    setLoading(true);
    try {
      const updatedTask = await updateTask(id, taskData);
      setTask(updatedTask);
      setError(null);
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: number, action: string) => {
    setLoading(true);
    try {
      const updatedTask = await updateTaskStatusApi(taskId, action);
      setTask(updatedTask);
      setError(null);
      return updatedTask;
    } catch (err) {
      setError('Failed to update task status');
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
    } catch (err) {
      setError('Failed to delete task');
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
    deleteTask,
  };
};

export default useTask;