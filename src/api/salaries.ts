// src/api/salaries.ts
import api from '../config/axios';
import { Salary, CreateSalaryPayload } from '@/utils/types';

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