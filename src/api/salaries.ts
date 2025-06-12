// src/api/salaries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { Salary, CreateSalaryPayload } from '@/utils/types';
import { QUERY_KEYS } from '@/utils/constants';

export const getSalaries = async (): Promise<Salary[]> => {
    const response = await api.get('/api/salaries');
    return response.data;
};

export const getSalaryById = async (id: string): Promise<Salary> => {
    const response = await api.get(`/api/salaries/${id}`);
    return response.data;
};

export const getSalariesByEmployee = async (employeeId: string): Promise<Salary[]> => {
    const response = await api.get(`/api/salaries/employee/${employeeId}`);
    return response.data;
};

export const createSalary = async (salaryData: CreateSalaryPayload): Promise<Salary> => {
    const response = await api.post('/api/salaries', salaryData);
    return response.data;
};

export const deleteSalary = async (id: string): Promise<void> => {
    await api.delete(`/api/salaries/${id}`);
};

// Add mutation hooks for better state management
export const useCreateSalary = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSalary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALARIES] });
        },
    });
};

export const useDeleteSalary = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSalary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALARIES] });
        },
    });
};

export const useSalaries = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.SALARIES],
        queryFn: getSalaries,
    });
};

export const useSalaryById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SALARIES, id],
        queryFn: () => getSalaryById(id),
        enabled: !!id,
    });
};

export const useSalariesByEmployee = (employeeId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SALARIES, employeeId],
        queryFn: () => getSalariesByEmployee(employeeId),
        enabled: !!employeeId,
    });
};