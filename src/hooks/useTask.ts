// src/hooks/useTask.ts
import { useState, useCallback } from 'react';
import { notify } from '@/store/notificationService';
import {
  getTaskById,
  updateTask,
  deleteTask as deleteTaskApi,
  updateTaskStatus as updateTaskStatusApi,
  validateTask as validateTaskApi
} from '@/api/tasks';
import { Task, TaskDTO, TaskValidationDTO } from '@/types';

const mapTaskDTOtoTask = (dto: TaskDTO): Task => {
  return {
    id: dto.id || 0,
    title: dto.title,
    description: dto.description || '',
    deadline: dto.deadline,
    employeeId: dto.employeeId,
    employeeName: dto.employeeName || '',
    status: dto.status || 'PENDING',
    expectedHours: dto.expectedHours || 0,
    actualHours: dto.actualHours || 0,
    totalWorkedMinutes: dto.totalWorkedMinutes || 0,
    startTime: dto.startTime,
    stopTime: dto.stopTime,
    lastResumeTime: dto.lastResumeTime,
    isValidated: dto.isValidated || false,
    validationTime: dto.validationTime,
    createdAt: dto.createdAt || new Date().toISOString(),
    updatedAt: dto.updatedAt || new Date().toISOString(),
  };
};

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
      setError('Failed to fetch task');
      notify('Failed to fetch task', 'error');
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
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: number, action: string) => {
    setLoading(true);
    try {
      const updatedTaskDTO = await updateTaskStatusApi(taskId, action);
      const mapped = mapTaskDTOtoTask(updatedTaskDTO);
      setTask(mapped);
      setError(null);
      return mapped;
    } catch (err) {
      setError('Failed to update task status');
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
      setError('Failed to validate task');
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
    validateTask,
    deleteTask,
  };
};

export default useTask;