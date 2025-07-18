// src/api/tasks.ts
// src/api/tasks.ts
import apiClient from '../utils/apiClient';
import { TaskDTO, ProductivityStatsDTO, TaskValidationDTO, TaskActionDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const getTasks = async (): Promise<TaskDTO[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
};

export const getTasksForEmployee = async (employeeId: number): Promise<TaskDTO[]> => {
    const response = await apiClient.get(`/tasks/employee-tasks/${employeeId}`);
    return response.data;
};

export const getTaskById = async (id: number): Promise<TaskDTO> => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
};

export const createTask = async (task: TaskDTO): Promise<TaskDTO> => {
    const response = await apiClient.post('/tasks', task);
    return response.data;
};

export const updateTask = async (id: number, task: TaskDTO): Promise<TaskDTO> => {
    const response = await apiClient.patch(`/tasks/${id}`, task);
    return response.data;
};

export const updateTaskStatus = async (actionDTO: TaskActionDTO): Promise<TaskDTO> => {
    const response = await apiClient.put('/tasks/status', actionDTO);
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.delete(`/tasks/${id}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error('Failed to delete task');
    }
    return response.data;
  } catch (error) {
    console.error('API delete error:', error);
    throw error;
  }
};

export const getProductivityStats = async (employeeId: number): Promise<ProductivityStatsDTO> => {
    const response = await apiClient.get(`/tasks/productivity/employee/${employeeId}`);
    return response.data;
};

export const validateTask = async (validationDTO: TaskValidationDTO): Promise<TaskDTO> => {
    const response = await apiClient.post('/tasks/validate', validationDTO);
    return response.data;
};

export const useTasks = () => {
    return useQuery<TaskDTO[]>({
        queryKey: ['tasks'],
        queryFn: getTasks,
        staleTime: 5 * 60 * 1000,
    });
};