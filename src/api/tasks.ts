// src/api/task.ts
import apiClient from '../utils/apiClient';
import { Task, TaskDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const getTasks = async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
};

export const getTasksForEmployee = async (employeeId: number): Promise<Task[]> => {
    const response = await apiClient.get(`/tasks/employee/${employeeId}`);
    return response.data;
};

export const getTaskById = async (id: number): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
};

export const createTask = async (task: TaskDTO): Promise<Task> => {
    const response = await apiClient.post('/tasks', task);
    return response.data;
};

export const updateTask = async (id: number, task: TaskDTO): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}`, task);
    return response.data;
};

export const updateTaskStatus = async (taskId: number, action: string): Promise<Task> => {
    const response = await apiClient.put(`/tasks/status`, { taskId, action });
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
};

export const useTasks = () => {
    return useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: getTasks,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};