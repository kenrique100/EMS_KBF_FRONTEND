import api from '../config/axios';

interface Task {
    id: number;
    title: string;
    description: string;
    deadline: string;
    employeeId: number;
    status: string;
    expectedHours?: number;
    actualHours?: number;
}

export const getTasks = async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
};

export const getTaskById = async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

export const getTasksByEmployee = async (employeeId: number): Promise<Task[]> => {
    const response = await api.get(`/tasks/employee/${employeeId}`);
    return response.data;
};

export const getTasksByStatus = async (
    employeeId: number,
    status: string
): Promise<Task[]> => {
    const response = await api.get(`/tasks/employee/${employeeId}/status/${status}`);
    return response.data;
};

export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

export const updateTaskStatus = async (
    taskId: number,
    action: string
): Promise<Task> => {
    const response = await api.put('/tasks/status', { taskId, action });
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
};