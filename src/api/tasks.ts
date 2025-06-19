import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '@/utils/constants';
import { TaskDTO, TaskActionDTO, CreateTaskDTO } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';
import apiClient from '@/config/apiClient';

// API FUNCTIONS

export const getTasks = async (): Promise<TaskDTO[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.TASKS);
    return data;
};

export const getTaskById = async (id: number): Promise<TaskDTO> => {
    const { data } = await apiClient.get(`${API_ENDPOINTS.TASKS}/${id}`);
    return data;
};

export const getTasksByEmployee = async (employeeId: number): Promise<TaskDTO[]> => {
    const { data } = await apiClient.get(`${API_ENDPOINTS.TASKS}/employee/${employeeId}`);
    return data;
};

export const createTask = async (taskData: CreateTaskDTO): Promise<TaskDTO> => {
    const { data } = await apiClient.post(API_ENDPOINTS.TASKS, taskData);
    return data;
};

export const updateTaskStatus = async (actionDTO: TaskActionDTO): Promise<TaskDTO> => {
    const { data } = await apiClient.put(`${API_ENDPOINTS.TASKS}/status`, actionDTO);
    return data;
};

export const updateTask = async (id: number, taskData: Partial<TaskDTO>): Promise<TaskDTO> => {
    const { data } = await apiClient.patch(`${API_ENDPOINTS.TASKS}/${id}`, taskData);
    return data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.TASKS}/${id}`);
};

// REACT QUERY HOOKS

export const useTasks = () =>
  useQuery<TaskDTO[]>({
      queryKey: [QUERY_KEYS.TASKS],
      queryFn: getTasks,
  });

export const useTaskById = (id?: number) =>
  useQuery<TaskDTO>({
      queryKey: [QUERY_KEYS.TASKS, id],
      queryFn: () => getTaskById(id!),
      enabled: !!id,
  });

export const useTasksByEmployee = (employeeId?: number) =>
  useQuery<TaskDTO[]>({
      queryKey: [QUERY_KEYS.TASKS, 'EMPLOYEE', employeeId],
      queryFn: () => getTasksByEmployee(employeeId!),
      enabled: !!employeeId,
  });

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation<TaskDTO, Error, CreateTaskDTO>({
        mutationFn: createTask,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
            showNotification('Task created successfully', 'success');
        },
        onError: (error: Error) => {
            showNotification(error.message, 'error');
        },
    });
};

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: updateTaskStatus,
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, variables.taskId] });
            showNotification('Task status updated successfully', 'success');
        },
        onError: (error: Error) => {
            showNotification(error.message, 'error');
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<TaskDTO> }) => updateTask(id, data),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, variables.id] });
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
            showNotification('Task updated successfully', 'success');
        },
        onError: (error: Error) => {
            showNotification(error.message, 'error');
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
            showNotification('Task deleted successfully', 'success');
        },
        onError: (error: Error) => {
            showNotification(error.message, 'error');
        },
    });
};
