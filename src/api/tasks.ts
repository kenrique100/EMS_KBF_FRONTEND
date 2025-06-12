// src/api/tasks.ts
import api from '@/config/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '@/utils/constants';
import { Task, TaskActionDTO, CreateTaskDTO } from '@/utils/types';
import { useNotification } from '@/contexts/NotificationContext';

export const useTasks = () => {
    return useQuery<Task[]>({
        queryKey: [QUERY_KEYS.TASKS],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.TASKS);
            return data;
        },
    });
};

export const useTasksByEmployee = (employeeId: string) => {
    return useQuery<Task[]>({
        queryKey: [QUERY_KEYS.TASKS, employeeId],
        queryFn: async () => {
            const { data } = await api.get(`${API_ENDPOINTS.TASKS}/employee/${employeeId}`);
            return data;
        },
    });
};

export const useTask = (id: string) => {
    return useQuery<Task>({
        queryKey: [QUERY_KEYS.TASKS, id],
        queryFn: async () => {
            const { data } = await api.get(`${API_ENDPOINTS.TASKS}/${id}`);
            return data;
        },
    });
};

export const getTasks = async () => {
    const { data } = await api.get(API_ENDPOINTS.TASKS);
    return data;
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: (taskData: CreateTaskDTO) => api.post(API_ENDPOINTS.TASKS, taskData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
            showNotification('Task created successfully', 'success');
        },
        onError: (error: Error) => {
            showNotification(error.message, 'error');
        }
    });
};

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: (actionDTO: TaskActionDTO) =>
          api.put(`${API_ENDPOINTS.TASKS}/status`, actionDTO),
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] }),
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, variables.taskId] })
            ]);
            showNotification('Task status updated successfully', 'success');
        },
        onError: (error: Error) => {
            showNotification(error.message, 'error');
        }
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: (id: string) => api.delete(`${API_ENDPOINTS.TASKS}/${id}`),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
            showNotification('Task deleted successfully', 'success');
        },
        onError: (error: Error) => {
            showNotification(error.message, 'error');
        }
    });
};