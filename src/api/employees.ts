// src/api/employees.ts
import api from '../config/axios';
import { Employee, EmployeeFormData } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await api.get('/api/employees');
    return response.data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
    const response = await api.get(`/api/employees/${id}`);
    return response.data;
};

export const useEmployeeById = (id: string) =>
  useQuery({
      queryKey: ['employee', id],
      queryFn: () => getEmployeeById(id),
      enabled: !!id,
  });

export const createEmployee = async (formData: EmployeeFormData): Promise<Employee> => {
    const data = new FormData();
    data.append('username', formData.username);
    data.append('name', formData.name);
    data.append('password', formData.password);
    data.append('dateOfEmployment', formData.dateOfEmployment?.toISOString() || '');
    data.append('status', formData.status);

    if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
    }

    if (formData.document) {
        data.append('document', formData.document);
    }

    const response = await api.post('/api/employees', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateEmployee = async (id: string, formData: EmployeeFormData): Promise<Employee> => {
    const data = new FormData();
    data.append('username', formData.username);
    data.append('name', formData.name);
    if (formData.password) {
        data.append('password', formData.password);
    }
    data.append('dateOfEmployment', formData.dateOfEmployment?.toISOString() || '');
    data.append('status', formData.status);

    if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
    }

    if (formData.document) {
        data.append('document', formData.document);
    }

    const response = await api.put(`/api/employees/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
    await api.delete(`/api/employees/${id}`);
};